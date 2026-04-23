package com.ana.bookapi.service.book;

import java.util.*;
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

    public List<Book> getPopularBooksForUser(String userId) {
        List<Object[]> popular = ur.findPopularBooksExcludingDislikes(userId);

        return popular.stream()
                .map(result -> br.findById((String) result[0]))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(book -> !isBookDislikedByUser(userId, book.getId()))
                .collect(Collectors.toList());
    }

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

            Genre g = gr.findById((String) row[0]).orElse(null);
            genre.put("name", g != null ? g.getName() : "Unknown");
            genre.put("count", row[1]);
            genres.add(genre);
        }
        return genres;
    }

    public List<Book> getTrendingBooksByUserGenres(String userId) {
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

    private boolean isBookDislikedByUser(String userId, String bookId) {
        return ur.existsByBookIdAndUserIdAndType(userId, bookId, 5);
    }

    public String getUserFavoriteGenre(String userId) {
        List<Integer> positiveTypes = Arrays.asList(1, 2, 3, 4, 7);
        List<userBook> userBooks = ur.findByUserIdAndTypes(userId, positiveTypes);

        if (userBooks.isEmpty()) {
            return null;
        }

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

    public List<Book> getSimilarBooks(Book sourceBook, String userId) {
        Set<Book> candidates = new HashSet<>();

        candidates.addAll(br.findByAuthorId(sourceBook.getAuthorId()));
        candidates.addAll(br.findByGenreId(sourceBook.getGenreId()));
        candidates.remove(sourceBook);

        if (userId != null) {
            List<userBook> disliked = ur.findByUserIdAndType(userId, 5);
            Set<String> dislikedIds = disliked.stream()
                    .map(userBook::getBookId)
                    .collect(Collectors.toSet());
            candidates.removeIf(book -> dislikedIds.contains(book.getId()));
        }

        List<Book> scored = new ArrayList<>(candidates);
        scored.sort((a, b) -> {
            int scoreA = 0, scoreB = 0;
            if (a.getAuthorId().equals(sourceBook.getAuthorId())) scoreA += 2;
            if (b.getAuthorId().equals(sourceBook.getAuthorId())) scoreB += 2;
            if (a.getGenreId().equals(sourceBook.getGenreId())) scoreA += 1;
            if (b.getGenreId().equals(sourceBook.getGenreId())) scoreB += 1;
            return Integer.compare(scoreB, scoreA);
        });

        return scored.stream().limit(20).collect(Collectors.toList());
    }

    // ==================== GROQ AI METHODS (Recommendations & Classics) ====================

    public List<Book> getAIRecommendations(String userId, String triggeredBookId) {
        try {
            List<Integer> positiveTypes = Arrays.asList(1, 2, 3, 4, 7, 8);
            List<userBook> userBooks = ur.findByUserIdAndTypes(userId, positiveTypes);

            if (userBooks.isEmpty()) {
                return getRecommendationsForUser(userId);
            }

            Book triggeredBook = br.findById(triggeredBookId).orElse(null);

            List<Book> likedBooks = userBooks.stream()
                    .map(ub -> br.findById(ub.getBookId()))
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .limit(15)
                    .collect(Collectors.toList());

            Set<String> interactedIds = userBooks.stream()
                    .map(userBook::getBookId)
                    .collect(Collectors.toSet());

            List<Book> candidates = br.findAll().stream()
                    .filter(b -> !interactedIds.contains(b.getId()))
                    .limit(50)
                    .collect(Collectors.toList());

            String prompt = buildGroqPrompt(likedBooks, triggeredBook, candidates);
            List<String> recommendedIds = callGroq(prompt);

            return recommendedIds.stream()
                    .map(id -> br.findById(id).orElse(null))
                    .filter(Objects::nonNull)
                    .limit(10)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("AI recommendations failed: " + e.getMessage());
            return getRecommendationsForUser(userId);
        }
    }

    public List<Book> getClassicsByAI() {
        try {
            String prompt = """
            You are a literary mastermind that recommends essential classic books.
            List the 30 most essential and timeless classic books that all readers should know.
            Return ONLY a JSON array of book titles.
            Example: ["Book Name", "Book Name", "Book Name"]
            """;

            List<String> classicTitles = callGroqForTitles(prompt);

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

    public List<Book> getClassicsByUserGenre(String userId) {
        try {
            String favoriteGenre = getUserFavoriteGenre(userId);
            if (favoriteGenre == null) {
                return Collections.emptyList();
            }

            String prompt = String.format("""
            You are a literary mastermind that recommends essential classic books.
            List the 30 most essential classic books in the %s genre.
            Return ONLY a JSON array of book titles.
            Example: ["Book Name", "Book Name", "Book Name"]
            """, favoriteGenre);

            List<String> classicTitles = callGroqForTitles(prompt);

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

        sb.append("\nRespond ONLY with a JSON array of the recommended book IDs in order of relevance.\n");
        sb.append("Example: [\"id1\", \"id2\", \"id3\"]");

        return sb.toString();
    }

    // ==================== GROQ API CALLS ====================

    private List<String> callGroq(String prompt) {
        int maxRetries = 5;
        int retryDelay = 5000;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                RestTemplate restTemplate = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", "Bearer " + groqApiKey);
                headers.set("Content-Type", "application/json");

                Map<String, Object> request = new HashMap<>();
                request.put("model", "llama-3.3-70b-versatile");
                request.put("temperature", 0.7);
                request.put("max_tokens", 800);

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
                String errorMsg = e.getMessage();
                if (errorMsg.contains("429") || errorMsg.contains("rate_limit")) {
                    System.err.println("Rate limit hit. Attempt " + attempt + " of " + maxRetries + ". Waiting " + retryDelay/1000 + " seconds...");
                    try {
                        Thread.sleep(retryDelay);
                        retryDelay = retryDelay * 2;
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        return Collections.emptyList();
                    }
                } else {
                    System.err.println("Groq error: " + e.getMessage());
                    return Collections.emptyList();
                }
            }
        }
        return Collections.emptyList();
    }

    private List<String> callGroqForTitles(String prompt) {
        int maxRetries = 5;
        int retryDelay = 5000;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                RestTemplate restTemplate = new RestTemplate();
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
                ResponseEntity<Map> response = restTemplate.postForEntity(groqApiUrl, entity, Map.class);

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
                String errorMsg = e.getMessage();
                if (errorMsg.contains("429") || errorMsg.contains("rate_limit")) {
                    System.err.println("Rate limit hit. Attempt " + attempt + " of " + maxRetries + ". Waiting " + retryDelay/1000 + " seconds...");
                    try {
                        Thread.sleep(retryDelay);
                        retryDelay = retryDelay * 2;
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        return Collections.emptyList();
                    }
                } else {
                    System.err.println("Groq error: " + e.getMessage());
                    return Collections.emptyList();
                }
            }
        }
        return Collections.emptyList();
    }

    private List<String> extractBookIdsFromText(String text) {
        try {
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

            int start = cleaned.indexOf('[');
            int end = cleaned.lastIndexOf(']');
            if (start != -1 && end != -1) {
                String jsonArray = cleaned.substring(start, end + 1);
                ObjectMapper mapper = new ObjectMapper();
                List<String> ids = mapper.readValue(jsonArray, new TypeReference<List<String>>() {});

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

    private List<String> extractTitlesFromResponse(String text) {
        try {
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

    /* --------------------- DISCUSSION ROOM ALGORITHM ------------------*/
    public List<Object[]> getPopularRooms() {
        return ur.findMostPopularRooms();
    }
}