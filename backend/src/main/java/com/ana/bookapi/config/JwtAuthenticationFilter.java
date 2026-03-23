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

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (userEmail != null && authentication == null) {
                UserDetails userDetails = this.usd.loadUserByUsername(userEmail);

                if (jwt.isTokenValid(jwtToken, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            chain.doFilter(req, rep);
        } catch (Exception e) {
            her.resolveException(req, rep, null, e);
        }
    }
}