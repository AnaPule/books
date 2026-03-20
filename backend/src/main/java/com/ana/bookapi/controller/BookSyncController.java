package com.ana.bookapi.controller;

import com.ana.bookapi.DTO.errResponse;
import com.ana.bookapi.models.book.Book;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import com.ana.bookapi.service.external.GoogleBooksSyncService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sync")
public class BookSyncController {

    private final GoogleBooksSyncService gs;
    private errResponse er = new errResponse();

    public BookSyncController(GoogleBooksSyncService gs) {
        this.gs = gs;
    }

    @PostMapping("/new-mongo-books-from-google-books")
    public ResponseEntity<?> newMongoBooksFromGoogleBooks() {
        try {
            int total = gs.saveGoogleBooksToMongo();

            Map<String, Object> response = new HashMap<>();
            response.put("New Books", total);
            response.put("message", "Saved new books to MongoDB!");
            response.put("status", 200);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            er.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    @PostMapping("/mongo-to-postgres-googlebooks")
    public ResponseEntity<Map<String, Object>> SyncGoogleBooks() {
        try {
            List<Book> synced = gs.syncGoogleBooksFromMongoToPostgres();
            Map<String, Object> response = new HashMap<>();

            response.put("success", true);
            response.put("books", synced);
            response.put("message", "synced " + synced.size() + " books from MongoDB!");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

}
