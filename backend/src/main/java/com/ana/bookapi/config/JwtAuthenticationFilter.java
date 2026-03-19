package com.ana.bookapi.config;

/* =================== models =================== */

import com.ana.bookapi.service.auth.JwtService;

/* =================== packages =================== */

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;
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
    //private final HandlerExceptionResolver her;
    @Qualifier("handlerExceptionResolver")
    private HandlerExceptionResolver her;

    public JwtAuthenticationFilter(
            JwtService Jwt,
            UserDetailsService usd
    ) {
        this.jwt = Jwt;
        this.usd = usd;
        //this.her = her;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest req,
            @NonNull HttpServletResponse rep,
            @NonNull FilterChain chain
    ) throws ServletException, IOException {
        final String reqURI = req.getRequestURI();

        // skip jwt processing for /auth/user endpoint
        if ("/auth/user".equals(reqURI)) {
            chain.doFilter(req, rep);
            return;
        }

        final String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, rep);
            return;
        }

        try {
            final String VarJwt = header.substring(7);
            final String userEmail = jwt.extractUsername(VarJwt);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (userEmail != null && authentication == null) {
                UserDetails userDetails = this.usd.loadUserByUsername(userEmail);

                if (jwt.isTokenValid(VarJwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authtoken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    authtoken.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(authtoken);
                }
            }

            chain.doFilter(req, rep); ///***Note: this continues to the controller
        } catch (Exception e) {
            her.resolveException(req, rep, null, e);
        }
    }
}
