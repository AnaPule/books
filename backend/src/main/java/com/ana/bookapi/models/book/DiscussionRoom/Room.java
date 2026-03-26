package com.ana.bookapi.models.book.DiscussionRoom;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name="room")
public class Room {

    public Room() {
        this.id = UUID.randomUUID().toString();
    }

    public Room(String book_id, String room_name) {
        this.id = UUID.randomUUID().toString();
        this.bookId = book_id;
        this.name = room_name;
        this.parentId = null;
        this.creatorId = "Pages ń Parchment";
        this.deleted = false;
    }

    @Id
    @Column(name="id")
    private String id;

    @Column(name="book_id", unique = true, nullable=false, length = 70) private String bookId; //FK
    @Column(name="parent_id", nullable = true, length=70) private String parentId; //FK - this entity has a recursive relationship with itself. A bunch of sub rooms can be made under one main room
    @Column(name="creator_id", nullable = true, length=70) private String creatorId;// For the rooms that were created by users
    @Column(name="name", nullable = false, length=70) private String name;
    @Column(name="deleted", nullable = false) private boolean deleted = false; // for soft delete purposes...the hard delete is alot of admin

    //methods
    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getBookId() {return bookId;}
    public void setBookId(String bookId) {this.bookId = bookId;}

    public String getParentId() {return parentId;}
    public void setParentId(String parentId) {this.parentId = parentId;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public boolean isDeleted() {return deleted;}
    public void setDeleted(boolean deleted) {this.deleted = deleted;}
}
