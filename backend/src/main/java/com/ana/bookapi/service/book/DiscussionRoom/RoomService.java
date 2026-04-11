package com.ana.bookapi.service.book.DiscussionRoom;

import com.ana.bookapi.models.book.Book;
import com.ana.bookapi.repository.BookRepo;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import com.ana.bookapi.repository.book.RoomRepo;
import com.ana.bookapi.models.book.DiscussionRoom.Room;

import java.util.List;

@Service
public class RoomService {

    private final BookRepo br;
    private final RoomRepo rr;

    public RoomService(RoomRepo roomRepo,  BookRepo bookRepo) {
        this.br = bookRepo;
        this.rr = roomRepo;
    }//constructor

    //create new room
    public Room createNewMainRoom(String book_id, String room_name){
        // check if room name already exists - that means this book already has a room
        if (rr.existsByName(room_name)){
            throw new RuntimeException("Room already exists");
        }
        Room room = new Room(book_id, room_name);
        return rr.save(room);
    }

    public Room createNewSubRoom(Room room){
        // check if parent room exists
        if (!rr.existsById(room.getParentId())){
            //System.err.println("Parent Room does not exist - create sub room");
            throw new RuntimeException("Parent Room does not exist - create sub room");
        }

        // check if room name is not duplicated
        if (rr.roomNameExists(room.getParentId(),  room.getName())) {
            System.err.println("Room name unavailable!!");
            throw new RuntimeException("Room name unavailable!!");
        }
        return rr.save(room);

    }

    //change room name
    public Room updateRoom(Room Newroom) throws BadRequestException {
        if (!rr.existsById(Newroom.getId())) {
            throw new BadRequestException("Room does not exist");
        }
        Room existingRoom = findById(Newroom.getId());
        existingRoom.setName(Newroom.getName());
        return rr.save(existingRoom);
    }

    // search for room details by room name
    public Room findRoomByName(String name) throws BadRequestException {
        if (!rr.existsByName(name)) {
            throw new BadRequestException("Room does not exist");
        }
        return findByName(name);
    }

    // search for room by room id
    public Room findRoomById(String id){
        if (!rr.existsById(id)) {
            new RuntimeException("Room does not exist");
        }
        return findById(id);
    }

    // soft delete - ///NOTE: the user cannot undo delete
    public void deleteRoomById(String id) throws BadRequestException {
        if (!rr.existsById(id)) {
            throw new BadRequestException("Room does not exist");
        }
        Room existingRoom = findById(id);
        existingRoom.setDeleted(true);
        rr.save(existingRoom);
    }

    // get book main room
    public Room getBookMainRoom(String book_id){
        if (!br.existsById(book_id)) {
            System.err.println("Book does not exist");
        }
        return rr.findBookMainRoom(book_id).orElseThrow(() -> new RuntimeException("Book no have main room man."));
    }

    //get room sub rooms
    public List<Room> getSubRoomsByRoomId(String parent_room) {
        if (!rr.existsById(parent_room)) {
            System.err.println("Parent room does not exist");
            return null;
        }
        return rr.findAllByParentId(parent_room);
    }
    //get all rooms under book - every book with the book id as a FK
    public List<Room> getRoomsByBookId(String bookId) throws BadRequestException {
        if (!br.existsById(bookId)) {
            throw new BadRequestException("Book does not exist - thus having no rooms");
        }
        return rr.findAllByBookId(bookId);
    }

    //general helpers
    private Room findById(String id) {
        return rr.findById(id).orElseThrow(() -> new RuntimeException("Room does not exist"));
    }
    private Room findByName(String name){
        return rr.findByName(name).orElseThrow(() -> new RuntimeException("Room does not exist"));
    }
}
