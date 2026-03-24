package com.ana.bookapi.config;

import com.ana.bookapi.service.auth.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwt;
    private final UserDetailsService usd;
    private final HandlerExceptionResolver her;

    // Constructor injection - this is correct
    public JwtAuthenticationFilter(
            JwtService jwt,
            UserDetailsService usd,
            @Qualifier("handlerExceptionResolver") HandlerExceptionResolver her
    ) {
        this.jwt = jwt;
        this.usd = usd;
        this.her = her;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest req,
            @NonNull HttpServletResponse rep,
            @NonNull FilterChain chain
    ) throws ServletException, IOException {
        final String reqURI = req.getRequestURI();

        // skip jwt processing for auth endpoints
        if (reqURI.startsWith("/auth/")) {
            chain.doFilter(req, rep);
            return;
        }

        final String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, rep);
            return;
        }

        try {
            final String jwtToken = header.substring(7);
            final String userEmail = jwt.extractUsername(jwtToken);

            //System.out.println("🔍 JWT Filter - User: " + userEmail);
            //System.out.println("🔍 JWT Filter - Token: " + jwtToken.substring(0, Math.min(30, jwtToken.length())) + "...");

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (userEmail != null && authentication == null) {
                UserDetails userDetails = this.usd.loadUserByUsername(userEmail);

                boolean isValid = jwt.isTokenValid(jwtToken, userDetails);
                //System.out.println("🔍 JWT Filter - Token valid: " + isValid);
                //System.out.println("🔍 JWT Filter - Token expired: " + jwt.isTokenExpired(jwtToken));

                if (jwt.isTokenValid(jwtToken, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    //System.out.println("✅ JWT Filter - Authentication set for: " + userEmail);
                } else {
                    System.out.println("❌ JWT Filter - Token INVALID for: " + userEmail);
                    System.out.println("   Reason: Token expired or signature invalid");
                }
            }

            chain.doFilter(req, rep);
        } catch (Exception e) {
            System.err.println("🔥 JWT Filter ERROR: " + e.getMessage());
            e.printStackTrace();

            her.resolveException(req, rep, null, e);
        }
    }
}