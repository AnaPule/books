package com.ana.bookapi.models.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name="notification")
public class Notification {
    @Id
    @Column(name="id", unique = true, length = 70, nullable = false) private String id;

    @Column(name="sender_id", length = 80, nullable = false) private String senderId; // FK: user
    @Column(name="receive_id",  length = 80, nullable = false) private String receiveId; // FK: user
    //@Column(name="room_id", length = 80, nullable = true) private String roomId; // FK:
    @Column(name="subject", length = 30, nullable = false) private String subject;
    @Column(name="read", nullable = false) private Boolean read = false; // if the user read the message
    @Column(name="content", columnDefinition = "TEXT", nullable = false) private String content; // the actual message
    @Column(name="post_time", nullable = false) private Date postTime;

    public Notification() {
        this.id = UUID.randomUUID().toString();
        this.postTime = new Date();
    }

    public Notification(
            String senderId,
            String receiveId,
            String subject,
            String content
    ){
        this.senderId = senderId;
        this.receiveId = receiveId;
        this.content = content;
        this.subject = subject;
        this.id = UUID.randomUUID().toString();
        this.postTime = new Date();
    }

    //getters and setters
    public String getId() {return id;}
    public void setId(String id) { this.id = id; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getRecieveId() { return receiveId; }
    public void setRecieveId(String recieveId) { this.receiveId = recieveId; }

    //public String getRoomId() { return roomId; }
    //public void setRoomId(String roomId) { this.roomId = roomId; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Boolean getRead() { return read; }
    public void setRead(Boolean read) { this.read = read; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Date getPostTime() { return postTime; }
    public void setPostTime(Date postTime) { this.postTime = postTime; }

    public enum RelationshipType {
        GENERAL,            // sender = pages ń parchments
        DIRECT_MESSAGE,     // sender = user_id
        ROOM_ACTIVITY
        ///NOTE: messages from rooms on account of activity - sender = id
    };
}
