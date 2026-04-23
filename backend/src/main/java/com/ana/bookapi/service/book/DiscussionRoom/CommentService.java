package com.ana.bookapi.service.book.DiscussionRoom;

import com.ana.bookapi.models.book.DiscussionRoom.Comment;
import com.ana.bookapi.models.book.DiscussionRoom.CommentInteraction;
import com.ana.bookapi.models.book.DiscussionRoom.Report;
import com.ana.bookapi.repository.book.CommentInteractionRepo;
import com.ana.bookapi.repository.book.CommentRepo;
import com.ana.bookapi.repository.book.ReportRepo;
import com.ana.bookapi.repository.book.RoomRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final RoomRepo rr;
    private final CommentRepo cr;
    private final ReportRepo repr;
    private final CommentInteractionRepo cir;
    private static final int DISLIKE_THRESHOLD = 50;

    public CommentService(
            RoomRepo rr,
            CommentRepo cr,
            ReportRepo repr,
            CommentInteractionRepo cir) {
        this.rr = rr;
        this.cr = cr;
        this.cir = cir;
        this.repr = repr;
    }

    public List<Comment> getAllRoomParentCommentsByRoomId(String roomId) {
        if (!rr.existsById(roomId)) {
            System.err.println("Room does not exist: get all comments");
            return null;
        }
        return cr.findAllRoomParentCommentsByRoomId(roomId);
    }

    // Get comment replies - only return replies if parent comment is not deleted
    public List<Comment> getCommentReplies(String parentId) {
        if (!cr.existsById(parentId)) {
            System.err.println("Parent does not exist: get all comments");
            return null;
        }

        // Check if parent comment is deleted (5+ dislikes)
        if (isCommentDeleted(parentId)) {
            return List.of(); // Return empty list - no replies shown for deleted comments
        }

        return cr.findByParentComment_Id(parentId).stream()
                .filter(comment -> !isCommentDeleted(comment.getId()))
                .collect(Collectors.toList());
    }

    // Check if a comment is "deleted" due to 5+ dislikes
    public boolean isCommentDeleted(String commentId) {
        Boolean result = false;
        if (!cr.existsById(commentId)) {
            return true;
        }
        Integer dislikes = getNoOfInteractionType(commentId, 2);
        if (dislikes != null && dislikes >= DISLIKE_THRESHOLD) {result = true;}
        return result;
    }

    // Get dislike count for a comment
    public Integer getDislikeCount(String commentId) {
        if (!cr.existsById(commentId)) {
            return 0;
        }
        Integer dislikes = getNoOfInteractionType(commentId, 2);
        return dislikes != null ? dislikes : 0;
    }

    //post comment (can be independent or replies)
    public Comment PostComment(Comment comment) {
        if (!rr.existsById(comment.getRoomId())) {
            throw new RuntimeException("Room does not exist: " + comment.getRoomId());
        }

        if (comment.getParentId() != null && !cr.existsById(comment.getParentId())) {
            throw new RuntimeException("Parent comment does not exist: " + comment.getParentId());
        }

        // Check if parent comment is deleted (cannot reply to deleted comments)
        if (comment.getParentId() != null && isCommentDeleted(comment.getParentId())) {
            throw new RuntimeException("Cannot reply to a comment that has been removed");
        }

        return cr.save(comment);
    }

    public Comment EditComment(Comment comment) {
        if (!rr.existsById(comment.getRoomId())) {
            throw new RuntimeException("Room does not exist: post comment");
        }

        if (comment.getParentId() != null && !cr.existsById(comment.getParentId())) {
            throw new RuntimeException("Parent does not exist: post comment");
        }

        if (!cr.existsById(comment.getId())) {
            throw new RuntimeException("Comment does not exist: edit comment");
        }

        // Check if comment is deleted
        if (isCommentDeleted(comment.getId())) {
            throw new RuntimeException("Cannot edit a comment that has been removed");
        }

        Comment existingComment = findById(comment.getId());
        existingComment.setContent(comment.getContent());
        return cr.save(existingComment);
    }

    // delete comment - soft delete
    public void deleteComment(String comment_id) {
        if (!cr.existsById(comment_id)) {
            throw new RuntimeException("Comment does not exist: delete comment");
        }
        Comment existingComment = findById(comment_id);
        existingComment.setDeleted(true);
        cr.save(existingComment);
    }

    // comment interaction - likes, dislike, report
    public void postCommentInteraction(CommentInteraction commentInteraction) {
        if (!cr.existsById(commentInteraction.getCommentId())) {
            System.err.println("Comment does not exist: comment interaction");
            return;
        }

        // Check if comment is deleted - no interactions allowed
        if (isCommentDeleted(commentInteraction.getCommentId())) {
            System.err.println("Cannot interact with deleted comment");
            return;
        }

        cir.save(commentInteraction);
    }

    // delete comment interaction
    public void deleteCommentInteraction(CommentInteraction commentInteraction) {
        /*
        if (!cir.findByCommetId(commentInteraction.getCommentId()).isEmpty()) {
            throw new RuntimeException("Comment interaction does not exist");
        }
        */
        if (!cr.existsById(commentInteraction.getCommentId())) {
            System.err.println("Comment does not exist: comment interaction");
            return;
        }
        cir.deleteByCommentId(
                commentInteraction.getCommentId(),
                commentInteraction.getUserId(),
                commentInteraction.getType()
        );
    }

    //get number of interaction types - universal to types
    public Integer getNoOfInteractionType(String comment_id, Integer type) {
        if (!cr.existsById(comment_id)) {
            System.err.println("Comment does not exist: get no interaction");
            return 0;
        }
        Integer count = cir.getNumberOfInteractionType(comment_id, type);
        return count != null ? count : 0;
    }

    // get all comment interactions
    public List<CommentInteraction> getAllcommentInteractions(String comment_id) {
        if (!cr.existsById(comment_id)) {
            System.err.println("Comment does not exist: get all interactions");
            return List.of();
        }
        return cir.findByCommetId(comment_id);
    }

    // add comment report
    public Report postCommentReport(Report report) {
        if (!cr.existsById(report.getCommentId())) {
            System.err.println("Comment does not exist: post comment report");
            return null;
        }
        return repr.save(report);
    }

    // get all comments reports
    public List<Report> getAllCommentReports(String comment_id) {
        if (!cr.existsById(comment_id)) {
            System.err.println("Comment does not exist: get all comment reports");
            return List.of();
        }
        return repr.findByCommentId(comment_id);
    }

    public boolean hasUserInteracted(String commentId, String userId, Integer type) {
        if (!cr.existsById(commentId)) {
            return false;
        }
        return cir.existsByCommentIdAndUserIdAndType(commentId, userId, type);
    }

    /// NOTE: ONLY THE BIG MAIN ROOM CAN HAVE THESE!!! SO THE ROOM_ID -> IS THE BIG ROOM ID
    public List<Comment> getQuietRoomCommentsByRoomId(String roomId) {
        if (!rr.existsById(roomId)) {
            System.err.println("Room does not exist: get quiet room comments");
        }
        return cr.findQuietRoomCommentsByRoomId(roomId);
    }
    //helper
    private Comment findById(String id) {
        return cr.findById(id).orElseThrow(() -> new RuntimeException("Comment not found"));
    }
}