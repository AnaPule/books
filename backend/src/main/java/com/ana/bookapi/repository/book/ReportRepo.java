package com.ana.bookapi.repository.book;

import com.ana.bookapi.models.book.DiscussionRoom.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReportRepo extends JpaRepository<Report, String> {
    Optional<Report> findById(String id);

    @Query("SELECT r FROM Report r WHERE r.commentId = :comment_id")
    List<Report> findByCommentId(@Param("comment_id") String commentId);

    @Override
    boolean existsById(String s);
}
