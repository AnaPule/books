package com.ana.bookapi.service.book;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.ana.bookapi.models.Genre;
import com.ana.bookapi.models.book.Book;
import com.ana.bookapi.repository.BookRepo;
import com.ana.bookapi.repository.GenreRepo;
import com.ana.bookapi.models.book.userBook;
import com.ana.bookapi.repository.AuthorRepo;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.ana.bookapi.repository.UserBookRepo;
import com.ana.bookapi.service.book.BookService;
import org.springframework.web.client.RestTemplate;

@Service
public class RecommendationService {
    private final BookRepo br;
    private final AuthorRepo ar;
    private final GenreRepo gr;
    private final UserBookRepo ur;
    private final BookService bs;

    @Value("${groq.ai.key}")
    private String groqApiKey;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    public RecommendationService(
            BookRepo br,
            BookService bs,
            AuthorRepo ar,
            GenreRepo hr,
            UserBookRepo ur
    ) {
        this.br = br;
        this.ar = ar;
        this.ur = ur;
        this.gr = hr;
        this.bs = bs;
    }

    private static final double AUTHOR_WEIGHT = 0.4;
    private static final double GENRE_WEIGHT = 0.35;
    private static final int MAX_RECOMMENDATIONS = 20;

    public List<Book> getRecommendationsForUser(String userId) {
        List<Integer> positiveTypes = Arrays.asList(1, 2, 3, 4, 7);
        List<userBook> userBooks = ur.findByUserIdAndTypes(userId, positiveTypes);

        if (userBooks.isEmpty()) {
            return getPopularBooks();
        }

        Set<String> preferredAuthorIds = extractPreferredAuthors(userBooks);
        Set<String> preferredGenreIds = extractPreferredGenres(userBooks);

        List<Book> candidateBooks = getCandidateBooks(preferredAuthorIds, preferredGenreIds);
        Map<String, Double> bookScores = scoreBooks(candidateBooks, preferredAuthorIds, preferredGenreIds);

        return bookScores.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(MAX_RECOMMENDATIONS)
                .map(entry -> br.findById(entry.getKey()).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private Set<String> extractPreferredAuthors(List<userBook> userBooks) {
        return userBooks.stream()
                .map(ub -> br.findById(ub.getBookId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(Book::getAuthorId)
                .collect(Collectors.toSet());
    }

    private Set<String> extractPreferredGenres(List<userBook> userBooks) {
        return userBooks.stream()
                .map(ub -> br.findById(ub.getBookId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(Book::getGenreId)
                .collect(Collectors.toSet());
    }

    private List<Book> getCandidateBooks(Set<String> authorIds, Set<String> genreIds) {
        Set<Book> candidates = new HashSet<>();

        for (String authorId : authorIds) {
            candidates.addAll(br.findByAuthorId(authorId));
        }

        for (String genreId : genreIds) {
            candidates.addAll(br.findByGenreId(genreId));
        }

        return new ArrayList<>(candidates);
    }

    private Map<String, Double> scoreBooks(List<Book> books, Set<String> preferredAuthorIds, Set<String> preferredGenreIds) {
        Map<String, Double> scores = new HashMap<>();

        for (Book book : books) {
            double score = 0;

            if (preferredAuthorIds.contains(book.getAuthorId())) {
                score += AUTHOR_WEIGHT;
                score += 0.1;
            }

            if (preferredGenreIds.contains(book.getGenreId())) {
                score += GENRE_WEIGHT;
            }

            scores.put(book.getId(), score);
        }

        return scores;
    }

    private List<Book> getPopularBooks() {
        List<Object[]> popular = ur.findMostPopularBooks();

        return popular.stream()
                .map(result -> br.findById((String) result[0]))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }

    // Get popular books filtered for user
    public List<Book> getPopularBooksForUser(String userId) {
        List<Object[]> popular = ur.findPopularBooksExcludingDislikes(userId);

        return popular.stream()
                .map(result -> br.findById((String) result[0]))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(book -> !isBookDislikedByUser(userId, book.getId())) // Extra safety
                .collect(Collectors.toList());
    }

    // Get trending books filtered for user
    public List<Book> getTrendingBooksForUser(String userId) {
        List<Object[]> trending = ur.findTrendingBooksExcludingDislikes(userId);

        return trending.stream()
                .map(result -> br.findById((String) result[0]))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(book -> !isBookDislikedByUser(userId, book.getId()))
                .collect(Collectors.toList());
    }

    public List<Book> getFeaturedThisWeek() {
        List<Object[]> weeklyPopular = ur.findWeeklyPopularBooks();

        return weeklyPopular.stream()
                .map(result -> br.findById((String) result[0]))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .limit(12)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTrendingTopics() {
        List<Object[]> results = ur.findTrendingTopics();

        List<Map<String, Object>> topics = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> topic = new HashMap<>();
            topic.put("genreId", row[0]);
            topic.put("name", row[1]);
            topic.put("count", row[2]);
            topics.add(topic);
        }
        return topics;
    }

    public List<Map<String, Object>> getTrendingGenres() {
        List<Object[]> results = ur.findTrendingGenres();

        List<Map<String, Object>> genres = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> genre = new HashMap<>();
            genre.put("genreId", row[0]);

            // Get genre name
            Genre g = gr.findById((String) row[0]).orElse(null);
            genre.put("name", g != null ? g.getName() : "Unknown");
            genre.put("count", row[1]);
            genres.add(genre);
        }
        return genres;
    }

    // Get trending books filtered by user's favorite genres
    public List<Book> getTrendingBooksByUserGenres(String userId) {
        // Get user's preferred genres (from library, wishlist, reading, completed, favorites)
        List<Integer> positiveTypes = Arrays.asList(1, 2, 3, 4, 7);
        List<userBook> userBooks = ur.findByUserIdAndTypes(userId, positiveTypes);

        Set<String> preferredGenreIds = userBooks.stream()
                .map(ub -> br.findById(ub.getBookId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(Book::getGenreId)
                .collect(Collectors.toSet());

        if (preferredGenreIds.isEmpty()) {
            return getTrendingBooksForUser(userId);
        }

        List<Object[]> trending = ur.findTrendingBooksByGenres(userId, new ArrayList<>(preferredGenreIds));

        return trending.stream()
                .map(result -> br.findById((String) result[0]))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(book -> !isBookDislikedByUser(userId, book.getId()))
                .collect(Collectors.toList());
    }

    // Helper method to check if user disliked a book
    private boolean isBookDislikedByUser(String userId, String bookId) {
        return ur.existsByBookIdAndUserIdAndType(userId, bookId, 5); // 5 = DISLIKE
    }

    //users fav genre
    public String getUserFavoriteGenre(String userId) {
        // Get all positive interactions from user (library, wishlist, reading, completed, favorite)
        List<Integer> positiveTypes = Arrays.asList(1, 2, 3, 4, 7);
        List<userBook> userBooks = ur.findByUserIdAndTypes(userId, positiveTypes);

        if (userBooks.isEmpty()) {
            return null;
        }

        // Count genre frequencies
        Map<String, Integer> genreCount = new HashMap<>();

        for (userBook ub : userBooks) {
            Book book = br.findById(ub.getBookId()).orElse(null);
            if (book != null && book.getGenreId() != null) {
                Genre genre = gr.findById(book.getGenreId()).orElse(null);
                if (genre != null) {
                    genreCount.put(genre.getName(), genreCount.getOrDefault(genre.getName(), 0) + 1);
                }
            }
        }

        // Find the genre with highest count
        return genreCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
    }

    public List<Book> getCollaborativeRecommendations(String userId) {
        List<String> similarUserIds = findSimilarUsers(userId);

        Set<String> userBooks = ur.findByUserId(userId).stream()
                .map(userBook::getBookId)
                .collect(Collectors.toSet());

        Set<Book> recommendations = new HashSet<>();

        for (String similarUserId : similarUserIds) {
            ur.findByUserId(similarUserId).stream()
                    .filter(ub -> !userBooks.contains(ub.getBookId()))
                    .map(ub -> br.findById(ub.getBookId()))
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .forEach(recommendations::add);
        }

        return new ArrayList<>(recommendations).stream()
                .limit(MAX_RECOMMENDATIONS)
                .collect(Collectors.toList());
    }

    private List<String> findSimilarUsers(String userId) {
        Set<String> userGenres = getUserPreferredGenres(userId);
        List<Object[]> similarUsers = ur.findUsersByGenrePreferences(userId, userGenres);

        return similarUsers.stream()
                .map(result -> (String) result[0])
                .limit(10)
                .collect(Collectors.toList());
    }

    private Set<String> getUserPreferredGenres(String userId) {
        List<userBook> userBooks = ur.findByUserId(userId);

        return userBooks.stream()
                .map(ub -> br.findById(ub.getBookId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(Book::getGenreId)
                .collect(Collectors.toSet());
    }

    private Set<String> getUserPreferredAuthors(String userId) {
        List<userBook> userBooks = ur.findByUserId(userId);

        return userBooks.stream()
                .map(ub -> br.findById(ub.getBookId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(Book::getAuthorId)
                .collect(Collectors.toSet());
    }

    public List<Book> getBooksByFavoriteGenres(String userId) {
        Set<String> genres = getUserPreferredGenres(userId);
        return br.findByGenreIds(new ArrayList<>(genres));
    }

    public List<Book> getBooksByFavoriteAuthor(String userId) {
        Set<String> authors = getUserPreferredAuthors(userId);
        return br.findByAuthorIds(new ArrayList<>(authors));
    }

    public List<Book> getBooksByFavorites(String userId) {
        Set<String> genres = getUserPreferredGenres(userId);
        Set<String> authors = getUserPreferredAuthors(userId);
        return br.findByGenreIdsOrAuthorIds(new ArrayList<>(genres), new ArrayList<>(authors));
    }

    //more like this
    public List<Book> getSimilarBooks(Book sourceBook, String userId) {
        Set<Book> candidates = new HashSet<>();

        // 1. Same author (highest weight)
        candidates.addAll(br.findByAuthorId(sourceBook.getAuthorId()));

        // 2. Same genre
        candidates.addAll(br.findByGenreId(sourceBook.getGenreId()));

        // Remove the source book itself
        candidates.remove(sourceBook);

        // If userId provided, filter out disliked books
        if (userId != null) {
            // Get all disliked book IDs for this user (type 5 = DISLIKE)
            List<userBook> disliked = ur.findByUserIdAndType(userId, 5);
            Set<String> dislikedIds = disliked.stream()
                    .map(userBook::getBookId)
                    .collect(Collectors.toSet());

            // Remove disliked books from candidates
            candidates.removeIf(book -> dislikedIds.contains(book.getId()));
        }

        // Score and sort
        List<Book> scored = new ArrayList<>(candidates);
        scored.sort((a, b) -> {
            int scoreA = 0, scoreB = 0;

            // Same author = +2 points
            if (a.getAuthorId().equals(sourceBook.getAuthorId())) scoreA += 2;
            if (b.getAuthorId().equals(sourceBook.getAuthorId())) scoreB += 2;

            // Same genre = +1 point
            if (a.getGenreId().equals(sourceBook.getGenreId())) scoreA += 1;
            if (b.getGenreId().equals(sourceBook.getGenreId())) scoreB += 1;

            return Integer.compare(scoreB, scoreA);
        });

        return scored.stream()
                .limit(20)  // Hard limit
                .collect(Collectors.toList());
    }

    //AI recommendations

    //general recommends
    public List<Book> getAIRecommendations(String userId, String triggeredBookId) {
        try {
            // Get user's positive interactions
            List<Integer> positiveTypes = Arrays.asList(1, 2, 3, 4, 7, 8);
            List<userBook> userBooks = ur.findByUserIdAndTypes(userId, positiveTypes);

            if (userBooks.isEmpty()) {
                return getRecommendationsForUser(userId); // fallback to regular
            }

            // Get triggered book
            Book triggeredBook = br.findById(triggeredBookId).orElse(null);

            // Get user's liked books info
            List<Book> likedBooks = userBooks.stream()
                    .map(ub -> br.findById(ub.getBookId()))
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .limit(15)
                    .collect(Collectors.toList());

            // Get candidate books (not interacted with)
            Set<String> interactedIds = userBooks.stream()
                    .map(userBook::getBookId)
                    .collect(Collectors.toSet());

            List<Book> candidates = br.findAll().stream()
                    .filter(b -> !interactedIds.contains(b.getId()))
                    .limit(50)
                    .collect(Collectors.toList());

            // Build prompt
            String prompt = buildGroqPrompt(likedBooks, triggeredBook, candidates);

            // Call groq
            List<String> recommendedIds = callGroq(prompt);

            // Return actual books
            return recommendedIds.stream()
                    .map(id -> br.findById(id).orElse(null))
                    .filter(Objects::nonNull)
                    .limit(10)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("AI recommendations failed: " + e.getMessage());
            return getRecommendationsForUser(userId); // fallback
        }
    }

    //general classics
    public List<Book> getClassicsByAI() {
        try {
            // 1. Build prompt asking AI for classic book titles in that genre
            String prompt = String.format("""
            You are a literary mastermind, that will happily refer readers to absolute gold of any genre they specify.
            List the 30 most essential and timeless classic books in the entirety of the readers society.
            That all readers novice and/or patriot has read, re-read, loved and recommended.
            Return ONLY a JSON array of book titles.
            Example of the format to return it in: ["Book Name", "Book Name", "Book Name" ...]
            """);

            // 2. Call Groq
            List<String> classicTitles = callGroqForTitles(prompt);

            // 3. Find matching books in your database by title
            List<Book> classicBooks = new ArrayList<>();
            for (String title : classicTitles) {
                Book book = br.findByNameIgnoreCase(title);
                if (book != null) {
                    classicBooks.add(book);
                }
            }

            return classicBooks;
        } catch (Exception e) {
            System.err.println("AI classics failed: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    //get classics by user genres
    /*
    public List<Book> getClassicsByUserGenre(String userId) {
        try {
            /// Get user's favorite genre (as a name, not ID)
            String favoriteGenre = getUserFavoriteGenre(userId);

            if (favoriteGenre == null) {
                return Collections.emptyList();
            }

            // 2. Build prompt asking AI for classic book titles in that genre
            String prompt = String.format("""
            List the 10 most essential classic books in the %s genre.
            Return ONLY a JSON array of book titles.
            Example: ["Pride and Prejudice", "Jane Eyre", "Wuthering Heights"]
            """, favoriteGenre);

            // 3. Call Groq
            List<String> classicTitles = callGroqForTitles(prompt);

            // 4. Find matching books in your database by title
            List<Book> classicBooks = new ArrayList<>();
            for (String title : classicTitles) {
                Book book = br.findByNameIgnoreCase(title);
                if (book != null) {
                    classicBooks.add(book);
                }
            }
            return classicBooks;
        } catch (Exception e) {
            System.err.println("AI user genre classics failed: " + e.getMessage());
            return Collections.emptyList();
        }
    }
     */
    //general classics prompt
    private String buildClassicBooksPrompt(List<Book> books) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are a literary expert. From the following list of books in our database, identify the TRUE literary classics—works that have stood the test of time, are widely recognized as essential reading, and are considered timeless masterpieces.\n\n");
        sb.append("Books in our database are:\n");

        for (Book book : books) {
            sb.append(String.format("- ID: %s | Title: \"%s\" | Author: %s | Genre: %s\n",
                    book.getId(), book.getName(), book.getAuthorId(), book.getGenreId()));
        }

        sb.append("\nReturn ONLY a JSON array of the IDs of books that are undeniable classics. Include at least 10 books, up to 20. Format: [\"id1\", \"id2\", \"id3\"]");

        return sb.toString();
    }

    // genre classics prompt
    private String buildClassicGenrePrompt(List<Book> books, String genreName) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("You are a literary expert specializing in %s literature. From the following list of %s books in our database, identify the TRUE classics—works that are essential reading in this genre, have stood the test of time, and are considered masterpieces.\n\n", genreName, genreName));
        sb.append("Books in our database:\n");

        for (Book book : books) {
            sb.append(String.format("- ID: %s | Title: \"%s\" | Author: %s\n",
                    book.getId(), book.getName(), book.getAuthorId()));
        }

        sb.append(String.format("\nReturn ONLY a JSON array of the IDs of %s books that are undeniable classics. Include at least 5 books, up to 10. Format: [\"id1\", \"id2\", \"id3\"]", genreName));

        return sb.toString();
    }

    //general AI recommendations prompt
    private String buildGroqPrompt(List<Book> likedBooks, Book triggeredBook, List<Book> candidates) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are a book recommendation expert. The user likes these books:\n\n");

        for (int i = 0; i < Math.min(likedBooks.size(), 8); i++) {
            Book b = likedBooks.get(i);
            sb.append(String.format("%d. \"%s\"\n", i + 1, b.getName()));
        }

        if (triggeredBook != null) {
            sb.append(String.format("\nThey just clicked on: \"%s\"\n\n", triggeredBook.getName()));
        }

        sb.append("From these available books, recommend 5 they would enjoy:\n");
        for (int i = 0; i < Math.min(candidates.size(), 30); i++) {
            Book b = candidates.get(i);
            sb.append(String.format("%d. %s\n", i + 1, b.getName()));
        }

        sb.append("\nRespond ONLY with a JSON array of the recommended book titles in order of relevance.\n");
        sb.append("Example: [\"The Hobbit\", \"Dune\", \"1984\"]");

        return sb.toString();
    }

    // user genre classics  prompt
    private String buildUserGenreClassicPrompt(List<Book> books, List<String> genreIds) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are a literary expert. From the following list of books in our database, identify the TRUE classics—works that have stood the test of time, are widely recognized as essential reading, and are considered timeless masterpieces. Focus on books from these genres.\n\n");
        sb.append("Books in our database:\n");

        for (Book book : books) {
            sb.append(String.format("- ID: %s | Title: \"%s\" | Author: %s | Genre: %s\n",
                    book.getId(), book.getName(), book.getAuthorId(), book.getGenreId()));
        }

        sb.append("\nReturn ONLY a JSON array of the IDs of books that are undeniable classics. Include at least 8 books, up to 15. Format: [\"id1\", \"id2\", \"id3\"]");

        return sb.toString();
    }

    private List<String> callGroq(String prompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + groqApiKey);
            headers.set("Content-Type", "application/json");

            // Build request body (OpenAI-compatible format)
            Map<String, Object> request = new HashMap<>();
            request.put("model", "llama-3.3-70b-versatile"); // or "llama-3.1-70b-versatile"
            request.put("temperature", 0.8);
            request.put("max_tokens", 500);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", prompt));
            request.put("messages", messages);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(groqApiUrl, entity, Map.class);

            if (response.getBody() != null) {
                List<Map> choices = (List<Map>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map message = (Map) choices.get(0).get("message");
                    String content = (String) message.get("content");
                    return extractBookIdsFromText(content);
                }
            }
            return Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Groq error: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<String> callGroqForClassics(String prompt) {
        try {

            // Check prompt size before sending
            System.out.println("Prompt length: " + prompt.length() + " characters");

            // If prompt is too big, truncate
            if (prompt.length() > 10000) {
                prompt = prompt.substring(0, 10000) + "\n... [truncated]";
            }

            RestTemplate restTemplate = new RestTemplate();
            String url = groqApiUrl + "?key=" + groqApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + groqApiKey);
            headers.set("Content-Type", "application/json");

            Map<String, Object> request = new HashMap<>();
            request.put("model", "llama-3.3-70b-versatile");
            request.put("temperature", 0.3);
            request.put("max_tokens", 500);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", prompt));
            request.put("messages", messages);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getBody() != null) {
                List<Map> choices = (List<Map>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map message = (Map) choices.get(0).get("message");
                    String content = (String) message.get("content");
                    return extractBookIdsFromText(content);
                }
            }
            return Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Groq error: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<String> extractBookIdsFromText(String text) {
        try {
            // Clean the text - remove markdown code blocks if present
            String cleaned = text.trim();
            if (cleaned.startsWith("```json")) {
                cleaned = cleaned.substring(7);
            }
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.substring(3);
            }
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }
            cleaned = cleaned.trim();

            // Find JSON array of IDs
            int start = cleaned.indexOf('[');
            int end = cleaned.lastIndexOf(']');
            if (start != -1 && end != -1) {
                String jsonArray = cleaned.substring(start, end + 1);

                // Parse JSON array directly
                ObjectMapper mapper = new ObjectMapper();
                List<String> ids = mapper.readValue(jsonArray, new TypeReference<List<String>>() {});

                // Filter to only include IDs that actually exist in your database
                List<String> validIds = new ArrayList<>();
                for (String id : ids) {
                    if (br.existsById(id)) {
                        validIds.add(id);
                    } else {
                        System.out.println("AI returned non-existent ID: " + id);
                    }
                }

                if (!validIds.isEmpty()) {
                    return validIds;
                }
            }

            return Collections.emptyList();

        } catch (Exception e) {
            System.err.println("Failed to parse AI response: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<Book> getClassicsByUserGenre(String userId) {
        try {
            // 1. Get user's favorite genre name
            String favoriteGenre = getUserFavoriteGenre(userId);

            if (favoriteGenre == null) {
                return Collections.emptyList();
            }

            //System.out.println("fav genre res: "+favoriteGenre);

            // 2. Build prompt asking AI for classic book titles in that genre
            String prompt = String.format("""
            You are a literary mastermind, that will happily refer readers to absolute gold of any genre they specify.
            List the 30 most essential classic books in the %s genre.
            That all readers novice and/or patriot has read, re-read, loved and recommended.
            Return ONLY a JSON array of book titles.
            Example of the format to return it in: ["Book Name", "Book Name", "Book Name" ...]
            """, favoriteGenre);

            // 3. Call Groq
            List<String> classicTitles = callGroqForTitles(prompt);
            //System.out.println("AI res: "+classicTitles);

            // 4. Find matching books in your database by title
            List<Book> classicBooks = new ArrayList<>();
            for (String title : classicTitles) {
                Book book = br.findByNameIgnoreCase(title);
                if (book != null) {
                    classicBooks.add(book);
                }
            }

            //System.out.println("mapped res: "+classicBooks);

            return classicBooks;

        } catch (Exception e) {
            System.err.println("AI classics failed: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<String> callGroqForTitles(String prompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = groqApiUrl + "?key=" + groqApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + groqApiKey);
            headers.set("Content-Type", "application/json");

            Map<String, Object> request = new HashMap<>();
            request.put("model", "llama-3.3-70b-versatile");
            request.put("temperature", 0.3);
            request.put("max_tokens", 500);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", prompt));
            request.put("messages", messages);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getBody() != null) {
                List<Map> choices = (List<Map>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map message = (Map) choices.get(0).get("message");
                    String content = (String) message.get("content");
                    return extractTitlesFromResponse(content);
                }
            }
            return Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Groq error: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<String> extractTitlesFromResponse(String text) {
        try {
            // Clean the text
            String cleaned = text.trim();
            if (cleaned.startsWith("```json")) {
                cleaned = cleaned.substring(7);
            }
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.substring(3);
            }
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }

            // Find JSON array
            int start = cleaned.indexOf('[');
            int end = cleaned.lastIndexOf(']');
            if (start != -1 && end != -1) {
                String jsonArray = cleaned.substring(start, end + 1);
                ObjectMapper mapper = new ObjectMapper();
                return mapper.readValue(jsonArray, new TypeReference<List<String>>() {});
            }
            return Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Failed to parse AI response: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<String> fallbackMatchTitles(String text) {
        List<String> ids = new ArrayList<>();

        // Get all books from DB for matching
        List<Book> allBooks = br.findAll();

        // Look for book titles in the response
        for (Book book : allBooks) {
            if (text.toLowerCase().contains(book.getName().toLowerCase())) {
                ids.add(book.getId());
                if (ids.size() >= 5) break;
            }
        }

        return ids;
    }
}