package com.ana.bookapi.controller;

import com.ana.bookapi.DTO.errResponse;
import com.ana.bookapi.models.book.Book;
import com.ana.bookapi.service.book.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;
    private errResponse er = new errResponse();

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // Get all books (frontend handles pagination)
    @GetMapping
    public ResponseEntity<?> getAllBooks() {
        try {
            List<Book> books = bookService.getAllBooks();
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // Get book by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookById(@PathVariable String id) {
        try {
            Book book = bookService.getBookById(id);
            return ResponseEntity.ok(book);
        } catch (RuntimeException e) {
            er.setMessage("404 error: " + e.getMessage());
            er.setStatus(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // Get book by ISBN
    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<?> getBookByIsbn(@PathVariable String isbn) {
        try {
            Book book = bookService.getBookByIsbn(isbn);
            return ResponseEntity.ok(book);
        } catch (RuntimeException e) {
            er.setMessage("404 error: " + e.getMessage());
            er.setStatus(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // Get books by author ID
    @GetMapping("/author/{authorId}")
    public ResponseEntity<?> getBooksByAuthorId(@PathVariable String authorId) {
        try {
            List<Book> books = bookService.getBooksByAuthorId(authorId);
            return ResponseEntity.ok(books);
        } catch (RuntimeException e) {
            er.setMessage("404 error: " + e.getMessage());
            er.setStatus(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // Get books by author name
    @GetMapping("/author/name/{authorName}")
    public ResponseEntity<?> getBooksByAuthorName(@PathVariable String authorName) {
        try {
            List<Book> books = bookService.getBooksByAuthorName(authorName);
            return ResponseEntity.ok(books);
        } catch (RuntimeException e) {
            er.setMessage("404 error: " + e.getMessage());
            er.setStatus(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // Get books by genre ID
    @GetMapping("/genre/{genreId}")
    public ResponseEntity<?> getBooksByGenreId(@PathVariable String genreId) {
        try {
            List<Book> books = bookService.getBooksByGenreId(genreId);
            return ResponseEntity.ok(books);
        } catch (RuntimeException e) {
            er.setMessage("404 error: " + e.getMessage());
            er.setStatus(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // Get books by genre name
    @GetMapping("/genre/name/{genreName}")
    public ResponseEntity<?> getBooksByGenreName(@PathVariable String genreName) {
        try {
            List<Book> books = bookService.getBooksByGenreName(genreName);
            return ResponseEntity.ok(books);
        } catch (RuntimeException e) {
            er.setMessage("404 error: " + e.getMessage());
            er.setStatus(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // Search books by title
    @GetMapping("/search")
    public ResponseEntity<?> searchBooks(@RequestParam String title) {
        try {
            List<Book> books = bookService.searchBooksByTitle(title);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // Get books by language
    @GetMapping("/language/{language}")
    public ResponseEntity<?> getBooksByLanguage(@PathVariable String language) {
        try {
            List<Book> books = bookService.getBooksByLanguage(language);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // Get random books
    @GetMapping("/random")
    public ResponseEntity<?> getRandomBooks() {
        try {
            List<Book> books = bookService.getRandomBooks();
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // Get books by author and genre
    @GetMapping("/author/{authorId}/genre/{genreId}")
    public ResponseEntity<?> getBooksByAuthorAndGenre(
            @PathVariable String authorId,
            @PathVariable String genreId) {
        try {
            List<Book> books = bookService.getBooksByAuthorAndGenre(authorId, genreId);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }
}