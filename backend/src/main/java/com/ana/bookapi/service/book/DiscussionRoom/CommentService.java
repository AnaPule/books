package com.ana.bookapi.service.book.DiscussionRoom;

import com.ana.bookapi.models.book.DiscussionRoom.Comment;
import com.ana.bookapi.models.book.DiscussionRoom.CommentInteraction;
import com.ana.bookapi.models.book.DiscussionRoom.Report;
import com.ana.bookapi.repository.book.CommentInteractionRepo;
import com.ana.bookapi.repository.book.CommentRepo;
import com.ana.bookapi.repository.book.ReportRepo;
import com.ana.bookapi.repository.book.RoomRepo;
import org.apache.tomcat.util.http.parser.Cookie;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final RoomRepo rr;
    private final CommentRepo cr;
    private final ReportRepo repr;
    private CommentInteractionRepo cir;
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
    //get all comments in a room
    public List<Comment> getAllRoomComments(String roomId) {
        if (!rr.existsById(roomId)){
            System.err.println("Room does not exist: get all comments");
            return null;
        }
        return cr.findByRoomId(roomId);
    }

    // get all comment replies -> get all child comments to a comment
    public List<Comment> getAllReplies (String parent_id){
        if (!cr.existsById(parent_id)){
            System.err.println("Parent does not exist: get all comment replies");
            return null;
        }
        return cr.findByParentComment_Id(parent_id);
    }

    //post comment (can be independent or replies
    public Comment PostComment(Comment comment) {
        //check if room exists
        if (!rr.existsById(comment.getRoomId())){
            System.err.println("Room does not exist: post comment");
            return null;
        }

        //check if its a reply
        // if reply, than first check if parent exists
        if (comment.getParentId() != null && !cr.existsById(comment.getParentId())){
            System.err.println("Parent does not exist: post comment");
            return null;
        }

        // post comment
        return cr.save(comment);
    }

    public Comment EditComment(Comment comment) {
        if (!rr.existsById(comment.getRoomId())){
            //System.err.println("Room does not exist: post comment");
            throw new RuntimeException("Room does not exist: post comment");
        }

        if (comment.getParentId() != null && !cr.existsById(comment.getParentId())){
            throw new RuntimeException("Parent does not exist: post comment");
        }

        if (!cr.existsById(comment.getRoomId())){
            throw  new RuntimeException("Comment does not exist: post comment");
        }

        Comment existingComment = findById(comment.getId());
        existingComment.setContent(comment.getContent());
        return cr.save(existingComment);
    }

    // delete comment - soft delete / cannot be undone
    public void deleteComment(String comment_id) {
        if (!cr.existsById(comment_id)){
            throw new RuntimeException("Comment does not exist: delete comment");
        }
        Comment existingComment = findById(comment_id);
        existingComment.setDeleted(true);
        cr.save(existingComment);
    }

    // comment interaction - likes, dislike, report
    public void postCommentInteraction(CommentInteraction commentInteraction) {
        if (!cr.existsById(commentInteraction.getCommentId())){
            System.err.println("Comment does not exist: comment interaction");
            return;
        }
        cir.save(commentInteraction);
    }

    // delete comment interaction
    public void deleteCommentInteraction(CommentInteraction commentInteraction) {
        if (!cr.existsById(commentInteraction.getId())){
            throw new RuntimeException("Comment interaction does not exist: comment interaction");
        }
        if (!cr.existsById(commentInteraction.getCommentId())){
            System.err.println("Comment does not exist: comment interaction");
            return;
        }
        cir.deleteById(commentInteraction.getId());
    }

    //get number of interaction types - universal to types
    public Integer getNoOfInteractionType(String comment_id, Integer type) {
        if (!cr.existsById(comment_id)){
            System.err.println("Comment does not exist: get no interaction");
            return null;
        }
        return cir.getNumberOfInteractionType(comment_id, type);
    }

    // get all comment interactions
    public List<CommentInteraction> getAllcommentInteractions(String comment_id) {
        if (!cr.existsById(comment_id)){
            System.err.println("Comment does not exist: get all interactions");
            return null;
        }
        return cir.findByCommetId(comment_id);
    }

    // add comment report
    public Report postCommentReport(Report report) {
        if (!cr.existsById(report.getCommentId())){
            System.err.println("Comment does not exist: post comment report");
            return null;
        }
        return repr.save(report);
    }

    // get all comments reports
    public List<Report>  getAllCommentReports(String comment_id) {
        if (!cr.existsById(comment_id)){
            System.err.println("Comment does not exist: get all comment reports");
            return null;
        }
        return repr.findByCommentId(comment_id);
    }

    //helper
    private Comment findById(String id) {
        return cr.findById(id).orElseThrow(() -> new RuntimeException("Comment not found"));
    }
}
