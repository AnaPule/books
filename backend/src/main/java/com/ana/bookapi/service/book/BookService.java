package com.ana.bookapi.service.book;

import com.ana.bookapi.models.book.Book;
import com.ana.bookapi.repository.BookRepo;
import com.ana.bookapi.models.Author;
import com.ana.bookapi.repository.AuthorRepo;
import com.ana.bookapi.models.Genre;
import com.ana.bookapi.repository.GenreRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepo bookRepo;
    private final AuthorRepo authorRepo;
    private final GenreRepo genreRepo;

    public BookService(BookRepo bookRepo, AuthorRepo authorRepo, GenreRepo genreRepo) {
        this.bookRepo = bookRepo;
        this.authorRepo = authorRepo;
        this.genreRepo = genreRepo;
    }

    // Get individual book by ID
    public Book getBookById(String id) {
        return bookRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }

    // Get individual book by ISBN
    public Book getBookByIsbn(String isbn) {
        Book book = bookRepo.findByIsbn(isbn);
        if (book == null) {
            throw new RuntimeException("Book not found with ISBN: " + isbn);
        }
        return book;
    }

    // Get books by author ID
    public List<Book> getBooksByAuthorId(String authorId) {
        if (!authorRepo.existsById(authorId)) {
            throw new RuntimeException("Author not found with id: " + authorId);
        }
        return bookRepo.findByAuthorId(authorId);
    }

    // Get books by author name
    public List<Book> getBooksByAuthorName(String authorName) {
        Author author = authorRepo.findByName(authorName)
                .orElseThrow(() -> new RuntimeException("Author not found: " + authorName));
        return bookRepo.findByAuthorId(author.getId());
    }

    // Get books by genre ID
    public List<Book> getBooksByGenreId(String genreId) {
        if (!genreRepo.existsById(genreId)) {
            throw new RuntimeException("Genre not found with id: " + genreId);
        }
        return bookRepo.findByGenreId(genreId);
    }

    // Get books by genre name
    public List<Book> getBooksByGenreName(String genreName) {
        Genre genre = genreRepo.findByName(genreName)
                .orElseThrow(() -> new RuntimeException("Genre not found: " + genreName));
        return bookRepo.findByGenreId(genre.getId());
    }

    // Get all books
    public List<Book> getAllBooks() {
        return bookRepo.findAll();
    }

    // Search books by title
    public List<Book> searchBooksByTitle(String title) {
        return bookRepo.findByNameContainingIgnoreCase(title);
    }

    //get book by title
    public Book searchBookByTitle(String title) {
        return bookRepo.findByName(title).orElseThrow(() -> new RuntimeException("Book not found"));
    }

    // Get books by language
    public List<Book> getBooksByLanguage(String language) {
        return bookRepo.findByLanguage(language);
    }

    // Get random books (frontend will take what it needs)
    public List<Book> getRandomBooks() {
        return bookRepo.findRandomBooks();
    }

    // Get books by author and genre
    public List<Book> getBooksByAuthorAndGenre(String authorId, String genreId) {
        return bookRepo.findByAuthorIdAndGenreId(authorId, genreId);
    }
}