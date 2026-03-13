package com.ana.bookapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class EncodeConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public String encoder(String password) {
        return passwordEncoder().encode(password);
    }

    public Boolean matcher (String rawPassword, String password) {
        return passwordEncoder().matches(rawPassword, password);
    }
}