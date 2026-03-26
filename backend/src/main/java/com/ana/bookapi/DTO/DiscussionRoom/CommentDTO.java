package com.ana.bookapi.DTO.DiscussionRoom;

import com.ana.bookapi.models.book.DiscussionRoom.Comment;
import com.ana.bookapi.models.book.DiscussionRoom.CommentInteraction;
import com.ana.bookapi.models.book.DiscussionRoom.Report;

import java.util.Date;
import java.util.List;

public class CommentDTO {
    private String id;
    private Integer likes;
    private Integer dislikes;
    private List<Report> reports;
    private Boolean deleted;
    private String content;
    private Date createdAt;
    private List<CommentInteraction> commentInteractions;

    public CommentDTO() {}
    public CommentDTO(Comment comment) {
        this.id = comment.getId();
    }

    public CommentDTO(
            Comment comment,
            List<CommentInteraction> commentInteractions,
            List<Report> reports,
            Integer likes,
            Integer dislikes
    ) {
        this.id = comment.getId();
        this.likes = likes;
        this.dislikes = dislikes;
        this.reports = reports;
        this.deleted = comment.getDeleted();
        this.content = comment.getContent();
        this.commentInteractions = commentInteractions;
    }

    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public Integer getLikes() {return likes;} // get from bridge service
    public void setLikes(Integer likes) {this.likes = likes;}

    public Integer getDislikes() {return dislikes;}
    public void setDislikes(Integer dislikes) {this.dislikes = dislikes;}

    public List<Report> getReports() {return reports;}
    public void setReports(List<Report> reports) {this.reports = reports;}

    public Boolean getDeleted() {return deleted;}
    public void setDeleted(Boolean deleted) {this.deleted = deleted;}

    public String getContent() {return content;}
    public void setContent(String content) {this.content = content;}

    public Date getCreatedAt() {return createdAt;}
    public void setCreatedAt(Date createdAt) {this.createdAt = createdAt;}

    public List<CommentInteraction> getCommentInteractions() {return commentInteractions;}
    public void setCommentInteractions(List<CommentInteraction> commentInteractions) {this.commentInteractions = commentInteractions;}
}
