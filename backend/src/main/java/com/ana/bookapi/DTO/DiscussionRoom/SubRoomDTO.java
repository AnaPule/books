package com.ana.bookapi.DTO.DiscussionRoom;

import java.util.List;

public class SubRoomDTO {
    private String id;
    private String name;
    private String parentId;
    private Integer members;
    private List<CommentDTO> comments;

    public SubRoomDTO() {}
    public SubRoomDTO(
            String id,
            String name,
            Integer members,
            List<CommentDTO> comments,
            String parentId) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.parentId = parentId;
        this.comments = comments;
    }

    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public String getParentId() {return parentId;}
    public void setParentId(String parentId) {this.parentId = parentId;}

    public Integer getMembers() {return members;}
    public void setMembers(Integer members) {this.members = members;}

    public List<CommentDTO> getComments() {return comments;}
    public void setComments(List<CommentDTO> comments) {this.comments = comments;}
}
