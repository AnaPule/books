package com.ana.bookapi.service.external;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.SimpleDateFormat;
import java.util.*;

import com.ana.bookapi.clients.OpenLibrary;
import com.ana.bookapi.models.book.Book;
import com.ana.bookapi.models.Author;
import com.ana.bookapi.models.Genre;
import com.ana.bookapi.models.book.DiscussionRoom.Comment;
import com.ana.bookapi.models.book.DiscussionRoom.Room;
import com.ana.bookapi.repository.BookRepo;
import com.ana.bookapi.repository.GenreRepo;
import com.ana.bookapi.repository.AuthorRepo;
import com.ana.bookapi.service.book.DiscussionRoom.CommentService;
import com.ana.bookapi.service.book.DiscussionRoom.RoomService;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.ana.bookapi.clients.GoogleBooks;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.client.RestTemplate;

@Service
public class GoogleBooksSyncService {

    private final BookRepo br;
    private final GenreRepo gr;
    private final AuthorRepo ar;
    private final RoomService rs;
    private final CommentService cs;
    private final GoogleBooks gb;
    private final OpenLibrary obl;
    private final MongoTemplate mongo;

    @Value("${groq.ai.key}")
    private String groqApiKey;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    public GoogleBooksSyncService(
            BookRepo br,
            GenreRepo gr,
            AuthorRepo ar,
            RoomService rs,
            GoogleBooks gb,
            OpenLibrary obl,
            CommentService cs,
            MongoTemplate mongo) {
        this.br = br;
        this.ar = ar;
        this.gb = gb;
        this.gr = gr;
        this.cs = cs;
        this.rs = rs;
        this.obl = obl;
        this.mongo = mongo;
    }

    public Book convertMongoGoogleBookToBook(org.bson.Document document) {
        String isbn13 = document.getString("primary_isbn13");
        String isbn10 = document.getString("primary_isbn10");
        String title = document.getString("title");

        if ((isbn13 == null || isbn13.isEmpty()) && (isbn10 == null || isbn10.isEmpty())) {
            System.out.println("Book skipped - No valid ISBN (13 or 10) for title: " + title);
            return null;
        }

        if (title == null || title.isEmpty()) {
            System.out.println("Book skipped - No title");
            return null;
        }

        String authorName = document.getString("author");
        if (authorName == null || authorName.isEmpty()) {
            authorName = "Unknown Author";
        }

        Author a = createOrFindAuthor(authorName, document.getString("author_key"));
        Genre g = createOrFindGenre(document.getString("genre"));

        Book b = new Book();

        String isbn = (isbn13 != null && !isbn13.isEmpty()) ? isbn13 : isbn10;
        b.setIsbn(isbn);
        b.setName(title);
        b.setCoverArt(document.getString("book_image"));
        b.setPublisher(Optional.ofNullable(document.getString("publisher")).orElse("Unknown"));
        b.setPageCount(Optional.ofNullable(document.getInteger("page_count")).orElse(0));
        b.setSynopsis(Optional.ofNullable(document.getString("synopsis")).orElse("No description available."));
        b.setAuthorId(a.getId());
        b.setGenreId(g.getId());

        String pubDate = document.getString("published_date");
        if (pubDate != null && !pubDate.isEmpty()) {
            try {
                if (pubDate.length() == 4) {
                    SimpleDateFormat format = new SimpleDateFormat("yyyy");
                    b.setPublicationDate(format.parse(pubDate));
                } else if (pubDate.length() == 7) {
                    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM");
                    b.setPublicationDate(format.parse(pubDate));
                } else {
                    try {
                        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                        b.setPublicationDate(format.parse(pubDate));
                    } catch (Exception e) {
                        b.setPublicationDate(new Date());
                    }
                }
            } catch (Exception e) {
                System.out.println("Failed to parse date: " + pubDate + " - " + e.getMessage());
                b.setPublicationDate(new Date());
            }
        } else {
            b.setPublicationDate(new Date());
        }

        return b;
    }

    public int saveGoogleBooksToMongo() {
        int totalBooksSavedToMongo = 0;
        try {
            totalBooksSavedToMongo = gb.GetAndSaveGoogleBooksToMongo();
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while saving new google books to the mongo database: " + e.getMessage());
        }
        return totalBooksSavedToMongo;
    }

    public List<Book> syncGoogleBooksFromMongoToPostgres() {
        List<Book> synced = new ArrayList<>();

        List<org.bson.Document> mongoBooks = mongo.findAll(org.bson.Document.class, "GoogleBooks");
        for (org.bson.Document book : mongoBooks) {
            try {
                Book b = convertMongoGoogleBookToBook(book);

                if (b == null) {
                    System.out.println("Book skipped - conversion returned null");
                    continue;
                }

                if (!br.existsByIsbn(b.getIsbn())) {
                    Book savedBook = br.save(b);
                    if (savedBook != null) {
                        Room r = createOrFindRoom(b.getId(), savedBook.getName());
                    }
                    synced.add(savedBook);
                } else {
                    System.out.println("Book skipped - ISBN already exists: " + b.getIsbn());
                }
            } catch (Exception e) {
                System.out.println("Error saving book to Postgres DB: " + e.getMessage());
            }
        }
        return synced;
    }

    public int syncOpenLibraryBooksToMongo() {
        try {
            return gb.getBooksFromOpenLibraryBySubjects();
        } catch (Exception e) {
            throw new RuntimeException("Error syncing Open Library books: " + e.getMessage());
        }
    }

    //helper methods
    private Room createOrFindRoom(String book_id, String book_title) {
        try {
            Room room = rs.createNewMainRoom(book_id, book_title);

            cs.PostComment(new Comment(
                    room.getId(),
                    "Pages & Parchment",
                    null,
                    false,
                    String.format("""
                            <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif; padding: 8px 0;">
                                <p style="font-size: 15px; line-height: 1.5; color: #1d1d1f; margin: 0 0 12px 0;">
                                    Dearest gentle reader.<br />
                                    Welcome to <strong>%s</strong>.
                                </p>
                                <p style="font-size: 15px; line-height: 1.5; color: #1d1d1f; margin: 0 0 20px 0;">
                                    We're glad to have you here. Before you join the conversation, here are a few gentle reminders.
                                </p>
                                <p style="font-size: 15px; font-weight: 600; color: #1d1d1f; margin: 0 0 10px 0;">
                                    📖 Room Guidelines
                                </p>
                                <ol style="margin: 0 0 20px 0; padding-left: 20px; color: #1d1d1f; font-size: 14px; line-height: 1.6;">
                                    <li style="margin-bottom: 6px;">Be kind. Every reader is on their own journey.</li>
                                    <li style="margin-bottom: 6px;">No spoilers without warning. Use spoiler tags when needed.</li>
                                    <li style="margin-bottom: 6px;">Respect differing interpretations. That's what makes reading beautiful.</li>
                                    <li style="margin-bottom: 6px;">Stay on topic. Each subroom has its own focus.</li>
                                    <li style="margin-bottom: 6px;">Report don't engage. If something feels off, let us know.</li>
                                </ol>
                                <p style="font-size: 14px; color: #86868b; margin: 0 0 8px 0;">
                                    That's all. Now, go on — share your thoughts, ask questions, and enjoy the discussion.
                                </p>
                                <p style="font-size: 14px; color: #c9a394; margin: 0; font-style: italic;">
                                    — The Pages & Parchment team
                                </p>
                            </div>
                            """, room.getName())
            ));

            Book book = br.findById(book_id).orElse(null);
            String authorName = "Unknown Author";
            if (book != null) {
                Author author = ar.findById(book.getAuthorId()).orElse(null);
                if (author != null) {
                    authorName = author.getName();
                }
            }

            Thread.sleep(1000);

            try {
                createCharacterAnalysisRoom(room.getId(), book_id, book_title);
            } catch (Exception e) {
                System.err.println("Failed to create Character Analysis room: " + e.getMessage());
            }

            Thread.sleep(1500);

            /*
            try {
                createPlotDevicesRoom(room.getId(), book_id, book_title);
            } catch (Exception e) {
                System.err.println("Failed to create Plot Devices room: " + e.getMessage());
            }
             */

            return room;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Room creation interrupted: " + e.getMessage());
        } catch (RuntimeException e) {
            throw new RuntimeException("Room already exists: " + e);
        }
    }

    private Author createOrFindAuthor(String name, String authorKey) {
        String authorName = (name == null || name.trim().isEmpty()) ? "Unknown Author" : name;
        Optional<Author> existingAuthor = ar.findByName(authorName);

        if (existingAuthor.isPresent()) {
            return existingAuthor.get();
        }

        Author newAuthor = new Author();
        newAuthor.setName(authorName);

        if (authorKey != null && !authorKey.isEmpty()) {
            try {
                String url = "https://openlibrary.org" + authorKey + ".json";
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .GET()
                        .build();
                HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    Document authorData = Document.parse(response.body());

                    Object bio = authorData.get("bio");
                    if (bio != null) {
                        if (bio instanceof String) {
                            newAuthor.setBiography((String) bio);
                        } else if (bio instanceof Document) {
                            newAuthor.setBiography(((Document) bio).getString("value"));
                        }
                    }

                    String birthDate = authorData.getString("birth_date");
                    if (birthDate != null) {
                        try {
                            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                            newAuthor.setDob(format.parse(birthDate));
                        } catch (Exception e) {
                            try {
                                SimpleDateFormat yearFormat = new SimpleDateFormat("yyyy");
                                newAuthor.setDob(yearFormat.parse(birthDate));
                            } catch (Exception ex) {
                            }
                        }
                    }

                    List<Integer> photos = (List<Integer>) authorData.get("photos");
                    if (photos != null && !photos.isEmpty()) {
                        Integer photoId = photos.get(0);
                        newAuthor.setImage("https://covers.openlibrary.org/a/id/" + photoId + "-M.jpg");
                    }
                }
                Thread.sleep(100);
            } catch (Exception e) {
                System.out.println("Error fetching author details: " + e.getMessage());
            }
        }

        return ar.save(newAuthor);
    }

    private Genre createOrFindGenre(String name) {
        String genreName = (name == null || name.trim().isEmpty()) ? "Unknown Genre" : name;

        Optional<Genre> existingGenre = gr.findByName(genreName);
        if (existingGenre.isPresent()) {
            return existingGenre.get();
        }

        Genre newGenre = new Genre();
        newGenre.setName(genreName);
        return gr.save(newGenre);
    }

    // ==================== GROQ API CALL ====================

    private String callGroq(String prompt) {
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
                        return content;
                    }
                }
                return null;

            } catch (Exception e) {
                String errorMsg = e.getMessage();
                if (errorMsg.contains("429") || errorMsg.contains("rate_limit")) {
                    System.err.println("Rate limit hit. Attempt " + attempt + " of " + maxRetries + ". Waiting " + retryDelay / 1000 + " seconds...");
                    try {
                        Thread.sleep(retryDelay);
                        retryDelay = retryDelay * 2;
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        return null;
                    }
                } else {
                    System.err.println("Groq error: " + e.getMessage());
                    return null;
                }
            }
        }
        return null;
    }

    private String cleanAIResponse(String content) {
        String cleaned = content.trim();
        if (cleaned.startsWith("```html")) {
            cleaned = cleaned.substring(7);
        }
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }

    private Room createCharacterAnalysisRoom(String parentRoomId, String bookId, String bookTitle) {
        String prompt = String.format("""
                Write a concise, well-formatted HTML character analysis for the book "%s".
                
                Requirements:
                1. Use <h3> for the main title, <h4> for each character
                2. Cover 3-5 main characters only
                3. For each character: brief description, key traits, role in story
                4. NO SPOILERS - talk about characters in general terms
                5. Keep it under 500 words
                6. Use <p> for paragraphs
                7. Return ONLY clean HTML, no markdown
                """, bookTitle);

        String aiContent = callGroq(prompt);
        if (aiContent == null) {
            aiContent = "<p>Character analysis could not be generated at this time. Please check back later.</p>";
        }

        aiContent = cleanAIResponse(aiContent);

        Room characterRoom = new Room();
        characterRoom.setBookId(bookId);
        characterRoom.setParentId(parentRoomId);
        characterRoom.setName("Character Analysis");
        characterRoom.setType(3);
        characterRoom.setCreatorId("Pages & Parchment");
        characterRoom.setDeleted(false);

        Room savedRoom = rs.createNewSubRoom(characterRoom);
        cs.PostComment(new Comment(savedRoom.getId(), "Pages & Parchment", null,false, aiContent));

        return savedRoom;
    }

    private Room createPlotDevicesRoom(String parentRoomId, String bookId, String bookTitle) {
        String prompt = String.format("""
                Write a concise, well-formatted HTML analysis of plot structure and literary devices in "%s".
                
                Requirements:
                1. Use <h3> for section titles
                2. Cover: narrative structure, point of view, pacing, foreshadowing (generally)
                3. Discuss literary devices used (metaphor, imagery, etc.) without revealing plot points
                4. NO SPOILERS WHATSOEVER - talk about HOW the story is told, not WHAT happens
                5. Keep it under 400 words
                6. Return ONLY clean HTML, no markdown
                """, bookTitle);

        String aiContent = callGroq(prompt);
        if (aiContent == null) {
            aiContent = "<p>Plot and literary devices analysis could not be generated at this time. Please check back later.</p>";
        }

        aiContent = cleanAIResponse(aiContent);

        Room plotRoom = new Room();
        plotRoom.setBookId(bookId);
        plotRoom.setParentId(parentRoomId);
        plotRoom.setName("Plot & Literary Devices");
        plotRoom.setType(3);
        plotRoom.setCreatorId("Pages & Parchment");
        plotRoom.setDeleted(false);

        Room savedRoom = rs.createNewSubRoom(plotRoom);
        cs.PostComment(new Comment(savedRoom.getId(), "Pages & Parchment", null,false, aiContent));

        return savedRoom;
    }
}