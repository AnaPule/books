package com.ana.bookapi.service.auth;

/* =================== models =================== */
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import com.ana.bookapi.models.user.User;

/* =================== PACKAGES =================== */
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
public class JwtService {
    @Value("${security.jwt.secret-key}") private String secretKey;
    @Value("${security.jwt.expiration-time}") private long jwtExpiration;

    /* public String extractID(String token){return extractClaim(token, Claims::getSubject);} */

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    private Key getSignInKey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    //token
    public String generateTokenWithUserDetails(User user){
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("email", user.getEmail());
        extraClaims.put("username", user.getUsername());

        return generateUserToken(extraClaims, user);
    }

    private String generateUserToken(Map<String, Object> extraClaims, User user){
        return buildToken(extraClaims, user, jwtExpiration);
    }
    public long getExpirationTime(){return jwtExpiration;}

    private String buildToken(Map<String, Object> extraClaims, User user, long jwtExpiration){
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(user.getId())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails ud){
        final String username = extractUsername(token);
            boolean valid = username.equals(ud.getUsername()) && !isTokenExpired(token);
            //System.out.println("🔍 JWT Service - Token valid check: " + valid + " for user: " + username);
        return (username.equals(ud.getUsername()) && !isTokenExpired(token));
    }
    public String extractUsername(String token){return extractClaim(token, claims -> claims.get("username",String.class));}
    public boolean isTokenExpired(String token) {
        final Date expiration = extractExpiration(token);
        boolean expired = expiration.before(new Date());
            //System.out.println("🔍 JWT Service - Token expires at: " + expiration);
            //System.out.println("🔍 JWT Service - Current time: " + new Date());
            //System.out.println("🔍 JWT Service - Token expired: " + expired);
        if (expired) {
            System.out.println("Token expired at: " + expiration);
        }
        return expired;
    }
    private Date extractExpiration(String token){return extractClaim(token, Claims::getExpiration);}
    private Claims extractAllClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
