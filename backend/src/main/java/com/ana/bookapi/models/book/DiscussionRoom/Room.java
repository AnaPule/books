package com.ana.bookapi.models.book.DiscussionRoom;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name="room")
public class Room {

    public Room() {
        this.id = UUID.randomUUID().toString();
    }

    // creating main room
    public Room(String book_id, String room_name) {
        this.id = UUID.randomUUID().toString();
        this.bookId = book_id;
        this.name = room_name;
        this.parentId = null;
        this.creatorId = "Pages ń Parchment";
        this.type = 1; // general room
        this.deleted = false;
    }

    @Id
    @Column(name="id")
    private String id;

    @Column(name="book_id", nullable=false, length = 70) private String bookId; //FK
    @Column(name="parent_id", nullable = true, length=70) private String parentId; //FK - this entity has a recursive relationship with itself. A bunch of sub rooms can be made under one main room
    @Column(name="creator_id", nullable = true, length=70) private String creatorId;// For the rooms that were created by users
    @Column(name="name", nullable = false, length=70) private String name;
    @Column(name="deleted", nullable = false) private boolean deleted = false; // for soft delete purposes...the hard delete is alot of admin
    @Column(name="type", nullable = false) private Integer type;
        /*
        1. General (Main room - default made by system - cannot be deleted or altered by a user)
        2. text channels - created by users (Create, update name, delete permissions only to creator)
        3. analysis - will be made when default rooms are made - cannot be edited/ deleted by users (read only) - use qroq AI for it.
                    names - author biography and popular pieces (only if user is known), character analysis, themes - symbolism, plot - plot devices
         */

    //methods
    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getBookId() {return bookId;}
    public void setBookId(String bookId) {this.bookId = bookId;}

    public String getParentId() {return parentId;}
    public void setParentId(String parentId) {this.parentId = parentId;}

    public String getCreatorId() {return creatorId;}
    public void setCreatorId(String creatorId) {this.creatorId = creatorId;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public boolean isDeleted() {return deleted;}
    public void setDeleted(boolean deleted) {this.deleted = deleted;}

    public Integer getType() {return type;}
    public void setType(Integer type) {this.type = type;}
}
