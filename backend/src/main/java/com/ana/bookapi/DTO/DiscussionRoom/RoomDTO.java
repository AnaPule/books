package com.ana.bookapi.DTO.DiscussionRoom;

import com.ana.bookapi.DTO.BookDTO;

import java.util.List;

public class RoomDTO {
    private String id;
    private String name;
    private BookDTO book;
    private List<SubRoomDTO> subRooms;
    private List<CommentDTO> comments;
    private List<CommentDTO> quietRoom;
    private Integer members;


    private RoomDTO() {}
    // main room (general,  can bloody have comments bestie)
    public RoomDTO(
            String id,
            String name,
            Integer members,
            BookDTO book,
            List<SubRoomDTO> subRooms,
            List<CommentDTO> comments,
            List<CommentDTO> quietRoomComments) {
        this.id = id;
        this.name = name;
        this.book = book;
        this.members = members;
        this.subRooms = subRooms;
        this.comments = comments;
        this.quietRoom = quietRoomComments;
    }

    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public BookDTO getBook() {return book;}
    public void setBook(BookDTO book) {this.book = book;}

    public List<SubRoomDTO> getSubRooms() {return subRooms;}
    public void setSubRooms(List<SubRoomDTO> subRooms) {this.subRooms = subRooms;}

    public List<CommentDTO> getComments() {return comments;}
    public void setComments(List<CommentDTO> comments) {this.comments = comments;}

    public Integer getMembers() {return members;}
    public void setMembers(Integer members) {this.members = members;}

    public List<CommentDTO> getQuietRoom() {return quietRoom;}
    public void setQuietRoom(List<CommentDTO> quietRoomComments) {this.quietRoom = quietRoomComments;}
}
