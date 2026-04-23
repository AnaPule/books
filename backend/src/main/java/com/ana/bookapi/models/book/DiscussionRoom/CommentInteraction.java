package com.ana.bookapi.models.book.DiscussionRoom;

import jakarta.persistence.*;

import java.util.Date;
import java.util.UUID;

@Entity(name="interact")
// bridge entity
@Table(
        name="comment_interaction",
        uniqueConstraints = @UniqueConstraint(columnNames = {"comment_id","user_id","type"})
)
public class CommentInteraction {
    @Id
    @Column(name="id", unique = true, nullable = false, length = 70) private String id; //PK

    @Column(name="comment_id",  nullable = false, length = 70) private String commentId; //FK
    @Column(name="user_id", nullable = false, length = 70) private String userId; //FK
    @Column(name="type",  nullable = false) private Integer type;
        /*
        1. Like
        2. Dislike
        3.report
        */
    @Column(name="created_at", nullable = false) private Date createdAt;

    public CommentInteraction() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = new Date();
    }

    public CommentInteraction(String commentId, String userId, Integer type) {
        this.commentId = commentId;
        this.userId = userId;
        this.type = type;
    }

    //methods
    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getCommentId() {return commentId;}
    public void setCommentId(String commentId) {this.commentId = commentId;}

    public String getUserId() {return userId;}
    public void setUserId(String userId) {this.userId = userId;}

    public Integer getType() {return type;}
    public void setType(Integer type) {this.type = type;}

    public Date getCreatedAt() {return createdAt;}
    public void setCreatedAt(Date createdAt) {this.createdAt = createdAt;}

    public enum RelationshipType {
        Like,        // comments they like
        DISLIKE,     // comments they disliked
        REPORT       // comments they reported
    };
}
