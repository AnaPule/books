package com.ana.bookapi.repository.book;

import java.util.List;
import java.util.Optional;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ana.bookapi.models.book.DiscussionRoom.CommentInteraction;


@Repository
public interface CommentInteractionRepo extends JpaRepository<CommentInteraction, String> {
    //Optional<CommentInteraction> findByComment_Id(Integer commentId);


    @Query("SELECT CASE WHEN COUNT(ci) > 0 THEN true ELSE false END FROM interact ci WHERE ci.commentId = :commentId AND ci.userId = :userId AND ci.type = :type")
    boolean existsByCommentIdAndUserIdAndType(@Param("commentId") String commentId, @Param("userId") String userId, @Param("type") Integer type);
    // number of interactions - by type (universal use just counts hey)
    @Query("SELECT COUNT(ci) FROM interact ci WHERE ci.commentId = :comment_id AND ci.type = :type_id")
    Integer getNumberOfInteractionType(@Param("comment_id") String comment_id, @Param("type_id") Integer type);

    @Query("SELECT ci FROM interact ci WHERE ci.commentId = :comment_id")
    List<CommentInteraction> findByCommetId(@Param("comment_id") String commentId);
    //List<CommentInteraction> findByUser_Id(String user_id);

    @Override
    boolean existsById(String s);

    @Modifying
    @Transactional
    @Query("DELETE FROM interact ci where ci.commentId = :comment_id AND ci.userId = :user_id AND ci.type = :type_id")
    void deleteByCommentId(
            @Param("comment_id") String comment_id,
            @Param("user_id") String user_id,
            @Param("type_id") Integer type_id
    );
}
