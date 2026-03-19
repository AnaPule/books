package com.ana.bookapi.repository.auth;

/* =================== MODELS =================== */
import com.ana.bookapi.models.user.User;

/* =================== PACKAGES =================== */
import org.springframework.data.jpa.repository.JpaRepository; // spring data fro db operations
import org.springframework.stereotype.Repository; // telling spring boot to treat this class as a repo

import java.util.Optional;

@Repository
public interface userRepo extends JpaRepository<User, String> {

    //SPRING DATA ALREADY AUTO IMPLEMENTS THESE METHODS
    Optional<User> findByUsername(String username); // SPRING CREATES SQL: SELECT * FROM user WHERE username = ?
    Optional<User> findByEmail(String email); // SPRING CREATES SQL: SELECT * FROM user WHERE email = ?


    // CHECK IF USERNAME AND EMAIL EXIST (FOR VALIDATION)
    boolean existsById(String id);
    boolean existsByUsername(String username); // SPRING SQL: SELECT COUNT(*) > 0 FROM user WHERE username = ?
    boolean existsByEmail(String email); // SPRING SQL: SELECT COUNT(*) > 0 FROM user WHERE email = ?
}
