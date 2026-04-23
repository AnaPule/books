package com.ana.bookapi.repository.book;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.ana.bookapi.models.book.DiscussionRoom.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface CommentRepo extends JpaRepository<Comment, String> {

    @Query("SELECT c FROM Comment c WHERE c.parentId = :parent_id AND c.quietRoom = false")
    List<Comment> findByParentComment_Id(@Param("parent_id") String parentCommentId);

    @Query("SELECT c FROM Comment c WHERE c.roomId = :room_id AND c.parentId IS NULL AND c.quietRoom = false ORDER BY c.createdAt DESC")
    List<Comment> findAllRoomParentCommentsByRoomId(@Param("room_id") String roomId);

    List<Comment> findByRoomId(@Param("room_id") String roomId);
    List<Comment> findByUserId(String userId);

    Optional<Comment> findById(String id);

    @Query("SELECT c FROM Comment c WHERE c.roomId = :room_id AND c.parentId IS NULL AND c.quietRoom = true")
    List<Comment> findQuietRoomCommentsByRoomId(@Param("room_id") String roomId);

    //find out if a comment exists - parent or child
    boolean existsById(String id);
}
