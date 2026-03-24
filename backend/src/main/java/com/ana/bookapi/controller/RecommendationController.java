package com.ana.bookapi.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;

import com.ana.bookapi.models.Genre;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// models
import com.ana.bookapi.models.Author;
import com.ana.bookapi.models.book.Book;
import com.ana.bookapi.models.book.userBook;

// repo
import com.ana.bookapi.repository.BookRepo;
import com.ana.bookapi.repository.GenreRepo;
import com.ana.bookapi.repository.AuthorRepo;
import com.ana.bookapi.repository.UserBookRepo;

// service
import com.ana.bookapi.service.auth.userService;
import com.ana.bookapi.service.book.BookService;
import com.ana.bookapi.service.book.RecommendationService;

//DTO
import com.ana.bookapi.DTO.BookDTO;
import com.ana.bookapi.DTO.errResponse;
import com.ana.bookapi.DTO.userBookDTO;

@RestController
@RequestMapping("/recs")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final userService us;
    private final UserBookRepo userBookRepo;
    private final AuthorRepo authorRepo;
    private final GenreRepo genreRepo;
    private final BookRepo bookRepo;
    private final BookService bookService;

    private errResponse er = new errResponse();

    public RecommendationController(
            RecommendationService recommendationService,
            AuthorRepo authorRepo,
            BookRepo bookRepo,
            GenreRepo genreRepo,
            UserBookRepo userBookRepo,
            userService us,
            BookService bookService) {
        this.recommendationService = recommendationService;
        this.authorRepo = authorRepo;
        this.bookRepo = bookRepo;
        this.genreRepo = genreRepo;
        this.userBookRepo = userBookRepo;
        this.us = us;
        this.bookService = bookService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserRecommendations(@PathVariable String userId) {
        List<Book> books = recommendationService.getRecommendationsForUser(userId);

        List<BookDTO> dtos = books.stream()
                .map(book -> {
                    Author author = authorRepo.findById(book.getAuthorId()).orElse(null);
                    Genre genre = genreRepo.findById(book.getGenreId()).orElse(null);
                    return new BookDTO(book, author,  genre);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("books", dtos));
    }

    @GetMapping("/user/{userId}/collaborative")
    public ResponseEntity<?> getCollaborativeRecommendations(@PathVariable String userId) {
        List<Book> books = recommendationService.getCollaborativeRecommendations(userId);

        List<BookDTO> dtos = books.stream()
                .map(book -> {
                    Author author = authorRepo.findById(book.getAuthorId()).orElse(null);
                    return new BookDTO(book, author);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("books", dtos));
    }

    // Popular books (most interactions across all users)
    @GetMapping("/popular")
    public ResponseEntity<?> getPopularBooks() {
        List<Object[]> popularBooks = userBookRepo.findMostPopularBooks();

        List<BookDTO> books = popularBooks.stream()
                .map(result -> bookRepo.findById((String) result[0]))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(book -> {
                    Author author = authorRepo.findById(book.getAuthorId()).orElse(null);
                    return new BookDTO(book, author);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("books", books));
    }

    // Trending books (most interactions in last 7 days)
    @GetMapping("/trending")
    public ResponseEntity<?> getTrendingBooks() {
        List<Object[]> trendingBooks = userBookRepo.findTrendingBooks();

        List<BookDTO> books = trendingBooks.stream()
                .map(result -> bookRepo.findById((String) result[0]))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(book -> {
                    Author author = authorRepo.findById(book.getAuthorId()).orElse(null);
                    return new BookDTO(book, author);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("books", books));
    }

    // Trending - personalized to user's favorite genres
    @GetMapping("/user/{userId}/trending")
    public ResponseEntity<?> getTrendingForUser(@PathVariable String userId) {
        List<Book> books = recommendationService.getTrendingBooksByUserGenres(userId);

        List<BookDTO> dtos = books.stream()
                .map(book -> {
                    Author author = authorRepo.findById(book.getAuthorId()).orElse(null);
                    return new BookDTO(book, author);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("books", dtos));
    }

    @GetMapping("/trending/topics")
    public ResponseEntity<?> getTrendingTopics() {
        try {
            List<Map<String, Object>> trendingTopics = recommendationService.getTrendingTopics();

            // Get current week range
            LocalDate now = LocalDate.now();
            LocalDate monday = now.with(DayOfWeek.MONDAY);
            LocalDate sunday = now.with(DayOfWeek.SUNDAY);

            return ResponseEntity.ok(Map.of(
                    "topics", trendingTopics,
                    "week", monday.format(DateTimeFormatter.ofPattern("MMM dd")) + " - " +
                            sunday.format(DateTimeFormatter.ofPattern("MMM dd, yyyy"))
            ));
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // Today's top books (last 24 hours)
    @GetMapping("/trending/today")
    public ResponseEntity<?> getTrendingToday() {
        List<Object[]> trending = userBookRepo.findTrendingToday();

        List<BookDTO> books = trending.stream()
                .map(result -> bookRepo.findById((String) result[0]))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(book -> {
                    Author author = authorRepo.findById(book.getAuthorId()).orElse(null);
                    return new BookDTO(book, author);
                })
                .limit(5)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("books", books));
    }

    @GetMapping("/trending/week")
    public ResponseEntity<?> getFeaturedThisWeek() {
        try {
            List<Book> weeklyBooks = recommendationService.getFeaturedThisWeek();

            // Get current week range (Monday - Sunday)
            LocalDate now = LocalDate.now();
            LocalDate monday = now.with(DayOfWeek.MONDAY);
            LocalDate sunday = now.with(DayOfWeek.SUNDAY);

            List<BookDTO> dtos = weeklyBooks.stream()
                    .map(book -> {
                        Author author = authorRepo.findById(book.getAuthorId()).orElse(null);
                        Genre genre = genreRepo.findById(book.getGenreId()).orElse(null);
                        return new BookDTO(book, author, genre);
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "featured", dtos,
                    "week", monday.format(DateTimeFormatter.ofPattern("MMM dd")) + " - " +
                            sunday.format(DateTimeFormatter.ofPattern("MMM dd, yyyy"))
            ));
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // This month's top books (last 30 days)
    @GetMapping("/trending/month")
    public ResponseEntity<?> getTrendingMonth() {
        List<Object[]> trending = userBookRepo.findTrendingMonth();

        List<BookDTO> books = trending.stream()
                .map(result -> bookRepo.findById((String) result[0]))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(book -> {
                    Author author = authorRepo.findById(book.getAuthorId()).orElse(null);
                    return new BookDTO(book, author);
                })
                .limit(5)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("books", books));
    }

    // Popular - filtered for user
    @GetMapping("/user/{userId}/popular")
    public ResponseEntity<?> getPopularForUser(@PathVariable String userId) {
        List<Book> books = recommendationService.getPopularBooksForUser(userId);

        List<BookDTO> dtos = books.stream()
                .map(book -> {
                    Author author = authorRepo.findById(book.getAuthorId()).orElse(null);
                    return new BookDTO(book, author);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("books", dtos));
    }

    // Books by favorite genres (user's preferred genres)
    @GetMapping("/user/{userId}/genre")
    public ResponseEntity<?> getBooksByFavoriteGenres(@PathVariable String userId) {
        List<Book> books = recommendationService.getBooksByFavoriteGenres(userId);

        List<BookDTO> dtos = books.stream()
                .map(book -> {
                    Author author = authorRepo.findById(book.getAuthorId()).orElse(null);
                    return new BookDTO(book, author);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("books", dtos));
    }

    // Books by favorite author (user's preferred authors)
    @GetMapping("/user/{userId}/author")
    public ResponseEntity<?> getBooksByFavoriteAuthor(@PathVariable String userId) {
        List<Book> books = recommendationService.getBooksByFavoriteAuthor(userId);

        List<BookDTO> dtos = books.stream()
                .map(book -> {
                    Author author = authorRepo.findById(book.getAuthorId()).orElse(null);
                    return new BookDTO(book, author);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("books", dtos));
    }

    // Books by both favorite genre and author
    @GetMapping("/user/{userId}/favorites")
    public ResponseEntity<?> getBooksByFavorites(@PathVariable String userId) {
        List<Book> books = recommendationService.getBooksByFavorites(userId);

        List<BookDTO> dtos = books.stream()
                .map(book -> {
                    Author author = authorRepo.findById(book.getAuthorId()).orElse(null);
                    return new BookDTO(book, author);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("books", dtos));
    }

    // New releases
    @GetMapping("/new-releases")
    public ResponseEntity<?> getNewReleases() {
        List<Book> newBooks = bookRepo.findTopByOrderByPublicationDateDesc();

        List<BookDTO> books = newBooks.stream()
                .map(book -> {
                    Author author = authorRepo.findById(book.getAuthorId()).orElse(null);
                    return new BookDTO(book, author);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("books", books));
    }

    // Random books for discovery
    @GetMapping("/random")
    public ResponseEntity<?> getRandomBooks() {
        List<Book> randomBooks = bookRepo.findRandomBooks();

        List<BookDTO> books = randomBooks.stream()
                .map(book -> {
                    Author author = authorRepo.findById(book.getAuthorId()).orElse(null);
                    return new BookDTO(book, author);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("books", books));
    }

    // AI discovery type shiii
    @PostMapping("/user/books/interact")
    public ResponseEntity<?> interactWithBook(@RequestBody userBookDTO dto) {
        try {
            // Save the interaction
            userBook ub = us.AddBookTouserBook(dto.getUserId(), dto.getBookId(), 8); // INTERACTION type

            // Get AI recommendations based on this interaction
            List<Book> recommendations = recommendationService.getAIRecommendations(dto.getUserId(), dto.getBookId());

            // Save recommendations to user's RECOMMEND list
            for (Book book : recommendations) {
                if (!us.checkUserBookExists(dto.getUserId(), book.getId(), 6)) { // 6 = RECOMMEND
                    us.AddBookTouserBook(dto.getUserId(), book.getId(), 6);
                }
            }
            // Convert to BookDTOs
            List<BookDTO> dtos = recommendations.stream()
                    .map(book -> {
                        Author author = authorRepo.findById(book.getAuthorId()).orElse(null);
                        return new BookDTO(book, author);
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "message", "Interaction recorded",
                    "books", dtos
            ));
        } catch (RuntimeException e) {
            // error handling
            System.out.println("Failed for AI recommends" + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/book/{bookId}/similar")
    public ResponseEntity<?> getSimilarBooks(@PathVariable String bookId, @RequestParam(required = false) String userId) {
        try {
            Book book = bookService.getBookById(bookId);
            List<Book> similar = recommendationService.getSimilarBooks(book, userId);

            List<BookDTO> dtos = similar.stream()
                    .limit(20)  // Limit to 20
                    .map(b -> {
                        Author author = authorRepo.findById(b.getAuthorId()).orElse(null);
                        return new BookDTO(b, author);
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "book", new BookDTO(book, authorRepo.findById(book.getAuthorId()).orElse(null)),
                    "similar", dtos
            ));
        } catch (RuntimeException e) {
            er.setMessage("404 error: " + e.getMessage());
            er.setStatus(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
        }
    }
}