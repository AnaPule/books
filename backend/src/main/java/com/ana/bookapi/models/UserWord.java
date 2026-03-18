package com.ana.bookapi.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Entity(name = "Word")
public class UserWord {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(name = "word", length = 50, nullable = false)
    private String word;

    @Column(name = "user_id", nullable = false)
    private String userId; //FK

    @Column(name = "word_date")
    private LocalDateTime wordDate;

    //constructor
    public UserWord() {
        this.wordDate = LocalDateTime.now();
    }

    public UserWord(String userId, String word) {
        this.userId = userId;
        this.word = word;
        this.wordDate = LocalDateTime.now();
    }

    public String getId() {return this.id;}
    public void setId(String id) {this.id = id;}

    public String getWord() {return word;}
    public void setWord(String word) {this.word = word;}

    public String getUserId() {return userId;}
    public void setUserId(String userId) {this.userId = userId;}

    public LocalDateTime getWordDate() { return wordDate; }
    public void setWordDate(LocalDateTime wordDate) { this.wordDate = wordDate; }
}
