package com.ana.bookapi.service;

/* =================== PACKAGES =================== */

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.Value;

import java.util.Date;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

/* =================== models =================== */
import com.ana.bookapi.models.User;

@Service
public class VerificationTokenService {
    public VerificationTokenService() {
    }

    @org.springframework.beans.factory.annotation.Value("${verification.expiration}")
    private long exp;
    @org.springframework.beans.factory.annotation.Value("${verification.secret}")
    private String secret;
    @org.springframework.beans.factory.annotation.Value("${resend.api.key}")
    private String resendApiKey;

    public String generateVerificationToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userID", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + exp))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public String validateVerificationToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject(); // returns email if valid
        } catch (Exception e) {
            System.out.println("Token validation failed: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            return null; //invalid/ expired
        }
    }
}
