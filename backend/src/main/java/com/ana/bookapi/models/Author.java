package com.ana.bookapi.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "author")
public class Author {

    public Author() {
        this.id = UUID.randomUUID().toString();
        //this.updatedAt = LocalDateTime.now(); // Uncomment if you add this field
    }

    @Id
    @Column(name = "id", length = 70, nullable = false, unique = true)
    private String id;

    @Column(name = "name", length = 50, nullable = false, unique = true)
    private String name;

    @Column(name = "biography", length = 2000, nullable = true) // Increased length
    private String biography;

    @Column(name = "image", length = 500, nullable = true) // Increased length for URLs
    private String image;

    @Column(name = "email", length = 100, nullable = true) // Increased length
    private String email;

    @Column(name = "cellphone", length = 20, nullable = true) // Increased length
    private String cellphone;

    @Column(name = "website", length = 500, nullable = true) // Increased length for URLs
    private String website;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; } // Fixed parameter name

    public String getBiography() { return biography; }
    public void setBiography(String biography) { this.biography = biography; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCellphone() { return cellphone; }
    public void setCellphone(String cellphone) { this.cellphone = cellphone; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}