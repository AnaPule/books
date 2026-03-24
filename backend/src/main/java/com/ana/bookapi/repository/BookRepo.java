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

    @Query("SELECT b FROM Book b")
    List<Book> findAll();

    @Query("SELECT b FROM Book b WHERE b.name = :name")
    Optional<Book> findByName(@Param("name") String name);

    @Query("SELECT b FROM Book b WHERE b.id = :bookId")
    Optional<Book> findByBookId(@Param("bookId") String bookId);

    Book findByIsbn(String isbn);

    @Query("SELECT b FROM Book b WHERE b.authorId = :authorId")
    List<Book> findByAuthorId(@Param("authorId") String authorId);

    @Query("SELECT b FROM Book b WHERE b.genreId = :genreId")
    List<Book> findByGenreId(@Param("genreId") String genreId);

    @Query("SELECT b FROM Book b WHERE LOWER(b.name) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Book> findByNameContainingIgnoreCase(@Param("title") String title);

    @Query("SELECT b FROM Book b WHERE b.language = :language")
    List<Book> findByLanguage(@Param("language") String language);

    @Query(value = "SELECT * FROM book ORDER BY RANDOM() LIMIT 15", nativeQuery = true)
    List<Book> findRandomBooks();

    @Query("SELECT b FROM Book b WHERE b.authorId = :authorId AND b.genreId = :genreId")
    List<Book> findByAuthorIdAndGenreId(@Param("authorId") String authorId, @Param("genreId") String genreId);

    Book findByIsbnAndAuthorId(String isbn, String authorId);

    @Query("SELECT b FROM Book b WHERE b.genreId IN :genreIds")
    List<Book> findByGenreIds(@Param("genreIds") List<String> genreIds);

    @Query("SELECT b FROM Book b WHERE b.authorId IN :authorIds")
    List<Book> findByAuthorIds(@Param("authorIds") List<String> authorIds);

    @Query("SELECT b FROM Book b WHERE b.genreId IN :genreIds OR b.authorId IN :authorIds")
    List<Book> findByGenreIdsOrAuthorIds(@Param("genreIds") List<String> genreIds, @Param("authorIds") List<String> authorIds);

    @Query("SELECT b FROM Book b ORDER BY b.publicationDate DESC limit 20")
    List<Book> findTopByOrderByPublicationDateDesc();

    @Query("SELECT b FROM Book b WHERE LOWER(b.name) = LOWER(:name)")
    Book findByNameIgnoreCase(@Param("name") String name);

    boolean existsByIsbn(String isbn);
    boolean existsByAuthorId(String authorId);
    boolean existsByName(String name);
}