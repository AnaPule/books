package com.ana.bookapi.models.book;



import java.time.LocalDateTime;
import java.util.UUID;
import jakarta.persistence.*;

@Entity
@Table(
        name="user_book",
        //Rule: The combination of these three columns must be unique across the entire table.
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","book_id","type_id"})
)
public class userBook {

    public userBook() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
    }

    public userBook(String userId, String bookId, Integer type) {
        this();
        this.userId = userId;
        this.bookId = bookId;
        this.type = type;
    }

    @Id
    @Column(name="id", length=70) private String id;
    @Column(name="user_id", nullable=false, length=70) private String userId;
    @Column(name="book_id", nullable = false, length=70) private String bookId;
    @Column(name="type_id", nullable = false) private Integer type;
    @Column(name = "created_at") private LocalDateTime createdAt;

    //methods
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getBookId() { return bookId; }
    public void setBookId(String bookId) { this.bookId = bookId; }

    public Integer getType() { return type; }
    public void setType(Integer typeId) { this.type = typeId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public enum RelationshipType {
        LIBRARY,        // Books they own
        WISHLIST,       // Books they want
        READING,        // Currently reading (with progress)
        COMPLETED,      // Finished reading
        DISLIKE,        // Not interested
        RECOMMEND,      // Recommended to them
        FAVORITE,       // Marked as favorite
    }
}
