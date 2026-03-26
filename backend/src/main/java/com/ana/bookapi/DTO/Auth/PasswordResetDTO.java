package com.ana.bookapi.DTO.Auth;

public class PasswordResetDTO {

    private String email;
    private String token;
    private String password;

    public PasswordResetDTO() {}
    public PasswordResetDTO(String email) {
        this.email = email;
    }

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    public void setToken(String token) {this.token = token;}
    public void setPassword(String password) {this.password = password;}

    public String getToken() {return token;}
    public String getPassword() {return password;}

}
