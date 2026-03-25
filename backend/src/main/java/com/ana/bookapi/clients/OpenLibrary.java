package com.ana.bookapi.clients;

import java.net.URI;
import java.util.List;

import org.bson.Document;

import java.io.IOException;
import java.util.ArrayList;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.stereotype.Component;
import org.springframework.data.mongodb.core.MongoTemplate;


@Component
public class OpenLibrary {
    private final MongoTemplate mongoTemplate;
    private final HttpClient client;

    public OpenLibrary(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
        this.client = HttpClient.newHttpClient();
    }

    //search by isbn - enrich existing book data or null if not found
    public Document enrichBookByISBN(String isbn) {
        try {
            String cleanIsbn = isbn.replaceAll("[^0-9]", "");//clean isbn
            String url = "https://openlibrary.org/api/books?bibkeys=ISBN:" + cleanIsbn +
                    "&format=json&jscmd=data";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();//open library api call by isbn

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200 && !response.body().equals("{}")) {
                return parseOpenLibraryResponse(response.body(), cleanIsbn);
            }
        } catch (IOException | InterruptedException e) {
            System.out.println("Error enriching book with ISBN " + isbn + ": " + e.getMessage());
        }
        return null;
    }

    //search by author
    public Document searchBookByTitleAuthor(String title, String author) {
        try {
            // Build search query
            String query = title.replace(" ", "+");
            if (author != null && !author.equals("Unknown Author")) {
                query += "+author:" + author.replace(" ", "+");
            }

            String url = "https://openlibrary.org/search.json?q=" + query + "&limit=1";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return parseSearchResponse(response.body());
            }
        } catch (IOException | InterruptedException e) {
            System.out.println("Error searching Open Library: " + e.getMessage());
        }
        return null;
    }

    public List<Document> getBooksBySubject(String subject, int limit) {
        List<Document> books = new ArrayList<>();

        try {
            String url = "https://openlibrary.org/subjects/" + subject.toLowerCase().replace(" ", "_") +
                    ".json?limit=" + limit; // we get all the works from the subject...

            //System.out.println("Fetching URL: " + url);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            //System.out.println("Response: " + response.body().substring(0, Math.min(500, response.body().length())));

            if (response.statusCode() == 200) {
                org.bson.Document fullResponse = org.bson.Document.parse(response.body());
                List<Document> works = (List<Document>) fullResponse.get("works"); // extracting the piece of the response with the data

                if (works != null) {
                    //System.out.println("Found " + works.size() + " works in Open Library");
                    for (Document work : works) {
                        Document enriched = enrichWorkWithDetails(work); // helper method gets all attributes of the book we want...
                        if (enriched != null) {
                            enriched.put("synopsis", work.getString("description")); // this is in the work endpoint, so i get it from here instead of the helper method
                            books.add(enriched);
                        }
                        Thread.sleep(100); // Rate limiting
                    }
                }
            }
        } catch (IOException | InterruptedException e) {
            System.out.println("Error fetching books for subject " + subject + ": " + e.getMessage());
        }

        return books;
    }

    // Helper methods for parsing responses
    private Document parseOpenLibraryResponse(String jsonResponse, String isbn) {
        try {
            Document fullResponse = Document.parse(jsonResponse);
            String key = "ISBN:" + isbn;
            Document bookData = (Document) fullResponse.get(key);

            if (bookData == null) return null;

            Document enriched = new Document();

            // Extract useful fields
            enriched.put("primary_isbn13", isbn);
            enriched.put("title", bookData.getString("title"));

            // Authors
            List<Document> authors = (List<Document>) bookData.get("authors");
            if (authors != null && !authors.isEmpty()) {
                List<String> authorNames = new ArrayList<>();
                for (Document author : authors) {
                    Document authorInfo = (Document) author.get("author");
                    if (authorInfo != null) {
                        authorNames.add(authorInfo.getString("name"));
                    }
                }
                if (!authorNames.isEmpty()) {
                    enriched.put("authors", authorNames);
                    enriched.put("author", authorNames.get(0));
                }
            }

            // Description (handle both string and object formats)
            Object description = bookData.get("description");
            if (description != null) {
                if (description instanceof String) {
                    enriched.put("synopsis", description);
                } else if (description instanceof Document) {
                    enriched.put("synopsis", ((Document) description).getString("value"));
                }
            }

            // Publisher and publish date
            List<Document> publishers = (List<Document>) bookData.get("publishers");
            if (publishers != null && !publishers.isEmpty()) {
                enriched.put("publisher", publishers.get(0).getString("name"));
            }

            enriched.put("published_date", bookData.getString("publish_date"));
            Object pageCount = bookData.get("number_of_pages");
            enriched.put("page_count", pageCount != null ? (pageCount instanceof Integer ? pageCount : Integer.parseInt(pageCount.toString())) : 0);

            // Cover image
            Document cover = (Document) bookData.get("cover");
            if (cover != null) {
                String coverId = cover.getString("id");
                if (coverId != null) {
                    enriched.put("book_image", "https://covers.openlibrary.org/b/id/" + coverId + "-M.jpg");
                }
            }

            // ISBN10 if available
            List<String> isbn10s = (List<String>) bookData.get("isbn_10");
            if (isbn10s != null && !isbn10s.isEmpty()) {
                enriched.put("primary_isbn10", isbn10s.get(0));
            }

            return enriched;

        } catch (Exception e) {
            System.out.println("Error parsing Open Library response: " + e.getMessage());
            return null;
        }
    }

    private Document parseSearchResponse(String jsonResponse) {
        try {
            Document fullResponse = Document.parse(jsonResponse);
            List<Document> docs = (List<Document>) fullResponse.get("docs");

            if (docs != null && !docs.isEmpty()) {
                Document firstBook = docs.get(0);
                Document enriched = new Document();

                enriched.put("title", firstBook.getString("title"));

                // Authors
                List<String> authors = (List<String>) firstBook.get("author_name");
                if (authors != null && !authors.isEmpty()) {
                    enriched.put("authors", authors);
                    enriched.put("author", authors.get(0));
                }

                // ISBN
                List<String> isbns = (List<String>) firstBook.get("isbn");
                if (isbns != null && !isbns.isEmpty()) {
                    enriched.put("primary_isbn13", isbns.get(0));
                }

                Object publishYear = firstBook.get("first_publish_year");
                if (publishYear != null) {
                    enriched.put("published_date", publishYear.toString());
                }

                Object pageCount = firstBook.get("number_of_pages_median");
                if (pageCount != null) {
                    enriched.put("page_count", pageCount instanceof Integer ? pageCount : Integer.parseInt(pageCount.toString()));
                }

                // Cover
                Long coverId = firstBook.getLong("cover_i");
                if (coverId != null) {
                    enriched.put("book_image", "https://covers.openlibrary.org/b/id/" + coverId + "-M.jpg");
                }

                return enriched;
            }
        } catch (Exception e) {
            System.out.println("Error parsing search response: " + e.getMessage());
        }
        return null;
    }

    private Document enrichWorkWithDetails(Document work) {
        try {
            String key = work.getString("key"); // essentially the id of the book right
            if (key == null) return null;

            String url = "https://openlibrary.org" + key + "/editions.json?limit=1&offset=1";
            //System.out.println("Fetching URL - enrich with details: " + url);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build(); // get details

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            //System.out.println("Response - enrich details:: " + response.body().substring(0, Math.min(500, response.body().length())));

            if (response.statusCode() != 200) return null;

            Document fullResponse = Document.parse(response.body());
            List<Document> entries = (List<Document>) fullResponse.get("entries");
            //System.out.println("Entries - enriched: " + entries);

            if (entries == null || entries.isEmpty()) {
                return null;
            }
            Document edition = entries.get(0);
            Document book = new Document();

            //basic info
            book.put("id", key);
            book.put("title", edition.getString("title"));

            List<String> isbn13s = (List<String>) edition.get("isbn_13");
            if (isbn13s != null && !isbn13s.isEmpty()) {
                book.put("primary_isbn13", isbn13s.get(0));
            }

            List<String> isbn10s = (List<String>) edition.get("isbn_10");
            if (isbn10s != null && !isbn10s.isEmpty()) {
                book.put("primary_isbn10", isbn10s.get(0));
            }

            // author details
            List<Document> authors = (List<Document>) edition.get("authors");
            if (authors != null && !authors.isEmpty()) {
                Document firstAuthorRef = authors.get(0);
                String authorKey = firstAuthorRef.getString("key");
                if (authorKey != null) {
                    String authorUrl = "https://openlibrary.org" + authorKey + ".json";
                    HttpRequest authorRequest = HttpRequest.newBuilder()
                            .uri(URI.create(authorUrl))
                            .GET()
                            .build();
                    HttpResponse<String> authorResponse = client.send(authorRequest, HttpResponse.BodyHandlers.ofString());

                    if (authorResponse.statusCode() == 200) {
                        Document authorDoc = Document.parse(authorResponse.body());
                        String authorName = authorDoc.getString("name");
                        if (authorName != null) {
                            book.put("author_key", authorKey);
                            book.put("author", authorName);
                        }
                    } else {
                        book.put("author", "Unknown");
                    }
                    Thread.sleep(100);
                }
            }

            // Page count
            Integer pageCount = edition.getInteger("number_of_pages");
            book.put("page_count", pageCount != null ? pageCount : 0);

            // Published date
            book.put("published_date", edition.getString("publish_date"));

            // Publisher
            List<String> publishers = (List<String>) edition.get("publishers");
            if (publishers != null && !publishers.isEmpty()) {
                book.put("publisher", publishers.get(0));
            }

            // Cover image
            List<Integer> covers = (List<Integer>) edition.get("covers");
            if (covers != null && !covers.isEmpty()) {
                Integer coverId = covers.get(0);
                book.put("book_image", "https://covers.openlibrary.org/b/id/" + coverId + "-M.jpg");
            }

            // Language - not in edition, keep default
            book.put("language", "en");

            // Categories/subjects from the original work
            List<String> subjects = (List<String>) work.get("subject");
            if (subjects != null && !subjects.isEmpty()) {
                book.put("categories", subjects);
            }

            //synopsis - gotten in og function

            return book;

        } catch (Exception e) {
            System.out.println("Error enriching work: " + e.getMessage());
            return null;
        }
    }
}
