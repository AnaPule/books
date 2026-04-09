package com.ana.bookapi.clients;

//====================== packages ====================//

import org.bson.Document;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@Component
public class GoogleBooks {
    @Value("${google.api.key}")
    private String googleApiKey;
    private OpenLibrary openLibrary;
    private final MongoTemplate mongoTemplate;

    //default constructor
    public GoogleBooks(MongoTemplate mongoTemplate, OpenLibrary openLibrary) {

        this.mongoTemplate = mongoTemplate;
        this.openLibrary = openLibrary;
    }

    //methods
    public int GetAndSaveGoogleBooksToMongo() {
        System.out.println("Get Google Books");
        int TotalBooksRetrievedForMongo = 0;

        String[] subjects = {
                // Classic Literature
                "classic+literature", "victorian+literature", "english+literature", "american+literature",
                "russian+literature", "french+literature", "gothic+fiction", "romanticism",

                // Fantasy & Sci-Fi
                "fantasy", "high+fantasy", "epic+fantasy", "dark+fantasy", "urban+fantasy",
                "science+fiction", "cyberpunk", "space+opera", "dystopian", "steampunk",
                "paranormal+fantasy", "magical+realism", "mythology", "fairy+tales",

                // Romance
                "romance", "contemporary+romance", "historical+romance", "paranormal+romance",
                "dark+romance", "mafia+romance", "romantic+comedy", "erotica", "new+adult+romance",

                // Mystery & Thriller
                "mystery", "thriller", "psychological+thriller", "crime+fiction", "suspense",
                "detective+fiction", "noir", "cozy+mystery", "legal+thriller", "spy+fiction",

                // Horror
                "horror", "psychological+horror", "supernatural+horror", "cosmic+horror",
                "ghost+stories", "vampire+fiction", "werewolf+fiction", "zombie+fiction",

                // Young Adult & Children
                "young+adult", "ya+fantasy", "ya+romance", "ya+contemporary", "ya+dystopian",
                "childrens+books", "middle+grade", "picture+books", "early+readers",

                // Manga & Comics
                "manga", "shonen", "shojo", "seinen", "josei", "webtoons", "manhwa", "manhua",
                "graphic+novels", "comics", "superhero+comics", "indie+comics",

                // Poetry & Drama
                "poetry", "modern+poetry", "classic+poetry", "epic+poetry", "sonnets",
                "drama", "plays", "shakespeare", "screenplays", "theatre",

                // Non-Fiction
                "biography", "autobiography", "memoir", "history", "world+history",
                "philosophy", "psychology", "self+help", "business", "economics",
                "science", "physics", "biology", "astronomy", "technology", "computers",
                "cooking", "travel", "art", "music", "photography", "architecture",

                // Religious & Spiritual
                "christian+fiction", "christian+romance", "christian+living", "bible+studies",
                "spirituality", "religion", "inspirational", "faith", "theology", "bible",

                // Contemporary & Literary
                "literary+fiction", "contemporary+fiction", "womens+fiction", "lgbtq+fiction",
                "diverse+voices", "bipoc+literature", "translated+fiction", "short+stories",

                // Adventure & Action
                "adventure", "action", "swashbuckler", "western", "historical+adventure",
                "survival+fiction", "sea+adventure", "exploration", "quest",

                // Special Interests
                "lgbtq+romance", "disability+literature", "mental+health+fiction",
                "climate+fiction", "afrofuturism", "indigenous+literature", "asian+literature"
        };

        HttpClient client = HttpClient.newHttpClient();
        //String url = "https://www.googleapis.com/books/v1/volumes?q="+subjects.toString()+"&key="+apiKey;

        for (String subject : subjects) {
            try {
                String url = "https://www.googleapis.com/books/v1/volumes?q=subject:" + subject + "&orderBy=newest&key=" + googleApiKey;
                //String url = "https://www.googleapis.com/books/v1/volumes/key=" + apiKey;
                //System.out.println("Google books fetch URL: " + url);
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .GET()
                        .build();
                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    TotalBooksRetrievedForMongo += extractAndSaveGoogleBook(response.body(), subject);
                    //System.out.println("Processed subject: " + response.body());
                    Thread.sleep(5000);// Small delay to avoid rate limiting
                } else {
                    System.out.println("API Call Failed for " + subject + " with Status Code: " + response.statusCode());
                }
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
                System.out.println("ERROR GETTING BOOKS" + e.getMessage());
                throw new RuntimeException("ERROR GETTING BOOKS" + e.getMessage());
            }
        }
        return TotalBooksRetrievedForMongo;
    }

    // Modify the extraction method
    private int extractAndSaveGoogleBook(String jsonResponse, String subject) {
        org.bson.Document fullResponse = org.bson.Document.parse(jsonResponse);
        List<Document> items = (List<org.bson.Document>) fullResponse.get("items");
        int totalSavedBooks = 0;

        if (items == null || items.isEmpty()) {
            System.out.println("No items found for subject: " + subject);
            return 0;
        }

        for (org.bson.Document item : items) {
            try {
                org.bson.Document volumeInfo = (org.bson.Document) item.get("volumeInfo");
                org.bson.Document accessInfo = (org.bson.Document) item.get("accessInfo");

                if (volumeInfo != null && accessInfo != null) {
                    // Create initial book document
                    org.bson.Document book = new org.bson.Document();

                    // Try to get ISBN
                    String isbn13 = extractISBN13(volumeInfo);
                    String isbn10 = extractISBN10(volumeInfo);

                    // If no ISBN, try to search Open Library by title/author
                    if (isbn13 == null && isbn10 == null) {
                        String title = volumeInfo.getString("title");
                        String author = getFirstAuthor(volumeInfo);

                        System.out.println("No ISBN for: " + title + " - searching Open Library...");
                        Document enriched = openLibrary.searchBookByTitleAuthor(title, author);

                        if (enriched != null) {
                            // Use enriched data to fill gaps
                            isbn13 = enriched.getString("primary_isbn13");
                            isbn10 = enriched.getString("primary_isbn10");

                            // Enrich any missing fields
                            if (volumeInfo.getString("description") == null) {
                                volumeInfo.put("description", enriched.getString("synopsis"));
                            }
                            if (volumeInfo.get("imageLinks") == null && enriched.getString("book_image") != null) {
                                Document cover = new Document();
                                cover.put("thumbnail", enriched.getString("book_image"));
                                volumeInfo.put("imageLinks", cover);
                            }
                        }
                    }

                    // If we have ISBN, try to enrich missing data
                    if (isbn13 != null || isbn10 != null) {
                        String isbnToUse = isbn13 != null ? isbn13 : isbn10;
                        Document enriched = openLibrary.enrichBookByISBN(isbnToUse);

                        if (enriched != null) {
                            // Fill in missing fields from Open Library
                            if (volumeInfo.getString("description") == null) {
                                volumeInfo.put("description", enriched.getString("synopsis"));
                            }
                            if (volumeInfo.getString("publisher") == null) {
                                volumeInfo.put("publisher", enriched.getString("publisher"));
                            }
                            if (volumeInfo.getInteger("pageCount") == null) {
                                volumeInfo.put("pageCount", enriched.getInteger("page_count"));
                            }
                            if (volumeInfo.get("imageLinks") == null && enriched.getString("book_image") != null) {
                                Document cover = new Document();
                                cover.put("thumbnail", enriched.getString("book_image"));
                                volumeInfo.put("imageLinks", cover);
                            }
                        }
                    }

                    // Now build the book document (same as before)
                    book.put("id", item.getString("id"));
                    book.put("title", volumeInfo.getString("title"));
                    book.put("author", getFirstAuthor(volumeInfo));
                    book.put("synopsis", volumeInfo.getString("description"));
                    book.put("publisher", volumeInfo.getString("publisher"));
                    book.put("published_date", volumeInfo.getString("publishedDate"));
                    book.put("page_count", volumeInfo.getInteger("pageCount"));
                    book.put("previewLink", volumeInfo.getString("previewLink"));
                    book.put("webReaderLink", accessInfo.getString("webReaderLink"));
                    book.put("primary_isbn13", isbn13);
                    book.put("primary_isbn10", isbn10);

                    // Cover image
                    org.bson.Document imageLinks = (org.bson.Document) volumeInfo.get("imageLinks");
                    if (imageLinks != null) {
                        book.put("book_image", imageLinks.getString("thumbnail"));
                    } else {
                        book.put("book_image", null);
                    }

                    book.put("genre", subject);
                    book.put("categories", volumeInfo.get("categories"));
                    book.put("language", volumeInfo.getString("language"));
                    book.put("authors", volumeInfo.get("authors"));
                    book.put("author_key", null);

                    // Save to MongoDB
                    mongoTemplate.save(book, "GoogleBooks");
                    totalSavedBooks++;

                    // Small delay for rate limiting
                    Thread.sleep(200);
                }
            } catch (Exception e) {
                System.out.println("Error processing book: " + e.getMessage());
            }
        }
        return totalSavedBooks;
    }

    //helper methods
    private String getFirstAuthor(org.bson.Document volumeInfo) {
        List<String> authors = (List<String>) volumeInfo.get("authors");
        if (authors != null && !authors.isEmpty()) {
            return authors.get(0);
        }
        return "Unknown Author";
    }

    private String extractISBN13(org.bson.Document volumeInfo) {
        List<org.bson.Document> identifiers = (List<org.bson.Document>) volumeInfo.get("industryIdentifiers");
        if (identifiers != null) {
            for (org.bson.Document identifier : identifiers) {
                if ("ISBN_13".equals(identifier.getString("type"))) {
                    return identifier.getString("identifier");
                }
            }
        }
        return null;
    }

    private String extractISBN10(org.bson.Document volumeInfo) {
        List<org.bson.Document> identifiers = (List<org.bson.Document>) volumeInfo.get("industryIdentifiers");
        if (identifiers != null) {
            for (org.bson.Document identifier : identifiers) {
                if ("ISBN_10".equals(identifier.getString("type"))) {
                    return identifier.getString("identifier");
                }
            }
        }
        return null;
    }

    /**
     * Get books directly from Open Library for niche genres
     */
    public int getBooksFromOpenLibraryBySubjects() {
        System.out.println("Getting books from Open Library...");
        int totalRetrieved = 0;

        // Niche genres that Google Books might miss
        String[] nicheSubjects = {
                // Manga & Comics (already have)
                "manga", "webtoon", "manhwa", "manhua", "light_novels",
                "comics", "graphic_novels", "japanese_comics",

                // Missing from Google Books (empty results)
                "dark fantasy", "urban fantasy", "magical realism",
                "dark romance", "new adult romance", "cosmic horror",
                "middle grade", "picture books", "shojo",
                "indie comics", "diverse voices",
                "swashbuckler",

                // Niche genres Google Books struggled with
                "gothic fiction", "romanticism", "cyberpunk", "steampunk",
                "dystopian", "noir", "afrofuturism", "climate_fiction",
                "indigenous literature",

                // Additional genres
                "grimdark", "slice of life", "isekai", "yaoi", "yuri",
                "shonen", "seinen", "josei", "biographical comics",
                "historical fiction", "mythology",
                "lovecraftian", "satire", "absurdist_fiction",

                "english literature", "vampire", "vampire romance", "mafia romance"
        };

        for (String subject : nicheSubjects) {
            try {
                System.out.println("Fetching Open Library books for: " + subject);
                List<Document> books = openLibrary.getBooksBySubject(subject, 80); // list of works found in this genre right - but these works dont have all the attributes you want.
                //so we send these works to a helper method to get all attributes desired

                for (Document book : books) {
                    // Add the genre/subject
                    book.put("genre", subject);
                    book.put("source", "OpenLibrary");

                    // Save to MongoDB
                    mongoTemplate.save(book, "GoogleBooks");
                    totalRetrieved++;
                    Thread.sleep(200); // Rate limiting
                }

                System.out.println("Retrieved " + books.size() + " books for " + subject);
                Thread.sleep(2000); // Delay between subjects

            } catch (Exception e) {
                System.out.println("Error fetching Open Library books for " + subject + ": " + e.getMessage());
            }
        }

        return totalRetrieved;
    }
}
