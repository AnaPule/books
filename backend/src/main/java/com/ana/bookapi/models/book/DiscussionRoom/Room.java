package com.ana.bookapi.models.book.DiscussionRoom;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name="room")
public class Room {

    public Room() {
        this.id = UUID.randomUUID().toString();
    }

    @Id
    @Column(name="id")
    private String id;

    @Column(name="book_id", unique = true, nullable=false, length = 70) private String bookId; //FK
    @Column(name="parent_id", nullable = true, length=70) private String parentId; //FK - this entity has a recursive relationship with itself. A bunch of sub rooms can be made under one main room
    @Column(name="name", nullable = false, length=70) private String name;

    //methods
    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getBookId() {return bookId;}
    public void setBookId(String bookId) {this.bookId = bookId;}

    public String getParentId() {return parentId;}
    public void setParentId(String parentId) {this.parentId = parentId;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}
}
