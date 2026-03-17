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
    private final Resend resend;
    public VerificationTokenService(Resend resend) {this.resend = resend;}

    @org.springframework.beans.factory.annotation.Value("${verification.expiration}") private long exp;
    @org.springframework.beans.factory.annotation.Value("${verification.secret}") private String secret;
    @org.springframework.beans.factory.annotation.Value("${resend.api.key}") private String resendApiKey;

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
            return null; //invalid/ expired
        }
    }

    public String buildVerificationEmail(String ToEmail, String username, String verificationLink) {
        return """
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'sans', serif; background: #f8f5f2; color: #2f1e0f; line-height: 1.65; margin: 0; padding: 0; }
                        .container { max-width: 580px; margin: 40px auto; background: #fffef9; border: 1px solid #d4c0a8; border-radius: 8px; overflow: hidden; box-shadow: 0 6px 24px rgba(0,0,0,0.08); }
                        .header { background: linear-gradient(135deg, #8b7355, #a68569); padding: 42px 30px; text-align: center; }
                        .header h1 { color: #fffef9; margin: 0; font-size: 30px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 300; }
                        .content { padding: 48px 40px 36px; }
                        h2 { color: #7b5f48; font-size: 24px; margin: 0 0 24px; font-weight: 400; letter-spacing: 0.04em; }
                        p { font-size: 16px; margin: 0 0 20px; }
                        .button { display: inline-block; background: #a68569; color: #fffef9; padding: 14px 38px; text-decoration: none; border-radius: 6px; font-size: 15px; letter-spacing: 0.08em; margin: 28px 0; transition: all 0.2s; }
                        .button:hover { background: #8b7355; }
                        .footer { background: #f8f5f2; padding: 28px 40px; text-align: center; font-size: 13px; color: #6b5436; border-top: 1px solid #e8e0d5; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Pages & Parchment</h1>
                        </div>
                        <div class="content">
                            <h2>My dear %s,</h2>
                            <p>I am most gratified to welcome you into our quiet fellowship of readers and keepers of tales.</p>
                            <p>To complete your enrolment and grant you access to the shelves that await, I pray you will be so kind as to confirm your correspondence by touching the link below:</p>
                
                            <div style="text-align: center;">
                                <a href="%s" class="button">Confirm My Place Among You</a>
                            </div>
                
                            <p style="font-size: 14px; color: #6b5436; margin-top: 32px;">
                                This invitation remains open for but fifteen minutes. Should it find you otherwise engaged, pray disregard it; no offence shall be taken.
                            </p>
                        </div>
                        <div class="footer">
                            <p>Ever your servant in quiet pages,<br>
                            Pages & Parchment • Pretoria</p>
                            <p style="margin-top: 12px; font-style: italic; opacity: 0.8;">
                                Should any question arise, a reply to this missive shall find a courteous ear.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(ToEmail != null ? ToEmail : "esteemed reader", verificationLink);
    }

    public void SendEmail(String toEmail, String subject, String body) {
        Resend resend = new Resend(resendApiKey);
        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("Pages & Parchment <noreply_morwetsana.pule@gmail.com>")
                .to(toEmail)
                .subject(subject)
                .html(body)
                .build();
        try {
            CreateEmailResponse data = resend.emails().send(params);
            System.out.println(data.getId());
        } catch (ResendException e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
        }
    }
}
