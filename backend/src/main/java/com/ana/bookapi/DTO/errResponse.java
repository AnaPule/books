package com.ana.bookapi.DTO;

import jakarta.persistence.Column;

public class errResponse {
    @Column(name = "status")
    private int status;

    @Column(name = "message")
    private String message;

    //constructors
    public errResponse() {}

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
