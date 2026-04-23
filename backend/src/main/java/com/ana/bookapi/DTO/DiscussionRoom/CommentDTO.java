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
    private CommentUserDTO user;
    private List<CommentInteraction> commentInteractions;
    private List<CommentDTO> replies;
    private Boolean isLikedByUser;
    private Boolean isDislikedByUser;

    public CommentDTO() {
    }

    public CommentDTO(Comment comment) {
        this.id = comment.getId();
    }

    public CommentDTO(
            Comment comment,
            List<CommentInteraction> commentInteractions,
            List<Report> reports,
            Boolean deleted,
            Integer likes,
            Integer dislikes,
            CommentUserDTO user,
            List<CommentDTO> replies,
            Boolean isLikedByUser,
            Boolean isDislikedByUser
    ) {
        this.id = comment.getId();
        this.likes = likes;
        this.dislikes = dislikes;
        this.reports = reports;
        this.deleted = comment.getDeleted();
        this.content = comment.getContent();
        this.user = user;
        this.commentInteractions = commentInteractions;
        this.replies = replies;
        this.createdAt = comment.getCreatedAt();
        this.isLikedByUser = isLikedByUser;
        this.isDislikedByUser = isDislikedByUser;
    }

    public CommentDTO(
            Comment comment,
            List<CommentInteraction> subInteractions,
            List<Report> subReports,
            Integer subLikes,
            Integer subDislikes,
            CommentUserDTO subUser,
            Boolean deleted) {
        this.id = comment.getId();
        this.likes = subLikes;
        this.dislikes = subDislikes;
        this.reports = subReports;
        this.deleted = comment.getDeleted();
        this.content = comment.getContent();
        this.user = subUser;
        this.commentInteractions = subInteractions;
        this.deleted = deleted;

    }

    public <E> CommentDTO(
            String id,
            int i,
            int i1,
            List<E> of,
            boolean b,
            String s,
            Date createdAt,
            CommentUserDTO system,
            List<E> of1,
            List<E> of2,
            boolean l,
            boolean d) {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getLikes() {
        return likes;
    } // get from bridge service

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public Integer getDislikes() {
        return dislikes;
    }

    public void setDislikes(Integer dislikes) {
        this.dislikes = dislikes;
    }

    public List<Report> getReports() {
        return reports;
    }

    public void setReports(List<Report> reports) {
        this.reports = reports;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public CommentUserDTO getUser() {
        return user;
    }

    public void setUser(CommentUserDTO user) {
        this.user = user;
    }

    public List<CommentInteraction> getCommentInteractions() {
        return commentInteractions;
    }

    public void setCommentInteractions(List<CommentInteraction> commentInteractions) {
        this.commentInteractions = commentInteractions;
    }

    public List<CommentDTO> getReplies() {
        return replies;
    }

    public void setReplies(List<CommentDTO> replies) {
        this.replies = replies;
    }

    public Boolean getIsLikedByUser() {
        return isLikedByUser;
    }
    public void setIsLikedByUser(Boolean isLikedByUser) {
        this.isLikedByUser = isLikedByUser;
    }
    public Boolean getIsDislikedByUser() {
        return isDislikedByUser;
    }
    public void setIsDislikedByUser(Boolean isDislikedByUser) {
        this.isDislikedByUser = isDislikedByUser;
    }

    //side quest
    public static class CommentUserDTO {
        private String user_id;
        private String username;
        private String profile;

        public CommentUserDTO() {
        }

        public CommentUserDTO(String id, String name, String profile) {
            this.user_id = id;
            this.username = name;
            this.profile = profile;
        }

        public String getUser_id() {
            return user_id;
        }

        public void setUser_id(String user_id) {
            this.user_id = user_id;
        }

        public String getName() {
            return username;
        }

        public void setName(String name) {
            this.username = name;
        }

        public String getProfile() {
            return profile;
        }

        public void setProfile(String profile) {
            this.profile = profile;
        }
    }
}
