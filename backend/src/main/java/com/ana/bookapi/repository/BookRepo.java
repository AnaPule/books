package com.ana.bookapi.repository;

import com.ana.bookapi.models.Book;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface BookRepo extends JpaRepository<Book, String> {

    boolean existsByIsbn(String isbn);
    boolean existsByAuthorId(String authorId);
    boolean existsByName(String name);

    Book findByIsbn(String isbn);
    Book findByAuthorId(String authorId); // Fixed method name
    Book findByIsbnAndAuthorId(String isbn, String authorId); // Fixed method name
}