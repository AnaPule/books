package com.ana.bookapi.repository;

import com.ana.bookapi.models.book.Book;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepo extends JpaRepository<Book, String> {

    // Get by ID
    @Query("SELECT b FROM Book b WHERE b.id = :bookId")
    Optional<Book> findByBookId(@Param("bookId") String bookId);

    // Get by ISBN
    Book findByIsbn(String isbn);

    // Get by Author ID
    @Query("SELECT b FROM Book b WHERE b.authorId = :authorId")
    List<Book> findByAuthorId(@Param("authorId") String authorId);

    // Get by Genre ID
    @Query("SELECT b FROM Book b WHERE b.genreId = :genreId")
    List<Book> findByGenreId(@Param("genreId") String genreId);

    // Search by title (case insensitive)
    @Query("SELECT b FROM Book b WHERE LOWER(b.name) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Book> findByNameContainingIgnoreCase(@Param("title") String title);

    // Get by language
    @Query("SELECT b FROM Book b WHERE b.language = :language")
    List<Book> findByLanguage(@Param("language") String language);

    // Get random books (PostgreSQL)
    @Query(value = "SELECT * FROM book ORDER BY RANDOM()", nativeQuery = true)
    List<Book> findRandomBooks();

    // Get by Author AND Genre
    @Query("SELECT b FROM Book b WHERE b.authorId = :authorId AND b.genreId = :genreId")
    List<Book> findByAuthorIdAndGenreId(@Param("authorId") String authorId, @Param("genreId") String genreId);

    // Get by ISBN and Author
    Book findByIsbnAndAuthorId(String isbn, String authorId);

    // Existence checks
    boolean existsByIsbn(String isbn);
    boolean existsByAuthorId(String authorId);
    boolean existsByName(String name);
}