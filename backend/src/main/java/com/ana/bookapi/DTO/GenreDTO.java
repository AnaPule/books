package com.ana.bookapi.DTO;

import com.ana.bookapi.models.Genre;

public class GenreDTO {
    private String id;
    private String name;

    public GenreDTO() {}

    public GenreDTO(Genre genre) {
        this.id = genre.getId();
        this.name = genre.getName();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}