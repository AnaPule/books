package com.ana.bookapi;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource("classpath:key.properties")
@PropertySource("classpath:jwt.properties") // loading these two files so their env variables can be used all round...
public class Main implements CommandLineRunner {

    // just running the program and that...
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

    @Override
    public void run(String... args) throws Exception {

    }
}

// to run main script: ./mvnw spring-boot:run