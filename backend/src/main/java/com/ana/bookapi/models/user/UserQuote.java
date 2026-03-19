package com.ana.bookapi.models.user;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity(name = "Quote")
@Table(name = "quote", uniqueConstraints = @UniqueConstraint(
        name = "unique_user_quote_per_day",
        columnNames = {"user_id", "quote_date"}))

public class UserQuote {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "quote_text", length = 500, nullable = false)
    private String quoteText;

    @Column(name = "quote_author", length = 100, nullable = false)
    private String quoteAuthor;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "quote_date")
    private LocalDateTime quoteDate;

    // Constructors
    public UserQuote() {
        this.quoteDate = LocalDateTime.now();
    }

    public UserQuote(String userId, String quoteText, String quoteAuthor) {
        this.userId = userId;
        this.quoteText = quoteText;
        this.quoteAuthor = quoteAuthor;
        this.quoteDate = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getQuoteText() { return quoteText; }
    public void setQuoteText(String quoteText) { this.quoteText = quoteText; }

    public String getQuoteAuthor() { return quoteAuthor; }
    public void setQuoteAuthor(String quoteAuthor) { this.quoteAuthor = quoteAuthor; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public LocalDateTime getQuoteDate() { return quoteDate; }
    public void setQuoteDate(LocalDateTime quoteDate) { this.quoteDate = quoteDate; }
}