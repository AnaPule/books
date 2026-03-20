package com.ana.bookapi.repository;

import java.util.List;
import java.util.Optional;

import com.ana.bookapi.models.book.userBook;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface UserBookRepo extends JpaRepository<userBook, String> {
    List<userBook> findByUserId(String userId);
    List<userBook> findByBookId(String bookId);
    List<userBook> findByUserIdAndBookId(String userId, String bookId);
    List<userBook> findByUserIdAndBookIdAndType(String userId, String bookId, Integer type);

    @Query("SELECT ub FROM userBook ub WHERE ub.userId = :userId AND ub.type = :type")
    List<userBook> findByUserIdAndType(
            @Param("userId")String userId,
            @Param("type")Integer type
    );

    //Optional<List<userBook>> findByUserId(String userId);
    @Query("SELECT CASE WHEN COUNT(ub) > 0 THEN true ELSE false END FROM userBook ub WHERE ub.userId = :userId AND ub.bookId = :bookId AND ub.type = :type")
    boolean existsByBookIdAndUserIdAndType(
            @Param("userId") String userId,
            @Param("bookId") String bookId,
            @Param("type")Integer type
    );

    //@Query("DELETE FROM userBook ub WHERE ub.user_id = :userId AND ub.book_id = :bookId AND ub.type_id = :type")
    /*
    void deleteByUserIdAndBookIdAndType(
            @Param("userId") String userId,
            @Param("bookId") String bookId,
            @Param("type")Integer type
    );
     */

    void deleteByUserIdAndBookIdAndType(String userId, String bookId, Integer type);
}
