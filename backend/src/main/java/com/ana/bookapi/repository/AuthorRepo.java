package com.ana.bookapi.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ana.bookapi.models.Author;

public interface AuthorRepo extends JpaRepository<Author, String> {
    Optional<Author> findById(String id);
    Optional<Author> findByName(String name);

    boolean existsByName(String name);
}