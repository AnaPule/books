package com.ana.bookapi.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(
        basePackages = "com.ana.bookmarkapi.repository.mongo",
        mongoTemplateRef = "mongoTemplate"
)
public class MongoConfig {
    @Value("${mongo.uri}") private String mongoUri;
    @Value("${mongo.database}") private String databaseName;
    //private MongoDatabase database = mongoClient().getDatabase(databaseName);

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(mongoUri);
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), databaseName);
    }
}
