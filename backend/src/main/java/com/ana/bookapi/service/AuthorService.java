package com.ana.bookapi.service;

import com.ana.bookapi.models.Author;
import com.ana.bookapi.repository.AuthorRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthorService {

    private final AuthorRepo authorRepo;

    public AuthorService(AuthorRepo authorRepo) {
        this.authorRepo = authorRepo;
    }

    // Get author by ID
    public Author getAuthorById(String id) {
        return authorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));
    }

    // Get author by name
    public Author getAuthorByName(String name) {
        return authorRepo.findByName(name)
                .orElseThrow(() -> new RuntimeException("Author not found with name: " + name));
    }

    // Get all authors
    public List<Author> getAllAuthors() {
        return authorRepo.findAll();
    }

    // Check if author exists by ID
    public boolean authorExists(String id) {
        return authorRepo.existsById(id);
    }

    // Check if author exists by name
    public boolean authorExistsByName(String name) {
        return authorRepo.existsByName(name);
    }

    // Get authors with pagination (if you need it)
    public List<Author> getAuthors(int limit) {
        return authorRepo.findAll().stream()
                .limit(limit)
                .toList();
    }

    // Search authors by name (case insensitive - you'll need to add this to repo)
    /*
    public List<Author> searchAuthorsByName(String keyword) {
        return authorRepo.findByNameContainingIgnoreCase(keyword);
    }
    */
}