package com.ana.bookapi.repository.book;

import com.ana.bookapi.models.book.DiscussionRoom.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepo extends JpaRepository<Member, String> {

    @Query("SELECT m FROM Member m WHERE m.roomId = :roomId")
    List<Member> findMembersByRoomId(@Param("roomId") String roomId);

    @Query("SELECT COUNT(m) FROM Member m WHERE m.roomId = :roomId")
    Integer countMembersByRoomId(@Param("roomId") String roomId);

    Optional<Member> findByUserIdAndRoomId(String userId, String roomId);

    void deleteByUserIdAndRoomId(String userId, String roomId);

    @Override
    boolean existsById(String s);

    boolean existsByUserIdAndRoomId(String userId, String roomId);
}
