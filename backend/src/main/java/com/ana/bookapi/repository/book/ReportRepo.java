package com.ana.bookapi.repository.book;

import com.ana.bookapi.models.book.DiscussionRoom.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReportRepo extends JpaRepository<Report, String> {
    Optional<Report> findById(String id);
    List<Report> findByComment_Id(String commentId);
    List<Report> findByUser_Id(String user_id);

    @Override
    boolean existsById(String s);
}
