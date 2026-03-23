package com.ana.bookapi.DTO;

import com.ana.bookapi.models.Genre;
import com.ana.bookapi.models.book.Book;
import com.ana.bookapi.models.Author;
import java.util.Date;

public class BookDTO {
    private String id;
    private String name;
    private String coverArt;
    private String isbn;
    private AuthorDTO author;
    private GenreDTO genre;
    private String synopsis;
    private String publisher;
    private Integer pageCount;
    private Date publicationDate;
    private String language;

    // Default constructor
    public BookDTO() {}

    // Constructor from Book entity
    public BookDTO(Book book, Author author, Genre genre) {
        this.id = book.getId();
        this.name = book.getName();
        this.coverArt = book.getCoverArt();
        this.isbn = book.getIsbn();
        this.author = new AuthorDTO(author);
        this.synopsis = book.getSynopsis();
        this.publisher = book.getPublisher();
        this.pageCount = book.getPageCount();
        this.publicationDate = book.getPublicationDate();
        this.language = book.getLanguage();
        this.genre = new GenreDTO(genre);

    }

    public BookDTO(Book book, Author author) {
        this.id = book.getId();
        this.name = book.getName();
        this.coverArt = book.getCoverArt();
        this.isbn = book.getIsbn();
        this.author = new AuthorDTO(author);
        this.synopsis = book.getSynopsis();
        this.publisher = book.getPublisher();
        this.pageCount = book.getPageCount();
        this.publicationDate = book.getPublicationDate();
        this.language = book.getLanguage();

    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCoverArt() { return coverArt; }
    public void setCoverArt(String coverArt) { this.coverArt = coverArt; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public AuthorDTO getAuthor() { return author; }
    public void setAuthor(AuthorDTO author) { this.author = author; }

    public GenreDTO getGenre() { return genre; }
    public void setGenre(GenreDTO genre) { this.genre = genre; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }

    public Integer getPageCount() { return pageCount; }
    public void setPageCount(Integer pageCount) { this.pageCount = pageCount; }

    public Date getPublicationDate() { return publicationDate; }
    public void setPublicationDate(Date publicationDate) { this.publicationDate = publicationDate; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}