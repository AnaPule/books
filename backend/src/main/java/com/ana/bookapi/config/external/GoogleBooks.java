package com.ana.bookapi.config.external;

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
    private final MongoTemplate mongoTemplate;

    //default constructor
    public GoogleBooks(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
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

    private int extractAndSaveGoogleBook(String jsonResponse, String subject) {
        org.bson.Document fullResponse = org.bson.Document.parse(jsonResponse); // raw json response
        List<Document> items = (List<org.bson.Document>) fullResponse.get("items");// get the list array of books
        int totalSavedBooks = 0;

        if (items == null || items.isEmpty()) {
            System.out.println("No items found for subject: " + subject);
            return 0; // Early return
        }

        // loop through each book in the items array
        for (org.bson.Document item : items) {
            try {
                org.bson.Document volumeInfo = (org.bson.Document) item.get("volumeInfo");
                org.bson.Document accessInfo = (org.bson.Document) item.get("accessInfo");

                if (volumeInfo != null && accessInfo != null) {
                    // Create a clean book document with only the fields we need
                    org.bson.Document book = new org.bson.Document();

                    // Basic book info
                    book.put("id", item.getString("id"));
                    book.put("title", volumeInfo.getString("title"));
                    book.put("author", getFirstAuthor(volumeInfo));
                    book.put("synopsis", volumeInfo.getString("description"));
                    book.put("publisher", volumeInfo.getString("publisher"));
                    book.put("published_date", volumeInfo.getString("publishedDate"));
                    book.put("page_count", volumeInfo.getInteger("pageCount"));
                    book.put("previewLink", volumeInfo.getString("previewLink"));
                    book.put("webReaderLink", accessInfo.getString("webReaderLink"));
                    //book.put("average_rating", volumeInfo.getInteger("averageRating"));
                    //book.put("ratings_count", volumeInfo.getInteger("ratingsCount"));

                    // ISBN
                    book.put("primary_isbn13", extractISBN13(volumeInfo));
                    book.put("primary_isbn10", extractISBN10(volumeInfo));

                    // Cover image
                    org.bson.Document imageLinks = (org.bson.Document) volumeInfo.get("imageLinks");
                    if (imageLinks != null) {
                        book.put("book_image", imageLinks.getString("thumbnail"));
                    }

                    // Categories and subject and authors
                    book.put("genre", subject);
                    book.put("categories", volumeInfo.get("categories"));
                    //book.put("subject", subject); -> not looping through non right now
                    book.put("language", volumeInfo.getString("language"));
                    book.put("authors", volumeInfo.get("authors"));

                    mongoTemplate.save(book, "GoogleBooks");
                    totalSavedBooks++;
                }
                //System.out.println("Saved " + totalSavedBooks + " individual books to MongoDB!");
            } catch (Exception e) {
                //System.out.println("Error processing book: " + e.getMessage());
                throw new RuntimeException("Error processing book: " + e.getMessage());
            }// end of try catch;
        }//end of for loop
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
}
