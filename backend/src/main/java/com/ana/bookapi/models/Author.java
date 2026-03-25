package com.ana.bookapi.models;

import jakarta.persistence.*;
import org.w3c.dom.Text;

import java.time.LocalDateTime;
import java.util.Date;
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

    @Column(name = "name", length = 200, nullable = false, unique = true)
    private String name;

    @Column(name = "biography", columnDefinition = "TEXT", nullable = true) // Increased length
    private String biography;

    @Column(name = "image", length = 500, nullable = true) // Increased length for URLs
    private String image;

    @Column(name = "dob", nullable = true) // Increased length
    private Date dob;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; } // Fixed parameter name

    public String getBiography() { return biography; }
    public void setBiography(String biography) { this.biography = biography; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Date getDob() { return dob; }
    public void setDob(Date dob) { this.dob = dob; }
}