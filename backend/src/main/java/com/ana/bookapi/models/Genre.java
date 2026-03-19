package com.ana.bookapi.models;

import java.util.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity(name="genre")
@Table(name="genre")

public class Genre {
    //constructor
    public Genre(){
        this.id = generateId();
    }

    //attributes
    @Id
    @Column(name = "id", length = 70)
    private String id;

    @Column(name = "name", length = 50)
    private String name;

    //methods
    public String getId() {return id;}

    public String getName() {return name;}
    public void setName(String newName) {this.name = newName;}

    public String generateId() {
        return UUID.randomUUID().toString();
    }

}