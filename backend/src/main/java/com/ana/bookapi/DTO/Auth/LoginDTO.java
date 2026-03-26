package com.ana.bookapi.DTO.Auth;

import jakarta.persistence.Column;

import java.time.LocalDateTime;


public class LoginDTO {

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "login_time")
    private LocalDateTime createdAt;

    //constructors
    public LoginDTO(){
        this.createdAt = LocalDateTime.now();
    }

    public String getEmail() { return email; }

    public String getPassword() { return password; }

}