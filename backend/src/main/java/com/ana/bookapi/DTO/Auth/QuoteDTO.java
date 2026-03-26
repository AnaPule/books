package com.ana.bookapi.DTO.Auth;

public class QuoteDTO {
    private String userId;
    private String quote;
    private String author;

    // Default constructor
    public QuoteDTO() {}

    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getQuote() { return quote; }
    public void setQuote(String quote) { this.quote = quote; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
}