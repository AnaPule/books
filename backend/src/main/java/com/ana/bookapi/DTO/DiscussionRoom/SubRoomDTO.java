package com.ana.bookapi.DTO.DiscussionRoom;

import java.util.List;

public class SubRoomDTO {
    private String id;
    private String name;
    private String parentId; // is not always filled - its used to indicate whether its a subroom or not
    private String bookId; // always filled in, because FK
    private Integer members;
    private List<CommentDTO> comments;
    private Integer type;

    public SubRoomDTO() {}
    public SubRoomDTO(
            String id,
            String name,
            Integer members,
            Integer type,
            List<CommentDTO> comments,
            String parentId) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.type = type;
        this.parentId = parentId;
        this.comments = comments;
    }

    // for rooms
    public SubRoomDTO(
            String id,
            String name,
            Integer members,
            String bookId) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.bookId = bookId;
    }

    public SubRoomDTO(
            String id,
            String name,
            String bookId) {
        this.id = id;
        this.name = name;
        this.bookId = bookId;
    }

    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public Integer getType() {return type;}
    public void setType(Integer type) {this.type = type;}

    public String getParentId() {return parentId;}
    public void setParentId(String parentId) {this.parentId = parentId;}

    public String getBookId() {return bookId;}
    public void setBookId(String bookId) {this.bookId = bookId;}

    public Integer getMembers() {return members;}
    public void setMembers(Integer members) {this.members = members;}

    public List<CommentDTO> getComments() {return comments;}
    public void setComments(List<CommentDTO> comments) {this.comments = comments;}
}
