package com.ana.bookapi.service.auth;

/* =================== PACKAGES =================== */

import java.util.Date;

import com.ana.bookapi.models.user.UsedToken;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

/* =================== models =================== */
import com.ana.bookapi.models.user.User;
import com.ana.bookapi.repository.auth.UsedTokenRepo;

@Service
public class VerificationTokenService {
    private final UsedTokenRepo utr;

    public VerificationTokenService(UsedTokenRepo utr) {
        this.utr = utr;
    }

    @org.springframework.beans.factory.annotation.Value("${verification.expiration}")
    private long exp;
    @org.springframework.beans.factory.annotation.Value("${verification.secret}")
    private String secret;

    public String generateVerificationToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userID", user.getId())
                .claim("type", "VERIFICATION")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + exp))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public String validateVerificationToken(String token) {
        try {

            // Check if token was already used
            if (utr.existsByToken(token)) {
                System.out.println("Token has already been used");
                return null;
            }

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String email = claims.getSubject();
            String tokenType = claims.get("type", String.class);

            // Mark token as used
            UsedToken usedToken = new UsedToken(token, email, tokenType);
            utr.save(usedToken);

            return email; // returns email if valid
        } catch (Exception e) {
            System.out.println("Token validation failed: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            return null;//invalid/ expired
        }
    }
}
