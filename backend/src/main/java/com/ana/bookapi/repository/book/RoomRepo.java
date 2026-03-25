package com.ana.bookapi.repository.book;

import com.ana.bookapi.models.book.DiscussionRoom.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepo extends JpaRepository<Room, String> {
    Optional<Room> findById(String id);
    Optional<Room> findByName(String name);

}
