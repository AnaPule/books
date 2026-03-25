package com.ana.bookapi.models.book.DiscussionRoom;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
// bridge table
@Table(
        name="member",
        uniqueConstraints = @UniqueConstraint(columnNames = {"room_id","user_id"})
)
public class Member {

    public Member() {this.id = UUID.randomUUID().toString();}

    @Id
    @Column(unique=true, nullable=false)
    private String id;

    @Column(name="room_id",nullable = false,length=70) private String roomId; //FK
    @Column(name="user_id", nullable = false,length=70) private String userId; // FK
}
