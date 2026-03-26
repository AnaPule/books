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
    public Member(String user_id, String room_id) {
        this.id = UUID.randomUUID().toString();
        this.roomId = room_id;
        this.userId = user_id;
    }

    @Id
    @Column(unique=true, nullable=false)
    private String id;

    @Column(name="room_id",nullable = false,length=70) private String roomId; //FK
    @Column(name="user_id", nullable = false,length=70) private String userId; // FK
}
