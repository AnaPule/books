package com.ana.bookapi.DTO;

import com.ana.bookapi.models.book.Book;

public class userBookDTO {

    public userBookDTO(Book book, Integer type, String userId, String bookId) {
        this.book = book;
        this.type = type;
        this.userId = userId;
        this.bookId = bookId;
    }

    public userBookDTO(Book book, Integer type) {
        this.book = book;
        this.type = type;
    }

    private Book book;
    private Integer type;
    private String bookId;
    private String userId;

    public Book getBook() {return this.book;}
    public void setBook(Book book) {this.book = book;}

    public Integer getType() {return this.type;}
    public void setType(Integer type) {this.type = type;}

    public String getBookId() {return this.bookId;}
    public void setBookId(String bookId) {this.bookId = bookId;}

    public String getUserId() {return this.userId;}
    public void setUserId(String userId) {this.userId = userId;}
}
