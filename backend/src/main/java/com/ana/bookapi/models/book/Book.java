package com.ana.bookapi.models.book;

import jakarta.persistence.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "book")
public class Book {

    public Book() {
        this.id = UUID.randomUUID().toString();
    }

    @Id
    @Column(name = "id", length = 70) private String id;
    @Column(name = "author_id", nullable = false, length = 70) private String authorId; //FK
    @Column(name="genre_id", nullable = false, length = 70) private String genreId;
    @Column(name = "name", nullable = false, length = 100) private String name;
    @Column(name = "cover_art", nullable = true, length = 500) private String coverArt; // display book name and book with pretty colour instead if unavailable
    @Column(name = "publisher", nullable = false, length = 100) private String publisher; //display publisher, but never unknown-
    @Column(name = "publication_date", nullable = false) private Date publicationDate;
    @Column(name = "page_count", nullable = false) private Integer pageCount;
    @Column(name = "synopsis", nullable = false, length = 10000) private String synopsis;
    @Column(name = "isbn", unique = true, nullable = false, length = 50) private String isbn;
    @Column(name = "language", nullable = false, length = 10) private String language = "en";

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getGenreId() { return genreId; }
    public void setGenreId(String genreId) { this.genreId = genreId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCoverArt() { return coverArt; }
    public void setCoverArt(String coverArt) { this.coverArt = coverArt; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }

    public Date getPublicationDate() { return publicationDate; }
    public void setPublicationDate(Date publicationDate) { this.publicationDate = publicationDate; }

    public Integer getPageCount() { return pageCount; }
    public void setPageCount(Integer pageCount) { this.pageCount = pageCount; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}