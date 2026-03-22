package com.ana.bookapi.repository;

import java.util.Optional;
import com.ana.bookapi.models.Genre;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface GenreRepo extends JpaRepository<Genre, String> {
    Optional<Genre> findByName(String name);
    Optional<Genre> findById(String id);
    boolean existsByName(String name);
    boolean existsById(String genreId);
}
