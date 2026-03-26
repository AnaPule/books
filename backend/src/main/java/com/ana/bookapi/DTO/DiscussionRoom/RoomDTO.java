package com.ana.bookapi.DTO.DiscussionRoom;

import com.ana.bookapi.DTO.BookDTO;

import java.util.List;

public class RoomDTO {
    private String id;
    private String name;
    private BookDTO book;
    private List<SubRoomDTO> subRooms;


    private RoomDTO() {}
    public RoomDTO(String id, String name, BookDTO book, List<SubRoomDTO> subRooms) {
        this.id = id;
        this.name = name;
        this.book = book;
        this.subRooms = subRooms;
    }

    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public BookDTO getBook() {return book;}
    public void setBook(BookDTO book) {this.book = book;}

    public List<SubRoomDTO> getSubRooms() {return subRooms;}
    public void setSubRooms(List<SubRoomDTO> subRooms) {this.subRooms = subRooms;}
}
