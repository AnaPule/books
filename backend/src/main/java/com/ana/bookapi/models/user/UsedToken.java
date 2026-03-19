package com.ana.bookapi.models.user;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usedToken")
public class UsedToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "token", unique = true, nullable = false, length = 500)
    private String token;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "used_at", nullable = false)
    private LocalDateTime usedAt;

    @Column(name = "token_type", nullable = false)
    private String tokenType; // "VERIFICATION" or "PASSWORD_RESET"

    public UsedToken() {}

    public UsedToken(String token, String email, String tokenType) {
        this.token = token;
        this.email = email;
        this.tokenType = tokenType;
        this.usedAt = LocalDateTime.now();
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getUsedAt() { return usedAt; }
    public void setUsedAt(LocalDateTime usedAt) { this.usedAt = usedAt; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
}