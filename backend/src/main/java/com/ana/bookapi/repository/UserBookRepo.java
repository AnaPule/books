package com.ana.bookapi.repository;

import java.util.List;
import java.util.Set;

import com.ana.bookapi.models.book.DiscussionRoom.Room;
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
    List<userBook> findByUserIdAndType(@Param("userId") String userId, @Param("type") Integer type);

    @Query("SELECT ub FROM userBook ub WHERE ub.userId = :userId AND ub.type IN :types")
    List<userBook> findByUserIdAndTypes(@Param("userId") String userId, @Param("types") List<Integer> types);

    @Query(value = "SELECT ub.book_id, COUNT(*) as count FROM user_book ub GROUP BY ub.book_id ORDER BY count ASC", nativeQuery = true)
    List<Object[]> findMostPopularBooks();

    @Query(value = "SELECT ub.book_id, COUNT(*) as count FROM user_book ub WHERE ub.created_at >= NOW() - INTERVAL '7 days' GROUP BY ub.book_id ORDER BY count DESC", nativeQuery = true)
    List<Object[]> findTrendingBooks();

    @Query("SELECT ub.userId, COUNT(ub.bookId) as bookCount FROM userBook ub " +
            "WHERE ub.bookId IN (SELECT b.id FROM Book b WHERE b.genreId IN :genres) " +
            "AND ub.userId != :userId " +
            "GROUP BY ub.userId " +
            "ORDER BY bookCount DESC")
    List<Object[]> findUsersByGenrePreferences(@Param("userId") String userId, @Param("genres") Set<String> genres);

    // Get most popular books EXCLUDING user's disliked books
    @Query(value = "SELECT ub.book_id, COUNT(*) as count FROM user_book ub " +
            "WHERE ub.book_id NOT IN (SELECT book_id FROM user_book WHERE user_id = :userId AND type_id = 5) " +
            "GROUP BY ub.book_id ORDER BY count DESC", nativeQuery = true)
    List<Object[]> findPopularBooksExcludingDislikes(@Param("userId") String userId);

    // Get trending books (last 7 days) EXCLUDING user's disliked books
    @Query(value = "SELECT ub.book_id, COUNT(*) as count FROM user_book ub " +
            "WHERE ub.created_at >= NOW() - INTERVAL '7 days' " +
            "AND ub.book_id NOT IN (SELECT book_id FROM user_book WHERE user_id = :userId AND type_id = 5) " +
            "GROUP BY ub.book_id ORDER BY count DESC", nativeQuery = true)
    List<Object[]> findTrendingBooksExcludingDislikes(@Param("userId") String userId);

    // Get trending books in user's favorite genres
    @Query(value = "SELECT ub.book_id, COUNT(*) as count FROM user_book ub " +
            "JOIN book b ON ub.book_id = b.id " +
            "WHERE ub.created_at >= NOW() - INTERVAL '7 days' " +
            "AND b.genre_id IN :genreIds " +
            "AND ub.book_id NOT IN (SELECT book_id FROM user_book WHERE user_id = :userId AND type_id = 5) " +
            "GROUP BY ub.book_id ORDER BY count DESC", nativeQuery = true)
    List<Object[]> findTrendingBooksByGenres(@Param("userId") String userId, @Param("genreIds") List<String> genreIds);

    @Query(value = "SELECT ub.book_id, COUNT(*) as count FROM user_book ub " +
            "WHERE ub.created_at >= DATE_TRUNC('week', CURRENT_DATE) " +
            "AND ub.created_at < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '7 days' " +
            "GROUP BY ub.book_id ORDER BY count DESC LIMIT 20", nativeQuery = true)
    List<Object[]> findWeeklyPopularBooks();

    @Query(value = "SELECT b.genre_id, COUNT(*) as count FROM user_book ub " +
            "JOIN book b ON ub.book_id = b.id " +
            "WHERE ub.created_at >= DATE_TRUNC('week', CURRENT_DATE) " +
            "GROUP BY b.genre_id " +
            "ORDER BY count DESC LIMIT 10", nativeQuery = true)
    List<Object[]> findTrendingGenres();

    // For trending authors
    @Query(value = "SELECT b.author_id, COUNT(*) as count FROM user_book ub " +
            "JOIN book b ON ub.book_id = b.id " +
            "WHERE ub.created_at >= DATE_TRUNC('week', CURRENT_DATE) " +
            "GROUP BY b.author_id " +
            "ORDER BY count DESC LIMIT 10", nativeQuery = true)
    List<Object[]> findTrendingAuthors();

    // For trending topics (from book categories/genres)
    @Query(value = "SELECT b.genre_id, g.name, COUNT(*) as count FROM user_book ub " +
            "JOIN book b ON ub.book_id = b.id " +
            "JOIN genre g ON b.genre_id = g.id " +
            "WHERE ub.created_at >= DATE_TRUNC('week', CURRENT_DATE) " +
            "GROUP BY b.genre_id, g.name " +
            "ORDER BY count DESC LIMIT 15", nativeQuery = true)
    List<Object[]> findTrendingTopics();

    // Trending today (last 24 hours)
    @Query(value = "SELECT ub.book_id, COUNT(*) as count FROM user_book ub " +
            "WHERE ub.created_at >= NOW() - INTERVAL '1 day' " +
            "GROUP BY ub.book_id ORDER BY count DESC", nativeQuery = true)
    List<Object[]> findTrendingToday();

    // Trending this month (last 30 days)
    @Query(value = "SELECT ub.book_id, COUNT(*) as count FROM user_book ub " +
            "WHERE ub.created_at >= NOW() - INTERVAL '30 days' " +
            "GROUP BY ub.book_id ORDER BY count DESC", nativeQuery = true)
    List<Object[]> findTrendingMonth();

    @Query("SELECT CASE WHEN COUNT(ub) > 0 THEN true ELSE false END FROM userBook ub WHERE ub.userId = :userId AND ub.bookId = :bookId AND ub.type = :type")
    boolean existsByBookIdAndUserIdAndType(@Param("userId") String userId, @Param("bookId") String bookId, @Param("type") Integer type);

    @Override
    boolean existsById(String s);

    void deleteByUserIdAndBookIdAndType(String userId, String bookId, Integer type);

    /**
     * -- DISCUSSION ROOM ALGORITHM --
     **/
    @Query("SELECT r, COUNT(m.userId) as members FROM Room r " +
            "LEFT JOIN Member m ON r.id = m.roomId " +
            "WHERE r.deleted = false " +
            "GROUP BY r.id " +
            "HAVING COUNT(m.userId) > 0 " +
            "ORDER BY COUNT(m.userId) DESC")
    List<Object[]> findMostPopularRooms();

}