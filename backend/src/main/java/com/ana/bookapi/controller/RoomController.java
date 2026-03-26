package com.ana.bookapi.controller;

import com.ana.bookapi.DTO.BookDTO;
import com.ana.bookapi.DTO.DiscussionRoom.CommentDTO;
import com.ana.bookapi.DTO.DiscussionRoom.RoomDTO;
import com.ana.bookapi.DTO.DiscussionRoom.SubRoomDTO;
import com.ana.bookapi.DTO.errResponse;
import com.ana.bookapi.models.Author;
import com.ana.bookapi.models.Genre;
import com.ana.bookapi.models.book.Book;
import com.ana.bookapi.models.book.DiscussionRoom.Comment;
import com.ana.bookapi.models.book.DiscussionRoom.CommentInteraction;
import com.ana.bookapi.models.book.DiscussionRoom.Report;
import com.ana.bookapi.models.book.DiscussionRoom.Room;
import com.ana.bookapi.service.AuthorService;
import com.ana.bookapi.service.book.BookService;
import com.ana.bookapi.service.book.DiscussionRoom.CommentService;
import com.ana.bookapi.service.book.DiscussionRoom.MemberService;
import com.ana.bookapi.service.book.GenreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ana.bookapi.service.book.DiscussionRoom.RoomService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService rs;
    private final BookService bs;
    private final GenreService gs;
    private final MemberService ms;
    private final AuthorService as;
    private final CommentService cs;
    private errResponse er = new errResponse();

    public RoomController(
            RoomService rs,
            BookService bs,
            MemberService ms,
            AuthorService as,
            GenreService gs,
            CommentService cs) {
        this.rs = rs;
        this.bs = bs;
        this.as = as;
        this.gs = gs;
        this.ms = ms;
        this.cs = cs;
    }

    //get book main room
    @GetMapping("/book/{bookId}")
    public ResponseEntity<?> getBookRoomsByBookId(@PathVariable String bookId) {
        try{
            //1. get room
            Room rawRoom = rs.getBookMainRoom(bookId);
            //2. map all details  to the main discussion room

                        // 2.1 get/map all book details
                        Book rawBook = bs.getBookById(rawRoom.getBookId());
                        Author author = as.getAuthorById(rawBook.getAuthorId());
                        Genre genre = gs.getGenre(rawBook.getGenreId());
                        // full book
                        BookDTO book = new BookDTO(rawBook, author, genre);

                        // 2.2 map sub rooms
                        List<SubRoomDTO> subRooms = rs.getSubRoomsByRoomId(rawRoom.getId())
                                .stream()
                                .map(room -> {
                                    // 2.2.1 map sub room comments
                                    List<CommentDTO> comments = cs.getAllRoomComments(room.getId())
                                            .stream()
                                            .map(comment -> {
                                                Integer likes = cs.getNoOfInteractionType(comment.getId(), 1);
                                                Integer dislikes = cs.getNoOfInteractionType(comment.getId(), 2);
                                                List<Report> reports = cs.getAllCommentReports(comment.getId());
                                                List<CommentInteraction> interactions = cs.getAllcommentInteractions(comment.getId());

                                                // 2.2.2.2 return rooms comments dto
                                                return new CommentDTO(comment, interactions, reports, likes, dislikes);
                                            })
                                            .collect(Collectors.toList());
                                    // 2.2.2 get number of members in room
                                    Integer memCount = ms.getNoOfMembers(room.getId());
                                    // 2.2.3 return sub room dto
                                    return new SubRoomDTO(room.getId(), room.getName(), memCount, comments, room.getParentId());
                                })
                                .collect(Collectors.toList());

            //3. create the main room dto
            RoomDTO room = new RoomDTO(rawRoom.getId(), rawRoom.getName(), book,  subRooms);
            return ResponseEntity.ok(Map.of("room",room));
        }catch(Exception e){
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //create new sub room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Room room) {
        try{
            rs.createNewSubRoom(room);
            return ResponseEntity.ok(Map.of("message", "sub-room created :)"));
        }catch(Exception e){
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // update room
    @PutMapping("/update-room-name")
    public ResponseEntity<?> updateRoom(@RequestBody Room room) {
        try{
            rs.updateRoom(room);
            return ResponseEntity.ok(Map.of("message", "room details updated :)"));
        }catch(Exception e){
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //delete room - soft delete
    @PutMapping("/delete-room")
    public ResponseEntity<?> deleteRoom(@RequestBody Room room) {
        try{
            rs.deleteRoomById(room.getId());
            return ResponseEntity.ok(Map.of("message", "room deleted :("));
        }catch(Exception e){
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // add member to room
    @PostMapping("/add-member/{userId}/{roomId}")
    public ResponseEntity<?> addMember(@PathVariable String userId, @PathVariable String roomId) {
        try{
            ms.addMember(userId, roomId);
            String room_name = rs.findRoomById(roomId).getName();
            return ResponseEntity.ok(Map.of("message", String.format("Welcome to the %s chats :)", room_name)));
        }catch(Exception e){
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // remove member from room
    @PostMapping("/remove-member/{userId}/{roomId}")
    public ResponseEntity<?> removeMember(@PathVariable String userId, @PathVariable String roomId) {
        try{
            ms.removeMember(userId, roomId);
            return ResponseEntity.ok(Map.of("message", "Good bye dearest! :)"));
        }catch(Exception e){
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //post comment
    @PostMapping("/post-comment")
    public ResponseEntity<?> postComment(@RequestBody Comment comment) {
        try{
            cs.PostComment(comment);
            return ResponseEntity.ok(Map.of("message", "comment posted :)"));
        }catch(Exception e){
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // edit comment
    @PutMapping("/edit-comment")
    public ResponseEntity<?> editComment(@RequestBody Comment comment) {
        try{
            cs.EditComment(comment);
            return ResponseEntity.ok(Map.of("message", "comment edited :)"));
        }catch(Exception e){
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }
    // delete comment
    @DeleteMapping("/delete-comment")
    public ResponseEntity<?> deleteComment(@RequestBody Comment comment) {
        try{
            cs.deleteComment(comment.getId());
            return ResponseEntity.ok(Map.of("message", "comment deleted :)"));
        }catch(Exception e){
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // add member comment interaction
    @PostMapping("/interact")
    public ResponseEntity<?> interact(@RequestBody CommentInteraction dto) {
        try{
            cs.postCommentInteraction(dto);
            return ResponseEntity.ok(Map.of("message", "comment interaction posted :)"));
        }catch(Exception e){
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // remove member comment interaction
    @PutMapping("/delete-interact")
    public ResponseEntity<?> deleteInteract(@RequestBody CommentInteraction dto) {
        try{
            cs.deleteCommentInteraction(dto);
            return ResponseEntity.ok(Map.of("message", "comment interaction deleted :)"));
        }catch(Exception e){
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // add report
    @PostMapping("/report-comment")
    public ResponseEntity<?> reportComment(@RequestBody Report dto) {
        try{
            cs.postCommentReport(dto);
            return ResponseEntity.ok(Map.of("message", "comment report posted :) Thank you for you collaboration to keep this platform a safe space for all fellow readers"));
        }catch(Exception e){
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

}
