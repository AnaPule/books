package com.ana.bookapi.models.book.DiscussionRoom;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;
import java.util.UUID;
@Entity
@Table(name = "comment")
public class Comment {
    @Id
    @Column(name= "id", length = 70, unique = true) private String id;
    @Column(name= "room_id",  length = 70, nullable = false) private String roomId; //FK
    @Column(name = "user_id", length = 70, nullable = false) private String userId; // FK
    @Column(name="parent_id",  length = 70, nullable = true) private String parentId; // FK - recursive relationship with itself as one comment can have several replies to irt
    @Column(name="content", length = 300, nullable = false) private String content;
    @Column(name="deleted", nullable = false) private Boolean deleted = false; // if a comment is reported 5 times or disliked by 10 users, no matter the reason, then the app 'deletes' it - meaning no user can see the comment or any replies to the comment if any.
    @Column(name="created_at", nullable = false) private Date createdAt;

    public Comment() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = new Date();
    }

    //methods
    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getRoomId() {return roomId;}
    public void setRoomId(String roomId) {this.roomId = roomId;}

    public String getUserId() {return userId;}
    public void setUserId(String userId) {this.userId = userId;}

    public String getParentId() {return parentId;}
    public void setParentId(String parentId) {this.parentId = parentId;}

    public String getContent() {return content;}
    public void setContent(String content) {this.content = content;}

    public Boolean getDeleted() {return deleted;}
    public void setDeleted(Boolean deleted) {this.deleted = deleted;}

}
