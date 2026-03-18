package com.ana.bookapi.repository;


import java.util.Optional;
import java.time.LocalDateTime;

import com.ana.bookapi.models.UserQuote;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface UserQuoteRepo extends JpaRepository<UserQuote, String> {

    //Optional<UserQuote> findByUserIdandQuoteDateBetween(String userId, LocalDateTime startDate, LocalDateTime endDate);
    //boolean existsByUserIdAndQuoteDateBetween(String userId, LocalDateTime startDate, LocalDateTime endDate);


    @Query("SELECT q FROM Quote q WHERE q.quoteDate BETWEEN :startOfDay AND :endOfDay AND q.userId = :userId")
    Optional<UserQuote> findByUserIdAndDate(
            @Param("userId") String userId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );

    @Query("SELECT CASE WHEN COUNT(q) > 0 THEN true ELSE false END FROM Quote q WHERE DATE(q.quoteDate) = DATE(:date) AND q.userId = :userId")
    boolean existsByUserIdAndDate(
            @Param("userId") String userId,
            @Param("date") LocalDateTime date
    );
}