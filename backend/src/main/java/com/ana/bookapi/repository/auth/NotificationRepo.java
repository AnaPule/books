package com.ana.bookapi.repository.auth;

import com.ana.bookapi.models.user.Notification;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Integer> {

    Boolean existsById(String id);
    Notification findById(String id);

    void deleteById(String id);
    @Query("SELECT n FROM Notification n WHERE n.receiveId = :user_id")
    List<Notification> findAllToUser_Id(@Param("user_id") String userId); // where receiver is user
}
