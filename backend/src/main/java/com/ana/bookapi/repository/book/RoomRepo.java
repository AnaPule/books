package com.ana.bookapi.repository.book;

import com.ana.bookapi.models.book.DiscussionRoom.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepo extends JpaRepository<Room, String> {
    Optional<Room> findById(String id);
    Optional<Room> findByName(String name);
    Optional<Room> findByParentId(String parentId);

    @Query("SELECT r FROM Room r WHERE r.bookId = :book_id AND r.type = 1 AND r.parentId IS NULL")
    Optional<Room> findBookMainRoom(@Param("book_id") String book_id);

    List<Room> findAllByParentId(String parentId);
    List<Room> findAllByBookId(String bookId);

    boolean existsById(String id);
    boolean existsByName(String name);
    boolean existsByParentId(String parentId);
    boolean existsByBookId(String bookId);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Room r WHERE r.parentId = :parent_id AND r.name = :room_name")
    boolean roomNameExists(@Param("parent_id") String parent_id, @Param("room_name") String name);
}
