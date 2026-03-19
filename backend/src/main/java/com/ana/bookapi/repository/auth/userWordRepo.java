package com.ana.bookapi.repository.auth;

import java.time.LocalDateTime;
import java.util.Optional;
import com.ana.bookapi.models.user.UserWord;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface userWordRepo extends JpaRepository<UserWord, String> {

    LocalDateTime now = LocalDateTime.now();

    @Query("SELECT uw FROM Word uw WHERE uw.wordDate BETWEEN :startOfDay AND :endOfDay AND uw.userId = :userId")
    Optional<UserWord> findByDateAndUserId(
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay,
            @Param("userId") String userId
    );


    @Query("SELECT CASE WHEN COUNT(uw) > 0 THEN true ELSE false END FROM Word uw WHERE DATE(uw.wordDate) = DATE(:date) AND uw.userId = :userId")
    boolean existsByUserIdAndDate(@Param("userId") String userId, @Param("date") LocalDateTime date);
}
