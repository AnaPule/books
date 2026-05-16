package com.ana.bookapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class BrevoConfig {
    @Value("${brevo_host}") private String host;
    @Value("${brevo_port}") private int port;
    @Value("${brevo_username}") private String username;
    @Value("${brevo_password}") private String password;

    @Bean
    public JavaMailSenderImpl BrevoConfig() {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();

        sender.setHost(host);
        sender.setPort(port);
        sender.setUsername(username);
        sender.setPassword(password);

        Properties props = sender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtop.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.ssl.trust", host);

        return sender;
    }
}
