package com.ana.bookapi.service.external;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.ana.bookapi.models.Book;
import com.ana.bookapi.models.Author;
import com.ana.bookapi.repository.BookRepo;
import com.ana.bookapi.repository.AuthorRepo;
import org.springframework.stereotype.Service;
import com.ana.bookapi.config.external.GoogleBooks;
import org.springframework.data.mongodb.core.MongoTemplate;

@Service
public class GoogleBooksSyncService {

    private final BookRepo br;
    private final AuthorRepo ar;
    private final GoogleBooks gb;
    private final MongoTemplate mongo;

    public GoogleBooksSyncService(
            BookRepo br,
            AuthorRepo ar,
            GoogleBooks gb,
            MongoTemplate mongo) {
        this.br = br;
        this.ar = ar;
        this.gb = gb;
        this.mongo = mongo;
    }

    public Book convertMongoGoogleBookToBook(org.bson.Document document) {
        Author a = createOrFindAuthor(document.getString("author"));
        Book b = new Book();

        b.setName(document.getString("title"));
        b.setCoverArt(document.getString("book_image"));
        b.setPublisher(document.getString("publisher"));
        b.setPageCount(document.getInteger("page_count"));
        b.setSynopsis(document.getString("synopsis"));
        b.setIsbn(document.getString("primary_isbn13"));
        b.setAuthorId(a.getId());

        // Handle publication date safely
        String pubDate = document.getString("published_date");
        if (pubDate != null && !pubDate.isEmpty()) {
            try {
                // Handle different date formats
                if (pubDate.length() == 4) { // Just year
                    SimpleDateFormat format = new SimpleDateFormat("yyyy");
                    b.setPublicationDate(format.parse(pubDate));
                } else if (pubDate.length() == 7) { // Year-month (yyyy-MM)
                    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM");
                    b.setPublicationDate(format.parse(pubDate));
                } else { // Full date
                    // Try common formats
                    try {
                        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                        b.setPublicationDate(format.parse(pubDate));
                    } catch (Exception e) {
                        // Fallback to current date
                        b.setPublicationDate(new Date());
                    }
                }
            } catch (Exception e) {
                System.out.println("Failed to parse date: " + pubDate + " - " + e.getMessage());
                b.setPublicationDate(new Date()); // Fallback to now
            }
        } else {
            b.setPublicationDate(new Date()); // Fallback to now if no date
        }

        return b;
    }

    public int saveGoogleBooksToMongo() {
        int totalBooksSavedToMongo = 0;
        try {
            totalBooksSavedToMongo = gb.GetAndSaveGoogleBooksToMongo();
        } catch (Exception e) {
            //System.out.println("An error occurred while saving new google books to the mongo database" + e.getMessage());
            throw new RuntimeException("An error occurred while saving new google books to the mongo database: " + e.getMessage());
        }
        return totalBooksSavedToMongo;
    }

    public List<Book> syncGoogleBooksFromMongoToPostgres() {
        List<Book> synced = new ArrayList<>();

        //get all books from mongo
        List<org.bson.Document> mongoBooks = mongo.findAll(org.bson.Document.class, "GoogleBooks");
        for (org.bson.Document book : mongoBooks) {
            try {
                Book b = convertMongoGoogleBookToBook(book);

                /* Check each required field
                System.out.println("ISBN: " + b.getIsbn());
                System.out.println("Name: " + b.getName());
                System.out.println("CoverArt: " + b.getCoverArt());
                System.out.println("Publisher: " + b.getPublisher());
                System.out.println("PageCount: " + b.getPageCount());
                 */

                //check if book exists in postgres byISBN
                if (b.getIsbn() != null & !br.existsByIsbn(b.getIsbn())) {
                    Book savedBook = br.save(b); // save the book if not in db
                    synced.add(savedBook);
                } else {
                    System.out.println("Book skipped - " +
                            (b.getIsbn() == null ? "No ISBN" : "ISBN already exists"));
                    //System.out.println("The book has already been saved");
                }
            } catch (Exception e) {
                System.out.println("er saving book to Postgres DB: " + e.getMessage());
            }

        }
        return synced;
    }

    //helper methods
    private Author createOrFindAuthor(String name) {
        String authorName = (name == null || name.trim().isEmpty()) ? "Unknown Author" : name;
        // Check if author already exists
        Optional<Author> existingAuthor = ar.findByName(authorName);
        if (existingAuthor.isPresent()) {
            return existingAuthor.get();
        }

        // Create new author only if it doesn't exist
        Author newAuthor = new Author();
        newAuthor.setName(authorName);
        return ar.save(newAuthor);
    }
}
