package com.ana.bookapi.DTO.DiscussionRoom;

public class ReportDTO {
    private String id;
    private String commentId;
    private String reason;

    public ReportDTO() {}
    public ReportDTO(String id, String commentId, String reason) {
        this.id = id;
        this.commentId = commentId;
        this.reason = reason;
    }

    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getCommentId() {return commentId;}
    public void setCommentId(String commentId) {this.commentId = commentId;}

    public String getReason() {return reason;}
    public void setReason(String reason) {this.reason = reason;}
}
