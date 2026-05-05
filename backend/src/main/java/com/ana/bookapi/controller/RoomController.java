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
import com.ana.bookapi.models.user.Notification;
import com.ana.bookapi.models.user.User;
import com.ana.bookapi.service.AuthorService;
import com.ana.bookapi.service.auth.userService;
import com.ana.bookapi.service.book.BookService;
import com.ana.bookapi.service.book.DiscussionRoom.CommentService;
import com.ana.bookapi.service.book.DiscussionRoom.MemberService;
import com.ana.bookapi.service.book.GenreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ana.bookapi.service.book.DiscussionRoom.RoomService;

import java.time.LocalDate;
import java.util.Date;
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
    private final userService us;
    private final CommentService cs;
    private errResponse er = new errResponse();

    public RoomController(
            RoomService rs,
            BookService bs,
            MemberService ms,
            AuthorService as,
            GenreService gs,
            userService us,
            CommentService cs) {
        this.rs = rs;
        this.bs = bs;
        this.as = as;
        this.gs = gs;
        this.ms = ms;
        this.cs = cs;
        this.us = us;
    }

    //get book main room
    @GetMapping("/book/{bookId}/{userId}")
    public ResponseEntity<?> getBookRoomsByBookId(@PathVariable String bookId, @PathVariable String userId) {
        try {
            Room rawRoom = rs.getBookMainRoom(bookId);
            Book rawBook = bs.getBookById(rawRoom.getBookId());
            Author author = as.getAuthorById(rawBook.getAuthorId());
            Genre genre = gs.getGenre(rawBook.getGenreId());
            BookDTO book = new BookDTO(rawBook, author, genre);

            List<SubRoomDTO> subRooms = rs.getSubRoomsByRoomId(rawRoom.getId())
                    .stream()
                    .map(room -> {
                        List<CommentDTO> comments = cs.getAllRoomParentCommentsByRoomId(room.getId())
                                .stream()
                                .map(comment -> convertCommentToDTO(comment, userId))
                                .collect(Collectors.toList());

                        return new SubRoomDTO(
                                room.getId(),
                                room.getName(),
                                ms.getNoOfMembers(room.getId()),
                                room.getType(),
                                comments,
                                room.getParentId());
                    })
                    .collect(Collectors.toList());

            List<CommentDTO> comments = cs.getAllRoomParentCommentsByRoomId(rawRoom.getId())
                    .stream()
                    .map(comment -> convertCommentToDTO(comment, userId))
                    .collect(Collectors.toList());

            List<CommentDTO> quietroom = cs.getQuietRoomCommentsByRoomId(rawRoom.getId())
                    .stream()
                    .map(quiet -> convertCommentToDTO(quiet, userId))
                    .collect(Collectors.toList());

            RoomDTO room = new RoomDTO(rawRoom.getId(), rawRoom.getName(), ms.getNoOfMembers(rawRoom.getId()), book, subRooms, comments, quietroom);
            return ResponseEntity.ok(Map.of("room", room));

        } catch (Exception e) {
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    private CommentDTO convertCommentToDTO(Comment comment, String user_id) {
        // Check if comment is deleted (50+ dislikes)
        boolean isDeleted = cs.isCommentDeleted(comment.getId());

        // If comment is deleted, return a special DTO with empty replies and generic content
        if (isDeleted) {
            return new CommentDTO(
                    comment.getId(),  // id
                    0, 0,  // likes, dislikes
                    List.of(),  // reports
                    true,  // deleted
                    "<em>This comment has been removed due to community guidelines violations.</em>",  // generic content
                    comment.getCreatedAt(),  // createdAt
                    new CommentDTO.CommentUserDTO("system", "Pages & Parchment", ""),  // system user
                    List.of(),  // interactions
                    List.of(),  // replies
                    false, false  // isLikedByUser, isDislikedByUser
            );
        }

        // Get user info
        CommentDTO.CommentUserDTO user;
        if (comment.getUserId().equals("Pages & Parchment")) {
            user = new CommentDTO.CommentUserDTO("system", "Pages ń Parchment", "");
        } else {
            User raw_user = us.getUserById(comment.getUserId());
            user = new CommentDTO.CommentUserDTO(raw_user.getId(), raw_user.getUsername(), raw_user.getProfilePhoto());
        }

        Integer likes = cs.getNoOfInteractionType(comment.getId(), 1);
        Integer dislikes = cs.getNoOfInteractionType(comment.getId(), 2);
        Boolean isLikedByUser = cs.hasUserInteracted(comment.getId(), user_id, 1);
        Boolean isDislikedByUser = cs.hasUserInteracted(comment.getId(), user_id, 2);
        List<Report> reports = cs.getAllCommentReports(comment.getId());
        List<CommentInteraction> interactions = cs.getAllcommentInteractions(comment.getId());

        // Get replies recursively - PASS user_id down
        List<CommentDTO> replies = cs.getCommentReplies(comment.getId())
                .stream()
                .map(reply -> convertCommentToDTO(reply, user_id))
                .collect(Collectors.toList());

        return new CommentDTO(comment, interactions, reports, false, likes, dislikes, user, replies, isLikedByUser, isDislikedByUser);
    }

    //create new sub room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Room room) {
        try {
            rs.createNewSubRoom(room);
            return ResponseEntity.ok(Map.of("message", "sub-room created :)"));
        } catch (Exception e) {
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // update room
    @PutMapping("/update-room-name")
    public ResponseEntity<?> updateRoom(@RequestBody Room room) {
        try {
            rs.updateRoom(room);
            return ResponseEntity.ok(Map.of("message", "room details updated :)"));
        } catch (Exception e) {
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //delete room - soft delete
    @PutMapping("/delete-room")
    public ResponseEntity<?> deleteRoom(@RequestBody Room room) {
        try {
            rs.deleteRoomById(room.getId());
            return ResponseEntity.ok(Map.of("message", "room deleted :("));
        } catch (Exception e) {
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //find out if user is a member
    @GetMapping("/member/{user_id}/room/{room_id}")
    public ResponseEntity<?> isMember(@PathVariable("user_id") String user_id, @PathVariable("room_id") String room_id) {
        try{
            return ResponseEntity.ok(Map.of("member", ms.isMemberInRoom(user_id, room_id)));
        }catch (Exception e){
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // get user rooms
    @GetMapping("/{user_id}")
    public ResponseEntity<?> getUserRooms(@PathVariable("user_id") String user_id) {
        try{
            List<RoomDTO> user_rooms = rs.getUserRooms(user_id)
                    .stream()
                    .map(
                            room -> {
                                return new RoomDTO(
                                        room.getId(),
                                        room.getName(),
                                        new BookDTO(bs.getBookById(room.getBookId())),
                                        ms.getNoOfMembers(room.getId())
                                );
                            }
                    )
                    .collect(Collectors.toList());
            return ResponseEntity.ok(Map.of("rooms",user_rooms));
        }catch (Exception e){
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // add member to room
    @PostMapping("/add-member/{userId}/{roomId}")
    public ResponseEntity<?> addMember(@PathVariable String userId, @PathVariable String roomId) {
        try {
            //check if user is already a member
            if (ms.isMemberInRoom(userId, roomId)) {
                return ResponseEntity.ok(Map.of("message", "You already in this community, silly ;)"));
            }

            ms.addMember(userId, roomId);
            User user = us.getUserById(userId);
            Room room = rs.findRoomById(roomId);
            Book book = bs.getBookById(room.getBookId());

            // add room meta data
            Notification message = new Notification(
                    2,
                    "Dearest gentle reader: Welcome to the experience of a life time.",
                    roomId,
                    userId,
                    "Joined a Discussion Room!!",
                    String.format("""
                                    <div style="display: flex; flex-direction: column; background: #f5f5f5; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                                        <div style="padding: 16px 16px 40px 16px;">
                                            <div style="background: white; border: 1px solid #d4d4d4; border-radius: 10px; overflow: hidden; width: 80%%; margin: 5rem auto;">
                                                <div style="display: flex; gap: 12px; align-items: flex-start; padding: 14px 20px; border-bottom: 1px solid #ececec;">
                                                    <div style="width: 34px; height: 34px; border-radius: 50%%; background: #b0b0b0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: white; flex-shrink: 0; margin-top: 2px;">pP</div>
                                                    <div style="flex: 1; min-width: 0;">
                                                        <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0;">Pages &amp; Parchment <span style="color: #888; font-weight: normal;">&lt;noreply@pagesparchment.com&gt;</span></p>
                                                        <p style="font-size: 12px; color: #555; margin: 4px 0 0 0;">Pages &amp; Parchment %d: A new chapter begins</p>
                                                        <p style="font-size: 11px; color: #999; margin: 4px 0 0 0;">Reply-To: Pages &amp; Parchment — help@pagesparchment.com</p>
                                                    </div>
                                                    <div style="text-align: right; flex-shrink: 0;">
                                                        <p style="font-size: 11px; color: #888; white-space: nowrap; margin: 0;">Inbox · Announcement &nbsp; %s</p>
                                                        <span style="display: inline-block; margin-top: 4px; font-size: 10px; background: #ebebeb; color: #555; border-radius: 4px; padding: 2px 6px;">pages_parchment_%d</span>
                                                        <p style="color: #d44000; font-size: 13px; margin-top: 6px; margin-bottom: 0;">⚑</p>
                                                    </div>
                                                </div>
                                                <div style="padding: 32px 56px;">
                                                    <p style="text-align: center; font-size: 12px; font-weight: 600; color: #999; letter-spacing: 0.2px; margin: 0 0 4px 0;">pages_parchment_%d</p>
                                                    <p style="text-align: center; font-size: 22px; color: #bbb; font-weight: 300; margin: 0 0 16px 0;">Pages &amp; Parchment %d</p>
                                                    <h1 style="text-align: center; font-size: 18px; font-weight: 700; color: #1d1d1f; margin: 0 0 20px 0;">You've joined the discussion</h1>
                                                    <h2 style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 10px 0;">Welcome to the reading room</h2>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">Dearest <strong>%s</strong>,</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">You have successfully joined the discussion room for <strong>%s</strong>.</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">Share your thoughts, connect with fellow readers, and explore the many layers of this literary journey. The shelves are now open to you.</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">We're delighted to have you among us.</p>
                                                    <p style="text-align: center; font-size: 13px; color: #999; font-style: italic; margin-top: 10px;">Your voice matters in this fellowship</p>
                                                </div>
                                                <div style="background: #f0f0f0; border-top: 1px solid #e0e0e0; padding: 20px 56px;">
                                                    <p style="font-size: 12px; color: #999; margin: 0 0 2px 0;">Email brought to you by</p>
                                                    <p style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 12px 0;">Pages &amp; Parchment</p>
                                                    <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0 0 2px 0;">New to discussion rooms? *</p>
                                                    <p style="font-size: 13px; color: #666; margin: 0 0 12px 0;">Contact support at help@pagesparchment.com</p>
                                                    <p style="font-size: 11px; color: #999; line-height: 1.5; margin: 0;">*Check the room guidelines to make the most of your reading experience.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    """,
                            LocalDate.now().getYear(), new Date(), LocalDate.now().getYear(), LocalDate.now().getYear(), LocalDate.now().getYear(), user.getUsername(), book.getName()
                    )
            );
            us.sendNotification(message);
            return ResponseEntity.ok(Map.of("message", String.format("Welcome to the %s chats :)", room.getName())));
        } catch (Exception e) {
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // remove member from room
    @PostMapping("/remove-member/{userId}/{roomId}")
    public ResponseEntity<?> removeMember(@PathVariable String userId, @PathVariable String roomId) {
        try {
            ms.removeMember(userId, roomId);
            return ResponseEntity.ok(Map.of("message", "Good bye dearest! :)"));
        } catch (Exception e) {
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //post comment
    @PostMapping("/post-comment")
    public ResponseEntity<?> postComment(@RequestBody Comment comment) {
        try {
            //System.out.println("comment Body room id: " + comment.getRoomId());
            //System.out.println("comment Body user: " + comment.getUserId());
            //System.out.println("comment Body parent id: " + comment.getParentId());
            //System.out.println("comment Body message: " + comment.getContent());
            //System.out.println("comment quite room: "+ comment.getQuietRoom());
            Comment NewComment = new Comment(
                    comment.getRoomId(),
                    comment.getUserId(),
                    comment.getParentId(),
                    comment.getQuietRoom(),
                    comment.getContent()
            );
            Comment savedComment = cs.PostComment(NewComment);

            if (savedComment == null) {
                er.setStatus(HttpStatus.BAD_REQUEST.value());
                er.setMessage("Failed to save comment - validation failed");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
            }

            return ResponseEntity.ok(Map.of("message", "comment posted :)"));
        } catch (Exception e) {
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // edit comment
    @PutMapping("/edit-comment")
    public ResponseEntity<?> editComment(@RequestBody Comment comment) {
        try {
            cs.EditComment(comment);
            return ResponseEntity.ok(Map.of("message", "comment edited :)"));
        } catch (Exception e) {
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // delete comment
    @DeleteMapping("/delete-comment")
    public ResponseEntity<?> deleteComment(@RequestBody Comment comment) {
        try {
            cs.deleteComment(comment.getId());
            return ResponseEntity.ok(Map.of("message", "comment deleted :)"));
        } catch (Exception e) {
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // add member comment interaction
    @PostMapping("/interact")
    public ResponseEntity<?> interact(@RequestBody CommentInteraction dto) {
        try {
            // post the interaction
            cs.postCommentInteraction(dto);

            // if its dislike, then check if threshold applies
            if (cs.isCommentDeleted(dto.getCommentId())) {
                // if its deleted
                cs.deleteComment(dto.getCommentId());
            }
            return ResponseEntity.ok(Map.of("message", "comment interaction posted :)"));
        } catch (Exception e) {
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // remove member comment interaction
    @DeleteMapping("/delete-interact/comment/{commentId}/user/{userId}/type/{type}")
    public ResponseEntity<?> deleteInteract(@PathVariable String commentId, @PathVariable String userId, @PathVariable Integer type) {
        try {
            CommentInteraction dto = new CommentInteraction(
                    commentId,
                    userId,
                    type
            );
            cs.deleteCommentInteraction(dto);

            // if its dislike, then check if threshold applies
            if (cs.isCommentDeleted(dto.getCommentId())) {
                // if its deleted
                cs.deleteComment(dto.getCommentId());
            }
            return ResponseEntity.ok(Map.of("message", "comment interaction deleted :)"));
        } catch (Exception e) {
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // add report
    @PostMapping("/report-comment")
    public ResponseEntity<?> reportComment(@RequestBody Report dto) {
        try {
            cs.postCommentReport(dto);
            return ResponseEntity.ok(Map.of("message", "comment report posted :) Thank you for you collaboration to keep this platform a safe space for all fellow readers"));
        } catch (Exception e) {
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

}
