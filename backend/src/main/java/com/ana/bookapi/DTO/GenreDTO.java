package com.ana.bookapi.DTO;

import com.ana.bookapi.models.Author;

public class AuthorDTO {
    private String id;
    private String name;

    public AuthorDTO() {}

    public AuthorDTO(Author author) {
        this.id = author.getId();
        this.name = author.getName();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}