package com.ana.bookapi.repository.auth;

import com.ana.bookapi.models.user.UsedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsedTokenRepo extends JpaRepository<UsedToken, String> {
    boolean existsByToken(String token);
    Optional<UsedToken> findByToken(String token);
}