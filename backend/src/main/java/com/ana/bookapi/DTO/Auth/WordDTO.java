package com.ana.bookapi.DTO.Auth;

import jakarta.persistence.Column;

public class WordDTO {
    @Column(name = "userId")
    private String userId;

    @Column(name = "word")
    private String word;

    public WordDTO(){}//constructor

    //methods
    public String getUserId() {return userId;}
    public void setUserId(String userId) {this.userId = userId;}

    public String getWord() {return word;}
    public void setWord(String word) {this.word = word;}
}
