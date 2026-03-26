package com.ana.bookapi.models.book.DiscussionRoom;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name="report")
public class Report {

    @Id
    @Column(name="id", unique = true, nullable = false, length = 70) private String id; //PK
    @Column(name="comment_id", nullable = false, length = 70) private String commentId; //FK
    @Column(name="reason",  nullable = false) private Integer reason;
        /*
            1. harassment
            2. violence
            3. hate speech
            4. scam/ spam
            5. intellectual property theft
            6. impersonation
         */
    @Column(name="created_at", nullable = false) private Date createdAt;

    public Report() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = new Date();
    }

    //methods
    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getCommentId() {return commentId;}
    public void setCommentId(String commentId) {this.commentId = commentId;}

    public Integer getReason() {return reason;}
    public void setReason(Integer reason) {this.reason = reason;}

    public Date getCreatedAt() {return createdAt;}

    public enum RelationshipType {
        HARASSMENT,
        VIOLENCE,
        HATE_SPEECH,
        SCAM_SPAM,
        INTELLECTUAL_PROPERTY_THEFT,
        IMPERSIONATION
    }
}
