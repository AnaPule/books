package com.ana.bookapi.controller;

/* =================== models =================== */

import com.ana.bookapi.DTO.*;
import com.ana.bookapi.DTO.Auth.*;
import com.ana.bookapi.models.user.Notification;
import com.ana.bookapi.DTO.Auth.PingDTO;
import com.ana.bookapi.models.user.User;
import com.ana.bookapi.models.book.userBook;
import com.ana.bookapi.models.user.UserQuote;

/* =================== services =================== */
import com.ana.bookapi.models.user.UserWord;
import com.ana.bookapi.service.auth.JwtService;
import com.ana.bookapi.service.auth.userService;
import com.ana.bookapi.service.auth.EmailService;
import com.ana.bookapi.service.auth.VerificationTokenService;

/* =================== PACKAGES =================== */
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.apache.logging.log4j.Logger;
import org.aspectj.weaver.ast.Not;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.HttpClientErrorException;

@RestController
@RequestMapping("/auth")

public class AuthController {
    //@Autowired private userService us;
    //@Autowired private errResponse er;
    //@Autowired private JwtService js;

    private final JwtService js;
    private final userService us;
    private final EmailService es;
    private final VerificationTokenService ts;
    private errResponse er = new errResponse();

    private AuthController(
            userService us,
            JwtService js,
            VerificationTokenService ts,
            EmailService es) {
        this.us = us;
        this.js = js;
        this.ts = ts;
        this.es = es;
    }

    @Value("${app.mode}")
    private String mode;
    @Value("${frontend.url}")
    private String frontendUrl;

    // ==================== ENDPOINTS ========================= //
    @PostMapping("/user/books")
    public ResponseEntity<?> addUserBook(@RequestBody userBookDTO dto) {
        try {
            userBook ub = us.AddBookTouserBook(dto.getUserId(), dto.getBook().getId(), dto.getType());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Book added successfully",
                    "userBook", ub,
                    "added", true
            ));
        } catch (RuntimeException e) {
            System.err.println(e.getMessage());
            er.setMessage("400 error: " + e.getMessage());
            er.setStatus(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    @GetMapping("/{userId}/books")
    public ResponseEntity<?> getUserBook(@PathVariable String userId) {
        try {
            List<userBookDTO> books = us.getUserBooks(userId);
            return ResponseEntity.status(HttpStatus.OK).body(books);
        } catch (RuntimeException e) {
            er.setMessage("400 error: " + e.getMessage());
            er.setStatus(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    @GetMapping("/{userId}/books/{type}")
    public ResponseEntity<?> getUserBooksByType(@PathVariable String userId, @PathVariable Integer type) {
        try {
            List<userBookDTO> books = us.getUserBooksByType(userId, type);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("books", books));
        } catch (RuntimeException e) {
            er.setMessage("400 error: " + e.getMessage());
            er.setStatus(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    @DeleteMapping("/{userId}/books/{bookId}")
    public ResponseEntity<?> removeUserBook(@PathVariable String userId, @PathVariable String bookId, @RequestParam Integer type) {
        try {
            if (!us.checkUserBookExists(userId, bookId, type)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                        "message", "Book not found in user's collection"
                ));
            }
            us.RemoveBookFromUserBook(userId, bookId, type);
            return ResponseEntity.ok(Map.of(
                    "message", "Book removed successfully"
            ));
        } catch (RuntimeException e) {
            System.err.println(e.getMessage());
            er.setMessage("400 error: " + e.getMessage());
            er.setStatus(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    @PostMapping("/word")
    public ResponseEntity<?> getWord(@RequestBody WordDTO dto) {
        LocalDateTime now = LocalDateTime.now();
        String word = dto.getWord();

        try {
            // Check DB first
            if (us.wordCheck(dto.getUserId(), now)) {
                UserWord data = us.getUserWord(dto.getUserId(), now);
                word = data.getWord();
            }

            // Try to fetch from dictionary API
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;

            ResponseEntity<Object[]> response = restTemplate.getForEntity(url, Object[].class);

            if (response.getBody() != null && response.getBody().length > 0) {
                // Success - process and save
                Map<String, Object> entry = (Map<String, Object>) response.getBody()[0];

                // Extract what you need
                String wordText = (String) entry.get("word");
                String phonetic = (String) entry.getOrDefault("phonetic", "");

                // Get the first meaning
                List<Map<String, Object>> meanings = (List<Map<String, Object>>) entry.get("meanings");
                Map<String, Object> firstMeaning = meanings.get(0);

                // Get the first definition
                List<Map<String, Object>> definitions = (List<Map<String, Object>>) firstMeaning.get("definitions");
                Map<String, Object> firstDefinition = definitions.get(0);

                // Map to your structure
                Map<String, Object> wordData = new HashMap<>();
                wordData.put("word", wordText);
                wordData.put("phonetic", phonetic);

                List<Map<String, Object>> meaningsList = new ArrayList<>();
                Map<String, Object> meaningMap = new HashMap<>();
                meaningMap.put("partsOfSpeech", firstMeaning.get("partOfSpeech"));

                List<Map<String, String>> definitionList = new ArrayList<>();
                Map<String, String> defMap = new HashMap<>();
                defMap.put("definition", (String) firstDefinition.get("definition"));
                definitionList.add(defMap);

                meaningMap.put("definitions", definitionList);
                meaningsList.add(meaningMap);

                wordData.put("meanings", meaningsList);

                // Save to DB only if successful
                if (!us.wordCheck(dto.getUserId(), now)) {
                    us.setUserWord(word, dto.getUserId());
                }

                return ResponseEntity.ok(wordData);
            } else {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
        } catch (HttpClientErrorException.NotFound e) {
            // Word not found in dictionary - try a different word
            List<String> wordList = Arrays.asList(
                    "serendipity", "ephemeral", "eloquent", "magnificent",
                    "perspicacious", "surreptitious", "mellifluous",
                    "ethereal", "luminous", "effervescent", "halcyon", "petrichor",
                    "sonorous", "ineffable", "quintessential", "epiphany", "solitude",
                    "melancholy", "nostalgia", "euphoria", "serenity", "zenith",
                    "cherish", "wanderlust", "cascade", "whimsy"
            );

            // Pick a different random word
            String newWord;
            do {
                newWord = wordList.get(new Random().nextInt(wordList.size()));
            } while (newWord.equals(word)); // Avoid infinite loop

            // Recursive call with new word
            WordDTO newDto = new WordDTO();
            newDto.setUserId(dto.getUserId());
            newDto.setWord(newWord);
            return getWord(newDto);

        } catch (Exception e) {
            er.setMessage(e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    @PostMapping("/quote")
    public ResponseEntity<?> getQuote(@RequestBody QuoteDTO dto) {
        LocalDateTime now = LocalDateTime.now();
        Map<String, Object> quoteData = new HashMap<>();

        try {
            //System.out.println("Has existing quote: " + us.quoteCheck(dto.getUserId(), now));

            //check if user has a quote of the day
            if (us.quoteCheck(dto.getUserId(), now)) {
                UserQuote existingQuote = us.getUserQuote(dto.getUserId(), now);
                //System.out.println("Found existing quote: " + existingQuote.getQuoteText());

                quoteData.put("quote", existingQuote.getQuoteText());
                quoteData.put("author", existingQuote.getQuoteAuthor());
                return ResponseEntity.ok(quoteData);
            }

            //user has no quote: fetch from API
            //System.out.println("Fetching new quote from API...");

            RestTemplate restTemplate = new RestTemplate();
            String url = "https://dummyjson.com/quotes/random";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            //if response body is empty
            if (response.getBody() == null) {
                System.out.println("API returned empty body");
                List<Map<String, Object>> fallbackQuotes = Arrays.asList(
                        Map.of("quote", "The only way to do great work is to love what you do.", "author", "Steve Jobs"),
                        Map.of("quote", "Be the change that you wish to see in the world.", "author", "Mahatma Gandhi"),
                        Map.of("quote", "In the middle of difficulty lies opportunity.", "author", "Albert Einstein"),
                        Map.of("quote", "Close your eyes, fall in Love, stay there.", "author", "Rumi"),
                        Map.of("quote", "The unexamined life is not worth living.", "author", "Socrates")
                );

                Random random = new Random();
                int randomIndex = random.nextInt(fallbackQuotes.size()); // No -1 needed
                Map<String, Object> selectedQuote = fallbackQuotes.get(randomIndex);

                UserQuote uq = new UserQuote(
                        dto.getUserId(),
                        (String) selectedQuote.get("quote"),
                        (String) selectedQuote.get("author")
                );
                return ResponseEntity.ok(uq);
            }

            //map the response
            Map<String, Object> apiResponse = response.getBody();
            System.out.println("API Response Body: " + apiResponse);

            String quoteText = (String) apiResponse.get("quote");
            String quoteAuthor = (String) apiResponse.get("author");

            //System.out.println("Quote Text: " + quoteText);
            //System.out.println("Quote Author: " + quoteAuthor);

            // Save to database
            us.setUserQuote(dto.getUserId(), quoteText, quoteAuthor);
            //System.out.println("Quote saved to database");

            // Return the quote
            quoteData.put("quote", quoteText);
            quoteData.put("author", quoteAuthor);

            return ResponseEntity.ok(quoteData);
        } catch (Exception e) {
            //System.out.println("ERROR: " + e.getMessage());
            er.setMessage(e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> user = us.getUsers();
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            er.setMessage(e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er); // 500 STATUS
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> AuthenticateUser(@RequestHeader(value = "Authorization", required = false) String header) {
        // ============ PRODUCTION ============= //

        //check authorisation header
        if (header == null || !header.startsWith("Bearer ")) {
            er.setMessage("401 error: Invalid Token. Authorisation header missing or invalid");
            er.setStatus(HttpStatus.UNAUTHORIZED.value());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(er);
        }

        String token = header.substring(7); ///**Note: The actual token starts at position 7; "Bearer " = 7 characters
        try {
            String username = js.extractUsername(token);
            User user = us.getUserByUsername(username);
            List<PingDTO> pings = us.getUserNotifications(user.getId())
                    .stream()
                    .map(ping -> {
                        return new PingDTO(
                                ping.getId(),
                                ping.getType(),
                                ping.getSubject(),
                                ping.getPreview(),
                                ping.getContent(),
                                ping.getPostTime(),
                                ping.getRead(),
                                new PingDTO.From(
                                        user.getId(),
                                        user.getUsername(),
                                        user.getProfilePhoto()
                                )
                        );
                    })
                    .collect(Collectors.toList());


            if (user == null) {
                er.setMessage("404 error: User not found");
                er.setStatus(HttpStatus.NOT_FOUND.value());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
            }

            /*
            List<Book> wishlist = wbs.getUserWishlist(user.getId());
            List<Book> library = uls.getUserLibrary(user.getId());
            List<RecommenderReponse> RawRecommended = rcs.getRecommedations(user.getId());
            List<Book> recommends = RawRecommended.stream()
                    .map(rec -> bs.getBookByIsbn(rec.getBook_id())) // or whatever ID field you use
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());


            Map<String, Object> response = new HashMap<>();
            response.put("user",user);
            response.put("library", library);
            response.put("wishlist", wishlist);
            response.put("recommends", recommends);

             */

            //Map<String, Object> response = new HashMap<>();
            //response.put("user", user, "pings", pings);

            return ResponseEntity.ok().body(Map.of("user", user, "pings", pings));
        } catch (Exception e) {
            er.setMessage("401 error: " + e.getMessage());
            er.setStatus(HttpStatus.UNAUTHORIZED.value());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(er);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> GetUserById(@PathVariable String id) {
        try {
            User user = us.getUserById(id);
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.notFound().build(); //404 STATUS
            }
        } catch (Exception e) {
            er.setMessage(e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //register
    @PostMapping("/register")
    public ResponseEntity<?> Register(@RequestBody User user) {
        try {
            User createdUser = us.createUser(user);
            try {
                PasswordResetDTO dto = new PasswordResetDTO();
                dto.setEmail(user.getEmail());
                Notification message = new Notification(
                        1,
                        "Your registration has been dually noted by the Pages ń Parchment team.",
                        "Pages & Parchment",
                        createdUser.getId(),
                        "Welcome",
                        String.format("""
                                        <div style="display: flex; flex-direction: column; background: #f5f5f5; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                                            <div style="padding: 16px 16px 40px 16px;">
                                                <div style="background: white; border: 1px solid #d4d4d4; border-radius: 10px; overflow: hidden; width: 80%%; margin: 5rem auto;">
                                                    <div style="display: flex; gap: 12px; align-items: flex-start; padding: 14px 20px; border-bottom: 1px solid #ececec;">
                                                        <div style="width: 34px; height: 34px; border-radius: 50%%; background: #b0b0b0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: white; flex-shrink: 0; margin-top: 2px;">pP</div>
                                                        <div style="flex: 1; min-width: 0;">
                                                            <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0;">Pages &amp; Parchment <span style="color: #888; font-weight: normal;">&lt;noreply@pagesparchment.com&gt;</span></p>
                                                            <p style="font-size: 12px; color: #555; margin: 4px 0 0 0;">Pages &amp; Parchment %d: You're officially a reader</p>
                                                            <p style="font-size: 11px; color: #999; margin: 4px 0 0 0;">Reply-To: Pages &amp; Parchment — help@pagesparchment.com</p>
                                                        </div>
                                                        <div style="text-align: right; flex-shrink: 0;">
                                                            <p style="font-size: 11px; color: #888; white-space: nowrap; margin: 0;">Inbox · Announcement &nbsp; %s</p>
                                                            <span style="display: inline-block; margin-top: 4px; font-size: 10px; background: #ebebeb; color: #555; border-radius: 4px; padding: 2px 6px;">pages_parchment_%d</span>
                                                            <p style="color: #d44000; font-size: 13px; margin-top: 6px; margin-bottom: 0;">⚑</p>
                                                        </div>
                                                    </div>
                                                    <div style="padding: 32px 56px;">
                                                        <p style="text-align: center; font-size: 12px; font-weight: 600; color: #999; letter-spacing: 0.2px; margin: 0 0 4px 0;">pages_parchment_%d</p>
                                                        <p style="text-align: center; font-size: 22px; color: #bbb; font-weight: 300; margin: 0 0 16px 0;">Pages &amp; Parchment %d</p>
                                                        <h1 style="text-align: center; font-size: 18px; font-weight: 700; color: #1d1d1f; margin: 0 0 20px 0;">Welcome home, dear reader</h1>
                                                        <h2 style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 10px 0;">Your account is ready</h2>
                                                        <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">Dearest <strong>%s</strong>,</p>
                                                        <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">Welcome to Pages &amp; Parchment — a quiet fellowship of readers, dreamers, and wanderers of worlds between pages. Your membership is now verified and fully unlocked.</p>
                                                        <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">The shelves are open. The reading rooms are waiting. We've tucked away a small welcome gift in your profile — a token of gratitude for joining our community.</p>
                                                        <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">May your next chapter be a beautiful one.</p>
                                                        <p style="text-align: center; font-size: 13px; color: #999; font-style: italic; margin-top: 10px;">A quiet shelf awaits you</p>
                                                    </div>
                                                    <div style="background: #f0f0f0; border-top: 1px solid #e0e0e0; padding: 20px 56px;">
                                                        <p style="font-size: 12px; color: #999; margin: 0 0 2px 0;">Email brought to you by</p>
                                                        <p style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 12px 0;">Pages &amp; Parchment</p>
                                                        <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0 0 2px 0;">Need help finding your way? *</p>
                                                        <p style="font-size: 13px; color: #666; margin: 0 0 12px 0;">Contact support at help@pagesparchment.com</p>
                                                        <p style="font-size: 11px; color: #999; line-height: 1.5; margin: 0;">*This message confirms your verified membership. We're honored to have you with us.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        """,
                                LocalDate.now().getYear(), LocalDate.now(), LocalDate.now().getYear(), LocalDate.now().getYear(), LocalDate.now().getYear(), createdUser.getUsername()
                        )
                );
                us.sendNotification(message);
                sendVerificationEmail(dto);
            } catch (Exception e) {
                Logger log = null;
                log.warn("Verification email failed to send", e);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (RuntimeException e) {
            er.setMessage("400 error: " + e.getMessage());
            er.setStatus(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //send email verification email
    @PostMapping("/sendVerificationEmail")
    public ResponseEntity<?> sendVerificationEmail(@RequestBody PasswordResetDTO dto) {
        System.out.println(dto.getEmail());
        try {
            User existingUser = us.getUserByEmail(dto.getEmail());
            String token = ts.generateVerificationToken(existingUser);
            String link = frontendUrl + "/auth/verify?token=" + token;
            es.sendVerificationEmail(
                    existingUser.getEmail(),
                    "Dearest Gentle Reader. Welcome.",
                    existingUser.getUsername(),
                    link
            );

            Notification message = new Notification(
                    1,
                    "Your request has been dually noted by the Pages ń Parchment team.",
                    "Pages & Parchment",
                    existingUser.getId(),
                    "Identity Verification",
                    String.format("""
                                    <div style="display: flex; flex-direction: column; background: #f5f5f5; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                                        <div style="padding: 16px 16px 40px 16px;">
                                            <div style="background: white; border: 1px solid #d4d4d4; border-radius: 10px; overflow: hidden; width: 80%%; margin: 5rem auto;">
                                                <div style="display: flex; gap: 12px; align-items: flex-start; padding: 14px 20px; border-bottom: 1px solid #ececec;">
                                                    <div style="width: 34px; height: 34px; border-radius: 50%%; background: #b0b0b0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: white; flex-shrink: 0; margin-top: 2px;">pP</div>
                                                    <div style="flex: 1; min-width: 0;">
                                                        <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0;">Pages &amp; Parchment <span style="color: #888; font-weight: normal;">&lt;noreply@pagesparchment.com&gt;</span></p>
                                                        <p style="font-size: 12px; color: #555; margin: 4px 0 0 0;">Pages &amp; Parchment %d: Welcome to our community</p>
                                                        <p style="font-size: 11px; color: #999; margin: 4px 0 0 0;">Reply-To: Pages &amp; Parchment — help@pagesparchment.com</p>
                                                    </div>
                                                    <div style="text-align: right; flex-shrink: 0;">
                                                        <p style="font-size: 11px; color: #888; white-space: nowrap; margin: 0;">Inbox · Announcement &nbsp; %s</p>
                                                        <span style="display: inline-block; margin-top: 4px; font-size: 10px; background: #ebebeb; color: #555; border-radius: 4px; padding: 2px 6px;">pages_parchment_%d</span>
                                                        <p style="color: #d44000; font-size: 13px; margin-top: 6px; margin-bottom: 0;">⚑</p>
                                                    </div>
                                                </div>
                                                <div style="padding: 32px 56px;">
                                                    <p style="text-align: center; font-size: 12px; font-weight: 600; color: #999; letter-spacing: 0.2px; margin: 0 0 4px 0;">pages_parchment_%d</p>
                                                    <p style="text-align: center; font-size: 22px; color: #bbb; font-weight: 300; margin: 0 0 16px 0;">Pages &amp; Parchment %d</p>
                                                    <h1 style="text-align: center; font-size: 18px; font-weight: 700; color: #1d1d1f; margin: 0 0 20px 0;">Welcome to Pages &amp; Parchment</h1>
                                                    <h2 style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 10px 0;">Your membership is pending verification</h2>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 28px 0;">Dear <strong>%s</strong>, welcome to our quiet fellowship of readers. Before you can join the discussion shelves and community reading rooms, we ask that you verify your identity — this keeps our space genuine and safe for all members. This link will remain active for <strong>15 minutes</strong>.</p>
                                                    <div style="text-align: center;">
                                                        <a href="%s" style="display: inline-block; background: #2a2a2a; color: white; text-align: center; padding: 14px 32px; font-size: 15px; border-radius: 6px; cursor: pointer; text-decoration: none; border: none;">Verify your identity</a>
                                                    </div>
                                                    <p style="text-align: center; font-size: 13px; color: #999; font-style: italic; margin-top: 10px;">Any account features will be unlocked upon verification</p>
                                                </div>
                                                <div style="background: #f0f0f0; border-top: 1px solid #e0e0e0; padding: 20px 56px;">
                                                    <p style="font-size: 12px; color: #999; margin: 0 0 2px 0;">Email brought to you by</p>
                                                    <p style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 12px 0;">Pages &amp; Parchment</p>
                                                    <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0 0 2px 0;">Need help with your account? *</p>
                                                    <p style="font-size: 13px; color: #666; margin: 0 0 12px 0;">Contact support at help@pagesparchment.com</p>
                                                    <p style="font-size: 11px; color: #999; line-height: 1.5; margin: 0;">*This message supports account security and member records. It doesn't offer the option to be removed from the recipients list.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    """,
                            LocalDate.now().getYear(), new Date(), LocalDate.now().getYear(), LocalDate.now().getYear(), LocalDate.now().getYear(), existingUser.getUsername(), link
                    )
            );
            us.sendNotification(message);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Your verification Email has been sent!");
            response.put("status", "success");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            er.setMessage("400 error: " + e.getMessage());
            er.setStatus(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
        }
    }

    //verify email
    @GetMapping("/verify")
    public ResponseEntity<?> VerifyEmail(@RequestParam String token) {

        String email = ts.validateVerificationToken(token);
        if (email == null) {
            er.setMessage("401 error: Invalid or expired Token");
            er.setStatus(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(er);
        }

        try {
            User user = us.getUserByEmail(email);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            //Verify user
            Boolean verified = us.verifyUser(user.getId());

            //send notofication
            Notification message = new Notification(
                    1,
                    "Our safety verification has commenced and been completed.",
                    "Pages ń Parchment",
                    user.getId(),
                    "Successful Verification",
                    String.format("""
                                    <div style="display: flex; flex-direction: column; background: #f5f5f5; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                                        <div style="padding: 16px 16px 40px 16px;">
                                            <div style="background: white; border: 1px solid #d4d4d4; border-radius: 10px; overflow: hidden; width: 80%%; margin: 5rem auto;">
                                                <div style="display: flex; gap: 12px; align-items: flex-start; padding: 14px 20px; border-bottom: 1px solid #ececec;">
                                                    <div style="width: 34px; height: 34px; border-radius: 50%%; background: #b0b0b0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: white; flex-shrink: 0; margin-top: 2px;">pP</div>
                                                    <div style="flex: 1; min-width: 0;">
                                                        <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0;">Pages &amp; Parchment <span style="color: #888; font-weight: normal;">&lt;noreply@pagesparchment.com&gt;</span></p>
                                                        <p style="font-size: 12px; color: #555; margin: 4px 0 0 0;">Pages &amp; Parchment %d: Your email is verified</p>
                                                        <p style="font-size: 11px; color: #999; margin: 4px 0 0 0;">Reply-To: Pages &amp; Parchment — help@pagesparchment.com</p>
                                                    </div>
                                                    <div style="text-align: right; flex-shrink: 0;">
                                                        <p style="font-size: 11px; color: #888; white-space: nowrap; margin: 0;">Inbox · Announcement &nbsp; %s</p>
                                                        <span style="display: inline-block; margin-top: 4px; font-size: 10px; background: #ebebeb; color: #555; border-radius: 4px; padding: 2px 6px;">pages_parchment_%d</span>
                                                        <p style="color: #d44000; font-size: 13px; margin-top: 6px; margin-bottom: 0;">⚑</p>
                                                    </div>
                                                </div>
                                                <div style="padding: 32px 56px;">
                                                    <p style="text-align: center; font-size: 12px; font-weight: 600; color: #999; letter-spacing: 0.2px; margin: 0 0 4px 0;">pages_parchment_%d</p>
                                                    <p style="text-align: center; font-size: 22px; color: #bbb; font-weight: 300; margin: 0 0 16px 0;">Pages &amp; Parchment %d</p>
                                                    <h1 style="text-align: center; font-size: 18px; font-weight: 700; color: #1d1d1f; margin: 0 0 20px 0;">Your email is verified</h1>
                                                    <h2 style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 10px 0;">You're officially one of us</h2>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">Dearest <strong>%s</strong>,</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">Thank you for verifying your email. Your place among our fellowship is now sealed.</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">The reading rooms are now fully open to you. Join discussions, share your favorite passages, and discover your next great read among kindred spirits.</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">We're delighted to have you here.</p>
                                                    <p style="text-align: center; font-size: 13px; color: #999; font-style: italic; margin-top: 10px;">Turn the page — your story continues</p>
                                                </div>
                                                <div style="background: #f0f0f0; border-top: 1px solid #e0e0e0; padding: 20px 56px;">
                                                    <p style="font-size: 12px; color: #999; margin: 0 0 2px 0;">Email brought to you by</p>
                                                    <p style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 12px 0;">Pages &amp; Parchment</p>
                                                    <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0 0 2px 0;">Ready to start reading? *</p>
                                                    <p style="font-size: 13px; color: #666; margin: 0 0 12px 0;">Contact support at help@pagesparchment.com</p>
                                                    <p style="font-size: 11px; color: #999; line-height: 1.5; margin: 0;">*Your email verification is complete. Welcome to the fellowship.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    """,
                            LocalDate.now().getYear(), new Date(), LocalDate.now().getYear(), LocalDate.now().getYear(), LocalDate.now().getYear(), user.getUsername()
                    )
            );
            us.sendNotification(message);
            return ResponseEntity.ok(Map.of(
                    "verified", verified,
                    "message", "Email verified successfully!"
            ));
        } catch (Exception e) {
            User user = us.getUserByEmail(email);
            //send notofication
            Notification message = new Notification(
                    1,
                    "Our safety verification has commenced and been interrupted.",
                    "Pages ń Parchment",
                    user.getId(),
                    "Failed identity Verification",
                    String.format("""
                                    <div style="display: flex; flex-direction: column; background: #f5f5f5; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                                        <div style="padding: 16px 16px 40px 16px;">
                                            <div style="background: white; border: 1px solid #d4d4d4; border-radius: 10px; overflow: hidden; width: 80%%; margin: 5rem auto;">
                                                <div style="display: flex; gap: 12px; align-items: flex-start; padding: 14px 20px; border-bottom: 1px solid #ececec;">
                                                    <div style="width: 34px; height: 34px; border-radius: 50%%; background: #b0b0b0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: white; flex-shrink: 0; margin-top: 2px;">pP</div>
                                                    <div style="flex: 1; min-width: 0;">
                                                        <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0;">Pages &amp; Parchment <span style="color: #888; font-weight: normal;">&lt;noreply@pagesparchment.com&gt;</span></p>
                                                        <p style="font-size: 12px; color: #555; margin: 4px 0 0 0;">Pages &amp; Parchment %d: Verification issue</p>
                                                        <p style="font-size: 11px; color: #999; margin: 4px 0 0 0;">Reply-To: Pages &amp; Parchment — help@pagesparchment.com</p>
                                                    </div>
                                                    <div style="text-align: right; flex-shrink: 0;">
                                                        <p style="font-size: 11px; color: #888; white-space: nowrap; margin: 0;">Inbox · Announcement &nbsp; %s</p>
                                                        <span style="display: inline-block; margin-top: 4px; font-size: 10px; background: #ebebeb; color: #555; border-radius: 4px; padding: 2px 6px;">pages_parchment_%d</span>
                                                        <p style="color: #d44000; font-size: 13px; margin-top: 6px; margin-bottom: 0;">⚑</p>
                                                    </div>
                                                </div>
                                                <div style="padding: 32px 56px;">
                                                    <p style="text-align: center; font-size: 12px; font-weight: 600; color: #999; letter-spacing: 0.2px; margin: 0 0 4px 0;">pages_parchment_%d</p>
                                                    <p style="text-align: center; font-size: 22px; color: #bbb; font-weight: 300; margin: 0 0 16px 0;">Pages &amp; Parchment %d</p>
                                                    <h1 style="text-align: center; font-size: 18px; font-weight: 700; color: #1d1d1f; margin: 0 0 20px 0;">Verification encountered an issue</h1>
                                                    <h2 style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 10px 0;">We couldn't complete the verification</h2>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">Dearest <strong>%s</strong>,</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">We're terribly sorry, but something went wrong on our end while trying to verify your email address. This is an internal issue on our side — nothing you've done.</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">Please return to the login page and request a new verification code. We'll make sure the next one reaches you without trouble.</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">We apologize for the inconvenience and thank you for your patience.</p>
                                    
                                                    <p style="text-align: center; font-size: 13px; color: #999; font-style: italic; margin-top: 10px;">We'll be ready when you are</p>
                                                </div>
                                                <div style="background: #f0f0f0; border-top: 1px solid #e0e0e0; padding: 20px 56px;">
                                                    <p style="font-size: 12px; color: #999; margin: 0 0 2px 0;">Email brought to you by</p>
                                                    <p style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 12px 0;">Pages &amp; Parchment</p>
                                                    <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0 0 2px 0;">Need help? *</p>
                                                    <p style="font-size: 13px; color: #666; margin: 0 0 12px 0;">Contact support at help@pagesparchment.com</p>
                                                    <p style="font-size: 11px; color: #999; line-height: 1.5; margin: 0;">*If the issue persists, please reach out to our support team and we'll help you personally.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    """,
                            LocalDate.now().getYear(), new Date(), LocalDate.now().getYear(), LocalDate.now().getYear(), LocalDate.now().getYear(), user.getUsername()
                    )
            );
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    // password reset email
    @PostMapping("/forgot-password")
    public ResponseEntity<?> ForgotPassword(@RequestBody PasswordResetDTO dto) {
        try {
            User user = us.getUserByEmail(dto.getEmail());
            String token = ts.generateVerificationToken(user);
            String link = frontendUrl + "/auth/reset-password?token=" + token;
            es.SendResetPasswordEmail(
                    user.getEmail(),
                    "Reset Password.",
                    user.getUsername(),
                    link
            );

            //send notification
            Notification message = new Notification(
                    1,
                    "Procedure to reset your password.",
                    "Pages ń Parchment",
                    user.getId(),
                    "Reset Password",
                    String.format("""
                                    <div style="display: flex; flex-direction: column; background: #f5f5f5; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                                        <div style="padding: 16px 16px 40px 16px;">
                                            <div style="background: white; border: 1px solid #d4d4d4; border-radius: 10px; overflow: hidden; width: 80%%; margin: 5rem auto;">
                                                <div style="display: flex; gap: 12px; align-items: flex-start; padding: 14px 20px; border-bottom: 1px solid #ececec;">
                                                    <div style="width: 34px; height: 34px; border-radius: 50%%; background: #b0b0b0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: white; flex-shrink: 0; margin-top: 2px;">pP</div>
                                                    <div style="flex: 1; min-width: 0;">
                                                        <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0;">Pages &amp; Parchment <span style="color: #888; font-weight: normal;">&lt;noreply@pagesparchment.com&gt;</span></p>
                                                        <p style="font-size: 12px; color: #555; margin: 4px 0 0 0;">Pages &amp; Parchment %d: Reset your password</p>
                                                        <p style="font-size: 11px; color: #999; margin: 4px 0 0 0;">Reply-To: Pages &amp; Parchment — help@pagesparchment.com</p>
                                                    </div>
                                                    <div style="text-align: right; flex-shrink: 0;">
                                                        <p style="font-size: 11px; color: #888; white-space: nowrap; margin: 0;">Inbox · Announcement &nbsp; %s</p>
                                                        <span style="display: inline-block; margin-top: 4px; font-size: 10px; background: #ebebeb; color: #555; border-radius: 4px; padding: 2px 6px;">pages_parchment_%d</span>
                                                        <p style="color: #d44000; font-size: 13px; margin-top: 6px; margin-bottom: 0;">⚑</p>
                                                    </div>
                                                </div>
                                                <div style="padding: 32px 56px;">
                                                    <p style="text-align: center; font-size: 12px; font-weight: 600; color: #999; letter-spacing: 0.2px; margin: 0 0 4px 0;">pages_parchment_%d</p>
                                                    <p style="text-align: center; font-size: 22px; color: #bbb; font-weight: 300; margin: 0 0 16px 0;">Pages &amp; Parchment %d</p>
                                                    <h1 style="text-align: center; font-size: 18px; font-weight: 700; color: #1d1d1f; margin: 0 0 20px 0;">Reset your password</h1>
                                                    <h2 style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 10px 0;">We've received your request</h2>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">Dearest <strong>%s</strong>,</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">We received a request to reset your password for your Pages &amp; Parchment account. If you made this request, click the button below to create a new password.</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">This link will remain active for <strong>15 minutes</strong>. If you didn't request this, you can safely ignore this email — your password will remain unchanged.</p>
                                                    <div style="text-align: center;">
                                                        <a href="%s" style="display: inline-block; background: #2a2a2a; color: white; text-align: center; padding: 14px 32px; font-size: 15px; border-radius: 6px; cursor: pointer; text-decoration: none; border: none;">Reset your password</a>
                                                    </div>
                                                    <p style="text-align: center; font-size: 13px; color: #999; font-style: italic; margin-top: 10px;">Your security matters to us</p>
                                                </div>
                                                <div style="background: #f0f0f0; border-top: 1px solid #e0e0e0; padding: 20px 56px;">
                                                    <p style="font-size: 12px; color: #999; margin: 0 0 2px 0;">Email brought to you by</p>
                                                    <p style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 12px 0;">Pages &amp; Parchment</p>
                                                    <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0 0 2px 0;">Didn't request this? *</p>
                                                    <p style="font-size: 13px; color: #666; margin: 0 0 12px 0;">Contact support at help@pagesparchment.com</p>
                                                    <p style="font-size: 11px; color: #999; line-height: 1.5; margin: 0;">*If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    """,
                            LocalDate.now().getYear(), new Date(), LocalDate.now().getYear(), LocalDate.now().getYear(), LocalDate.now().getYear(), user.getUsername(), link
                    )
            );
            us.sendNotification(message);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of("message", "Your Email has been sent!"));
        } catch (Exception e) {
            er.setMessage("400 error: " + e.getMessage());
            er.setStatus(HttpStatus.BAD_REQUEST.value());
            System.out.println(er.getStatus() + er.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
        }
    }

    // resubscription email
    @PostMapping("/resubscribe/{email}")
    public ResponseEntity<?> Resubscribe(@PathVariable String email) {
        try {
            User user = us.getUserByEmail(email);
            String token = ts.generateVerificationToken(user);
            String link = frontendUrl + "/auth/resubscribe?token=" + token;
            es.sendResubscribeEmail(
                    user.getEmail(),
                    "Welcome Back to the Fellowship - Pages & Parchment",
                    user.getUsername(),
                    link
            );

            Notification message = new Notification(
                    1,
                    "Your return has been dually noted.",
                    "Pages ń Parchments",
                    user.getId(),
                    "Resubscription",
                    String.format("""
                                    <div style="display: flex; flex-direction: column; background: #f5f5f5; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                                        <div style="padding: 16px 16px 40px 16px;">
                                            <div style="background: white; border: 1px solid #d4d4d4; border-radius: 10px; overflow: hidden; width: 80%%; margin: 5rem auto;">
                                                <div style="display: flex; gap: 12px; align-items: flex-start; padding: 14px 20px; border-bottom: 1px solid #ececec;">
                                                    <div style="width: 34px; height: 34px; border-radius: 50%%; background: #b0b0b0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: white; flex-shrink: 0; margin-top: 2px;">pP</div>
                                                    <div style="flex: 1; min-width: 0;">
                                                        <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0;">Pages &amp; Parchment <span style="color: #888; font-weight: normal;">&lt;noreply@pagesparchment.com&gt;</span></p>
                                                        <p style="font-size: 12px; color: #555; margin: 4px 0 0 0;">Pages &amp; Parchment %d: Your return has been noted</p>
                                                        <p style="font-size: 11px; color: #999; margin: 4px 0 0 0;">Reply-To: Pages &amp; Parchment — help@pagesparchment.com</p>
                                                    </div>
                                                    <div style="text-align: right; flex-shrink: 0;">
                                                        <p style="font-size: 11px; color: #888; white-space: nowrap; margin: 0;">Inbox · Announcement &nbsp; %s</p>
                                                        <span style="display: inline-block; margin-top: 4px; font-size: 10px; background: #ebebeb; color: #555; border-radius: 4px; padding: 2px 6px;">pages_parchment_%d</span>
                                                        <p style="color: #d44000; font-size: 13px; margin-top: 6px; margin-bottom: 0;">⚑</p>
                                                    </div>
                                                </div>
                                                <div style="padding: 32px 56px;">
                                                    <p style="text-align: center; font-size: 12px; font-weight: 600; color: #999; letter-spacing: 0.2px; margin: 0 0 4px 0;">pages_parchment_%d</p>
                                                    <p style="text-align: center; font-size: 22px; color: #bbb; font-weight: 300; margin: 0 0 16px 0;">Pages &amp; Parchment %d</p>
                                                    <h1 style="text-align: center; font-size: 18px; font-weight: 700; color: #1d1d1f; margin: 0 0 20px 0;">Welcome back to the fellowship</h1>
                                                    <h2 style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 10px 0;">Your return has been dually noted</h2>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">Dearest <strong>%s</strong>,</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">We've missed you. A letter to renew your fellowship has been sent to your email. Click the button below to complete your resubscription and rejoin our quiet community of readers.</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">This link will remain active for <strong>15 minutes</strong>. The shelves have been waiting for your return.</p>
                                                    <div style="text-align: center;">
                                                        <a href="%s" style="display: inline-block; background: #2a2a2a; color: white; text-align: center; padding: 14px 32px; font-size: 15px; border-radius: 6px; cursor: pointer; text-decoration: none; border: none;">Renew your fellowship</a>
                                                    </div>
                                                    <p style="text-align: center; font-size: 13px; color: #999; font-style: italic; margin-top: 10px;">The pages have missed your touch</p>
                                                </div>
                                                <div style="background: #f0f0f0; border-top: 1px solid #e0e0e0; padding: 20px 56px;">
                                                    <p style="font-size: 12px; color: #999; margin: 0 0 2px 0;">Email brought to you by</p>
                                                    <p style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 12px 0;">Pages &amp; Parchment</p>
                                                    <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0 0 2px 0;">Having trouble resubscribing? *</p>
                                                    <p style="font-size: 13px; color: #666; margin: 0 0 12px 0;">Contact support at help@pagesparchment.com</p>
                                                    <p style="font-size: 11px; color: #999; line-height: 1.5; margin: 0;">*If the link has expired, simply return to the login page to request a new resubscription email.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    """,
                            LocalDate.now().getYear(), new Date().getTime(), LocalDate.now().getYear(), LocalDate.now().getYear(), LocalDate.now().getYear(), user.getUsername(), link
                    )
            );
            us.sendNotification(message);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Your Email for return has been sent!"));
        } catch (Exception e) {
            er.setMessage("400 error: " + e.getMessage());
            er.setStatus(HttpStatus.BAD_REQUEST.value());
            System.out.println(er.getStatus() + er.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
        }
    }

    // reset password
    @PostMapping("/password-reset")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetDTO reset) {
        String email = ts.validateVerificationToken(reset.getToken());

        if (email == null) {
            er.setMessage("Password reset Failed: Invalid or expired Token.");
            er.setStatus(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(er);
        }

        try {
            User user = us.getUserByEmail(email);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            us.ResetPassword(user.getEmail(), reset.getPassword());

            Notification message = new Notification(
                    1,
                    "Procedure to create a new password has been completed",
                    "Pages ń Parchment",
                    user.getId(),
                    "Password Reset",
                    String.format("""
                                    <div style="display: flex; flex-direction: column; background: #f5f5f5; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                                        <div style="padding: 16px 16px 40px 16px;">
                                            <div style="background: white; border: 1px solid #d4d4d4; border-radius: 10px; overflow: hidden; width: 80%%; margin: 5rem auto;">
                                                <div style="display: flex; gap: 12px; align-items: flex-start; padding: 14px 20px; border-bottom: 1px solid #ececec;">
                                                    <div style="width: 34px; height: 34px; border-radius: 50%%; background: #b0b0b0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: white; flex-shrink: 0; margin-top: 2px;">pP</div>
                                                    <div style="flex: 1; min-width: 0;">
                                                        <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0;">Pages &amp; Parchment <span style="color: #888; font-weight: normal;">&lt;noreply@pagesparchment.com&gt;</span></p>
                                                        <p style="font-size: 12px; color: #555; margin: 4px 0 0 0;">Pages &amp; Parchment %d: Password reset complete</p>
                                                        <p style="font-size: 11px; color: #999; margin: 4px 0 0 0;">Reply-To: Pages &amp; Parchment — help@pagesparchment.com</p>
                                                    </div>
                                                    <div style="text-align: right; flex-shrink: 0;">
                                                        <p style="font-size: 11px; color: #888; white-space: nowrap; margin: 0;">Inbox · Announcement &nbsp; %s</p>
                                                        <span style="display: inline-block; margin-top: 4px; font-size: 10px; background: #ebebeb; color: #555; border-radius: 4px; padding: 2px 6px;">pages_parchment_%d</span>
                                                        <p style="color: #d44000; font-size: 13px; margin-top: 6px; margin-bottom: 0;">⚑</p>
                                                    </div>
                                                </div>
                                                <div style="padding: 32px 56px;">
                                                    <p style="text-align: center; font-size: 12px; font-weight: 600; color: #999; letter-spacing: 0.2px; margin: 0 0 4px 0;">pages_parchment_%d</p>
                                                    <p style="text-align: center; font-size: 22px; color: #bbb; font-weight: 300; margin: 0 0 16px 0;">Pages &amp; Parchment %d</p>
                                                    <h1 style="text-align: center; font-size: 18px; font-weight: 700; color: #1d1d1f; margin: 0 0 20px 0;">Password reset successful</h1>
                                                    <h2 style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 10px 0;">Your passage has been restored</h2>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">Dearest <strong>%s</strong>,</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">The procedure to create a new password has been completed. Your passage has been restored. You may now sign in with your new key.</p>
                                                    <p style="text-align: center; font-size: 13px; color: #999; font-style: italic; margin-top: 10px;">Welcome back to the fellowship</p>
                                                </div>
                                                <div style="background: #f0f0f0; border-top: 1px solid #e0e0e0; padding: 20px 56px;">
                                                    <p style="font-size: 12px; color: #999; margin: 0 0 2px 0;">Email brought to you by</p>
                                                    <p style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 12px 0;">Pages &amp; Parchment</p>
                                                    <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0 0 2px 0;">Didn't make this change? *</p>
                                                    <p style="font-size: 13px; color: #666; margin: 0 0 12px 0;">Contact support immediately at help@pagesparchment.com</p>
                                                    <p style="font-size: 11px; color: #999; line-height: 1.5; margin: 0;">*If you didn't just reset your password, please contact our support team right away to secure your account.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    """,
                            LocalDate.now().getYear(), new Date().getTime(), LocalDate.now().getYear(), LocalDate.now().getYear(), LocalDate.now().getYear(), user.getUsername()
                    )
            );
            us.sendNotification(message);
            return ResponseEntity.ok(Map.of("message", "Password successfully reset!"));
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //login
    @PostMapping("/login")
    public ResponseEntity<?> Login(@RequestBody LoginDTO user) {
        try {
            if (us.authenticate(user)) {

                if (!us.isVerified(user.getEmail())) {
                    er.setMessage("Unauthorised: Please verify your email");
                    er.setStatus(HttpStatus.BAD_GATEWAY.value());
                    return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(er);
                }

                if (!us.isActive(user.getEmail())) {
                    er.setMessage("Your have unsubscribed from this service. :(");
                    er.setStatus(HttpStatus.BAD_GATEWAY.value());
                    return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(er);
                }

                User found_user = us.getUserByEmail(user.getEmail());
                String jwtToken = js.generateTokenWithUserDetails(found_user);
                LoginResponse lr = new LoginResponse(jwtToken, js.getExpirationTime());
                return ResponseEntity.ok(lr);
            } else {
                er.setMessage("Invalid Credentials: Please enter the correct credentials");
                er.setStatus(HttpStatus.UNAUTHORIZED.value());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(er);
            }
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //update user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User user) {
        try {
            User updatedUser = us.updateUser(id, user);
            Notification message = new Notification(
                    1,
                    "Pages ń Parchment Account Details Alteration",
                    "Pages ń Parchment",
                    updatedUser.getId(),
                    "Account Details Update",
                    String.format("""
                                    <div style="display: flex; flex-direction: column; background: #f5f5f5; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                                        <div style="padding: 16px 16px 40px 16px;">
                                            <div style="background: white; border: 1px solid #d4d4d4; border-radius: 10px; overflow: hidden; width: 80%%; margin: 5rem auto;">
                                                <div style="display: flex; gap: 12px; align-items: flex-start; padding: 14px 20px; border-bottom: 1px solid #ececec;">
                                                    <div style="width: 34px; height: 34px; border-radius: 50%%; background: #b0b0b0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: white; flex-shrink: 0; margin-top: 2px;">pP</div>
                                                    <div style="flex: 1; min-width: 0;">
                                                        <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0;">Pages &amp; Parchment <span style="color: #888; font-weight: normal;">&lt;noreply@pagesparchment.com&gt;</span></p>
                                                        <p style="font-size: 12px; color: #555; margin: 4px 0 0 0;">Pages &amp; Parchment %d: Account details updated</p>
                                                        <p style="font-size: 11px; color: #999; margin: 4px 0 0 0;">Reply-To: Pages &amp; Parchment — help@pagesparchment.com</p>
                                                    </div>
                                                    <div style="text-align: right; flex-shrink: 0;">
                                                        <p style="font-size: 11px; color: #888; white-space: nowrap; margin: 0;">Inbox · Announcement &nbsp; %s</p>
                                                        <span style="display: inline-block; margin-top: 4px; font-size: 10px; background: #ebebeb; color: #555; border-radius: 4px; padding: 2px 6px;">pages_parchment_%d</span>
                                                        <p style="color: #d44000; font-size: 13px; margin-top: 6px; margin-bottom: 0;">⚑</p>
                                                    </div>
                                                </div>
                                                <div style="padding: 32px 56px;">
                                                    <p style="text-align: center; font-size: 12px; font-weight: 600; color: #999; letter-spacing: 0.2px; margin: 0 0 4px 0;">pages_parchment_%d</p>
                                                    <p style="text-align: center; font-size: 22px; color: #bbb; font-weight: 300; margin: 0 0 16px 0;">Pages &amp; Parchment %d</p>
                                                    <h1 style="text-align: center; font-size: 18px; font-weight: 700; color: #1d1d1f; margin: 0 0 20px 0;">Account details updated</h1>
                                                    <h2 style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 10px 0;">Your profile has been changed</h2>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">Dearest <strong>%s</strong>,</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">Your account details have been successfully updated. If you made these changes, no further action is needed.</p>
                                                    <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">However, if you did not authorize these changes, please contact our support team immediately to secure your account.</p>
                                                    <p style="text-align: center; font-size: 13px; color: #999; font-style: italic; margin-top: 10px;">Keep your account safe</p>
                                                </div>
                                                <div style="background: #f0f0f0; border-top: 1px solid #e0e0e0; padding: 20px 56px;">
                                                    <p style="font-size: 12px; color: #999; margin: 0 0 2px 0;">Email brought to you by</p>
                                                    <p style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 12px 0;">Pages &amp; Parchment</p>
                                                    <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0 0 2px 0;">Didn't make these changes? *</p>
                                                    <p style="font-size: 13px; color: #666; margin: 0 0 12px 0;">Contact support immediately at help@pagesparchment.com</p>
                                                    <p style="font-size: 11px; color: #999; line-height: 1.5; margin: 0;">*If you didn't just update your account details, please reach out to our support team right away to review your account activity.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    """,
                            LocalDateTime.now().getYear(), new Date().getTime(), LocalDateTime.now().getYear(), LocalDateTime.now().getYear(), LocalDateTime.now().getYear(), updatedUser.getUsername()
                    )
            );
            us.sendNotification(message);
            return ResponseEntity.ok(Map.of(
                    "message", "User successfully updated!",
                    "user", updatedUser
            ));
        } catch (RuntimeException e) {
            er.setMessage("400 error: " + e.getMessage());
            er.setStatus(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //deactivate user
    @PutMapping("/deactivate/{id}")
    public ResponseEntity<?> deactivateUser(@PathVariable String id) {
        try {
            User user = us.getUserById(id);
            if (user != null) {
                us.deactivateUser(id);
                return ResponseEntity.ok(Map.of("message", "Fair well, Dearest Gentle reader."));
            } else {
                return new ResponseEntity<>("Failed to deactivate", HttpStatus.EXPECTATION_FAILED);
            }
        } catch (RuntimeException e) {
            er.setMessage("404 error: " + e.getMessage());
            er.setStatus(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //activate user
    @PutMapping("/activate/{token}")
    public ResponseEntity<?> activateUser(@PathVariable String token) {
        String email = ts.validateVerificationToken(token);
        if (email == null) {
            er.setMessage("401 error: Invalid or expired Token");
            er.setStatus(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(er);
        }
        try {
            User user = us.getUserByEmail(email);
            if (user != null) {
                us.activateUser(user.getId());
                Notification notification = new Notification(
                        1,
                        "Pages & Parchment",
                        user.getId(),
                        "Resubscription",
                        String.format("""
                                        <div style="display: flex; flex-direction: column; background: #f5f5f5; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                                            <div style="padding: 16px 16px 40px 16px;">
                                                <div style="background: white; border: 1px solid #d4d4d4; border-radius: 10px; overflow: hidden; width: 80%%; margin: 5rem auto;">
                                                    <div style="display: flex; gap: 12px; align-items: flex-start; padding: 14px 20px; border-bottom: 1px solid #ececec;">
                                                        <div style="width: 34px; height: 34px; border-radius: 50%%; background: #b0b0b0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: white; flex-shrink: 0; margin-top: 2px;">pP</div>
                                                        <div style="flex: 1; min-width: 0;">
                                                            <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0;">Pages &amp; Parchment <span style="color: #888; font-weight: normal;">&lt;noreply@pagesparchment.com&gt;</span></p>
                                                            <p style="font-size: 12px; color: #555; margin: 4px 0 0 0;">Pages &amp; Parchment %d: Resubscription instructions sent</p>
                                                            <p style="font-size: 11px; color: #999; margin: 4px 0 0 0;">Reply-To: Pages &amp; Parchment — help@pagesparchment.com</p>
                                                        </div>
                                                        <div style="text-align: right; flex-shrink: 0;">
                                                            <p style="font-size: 11px; color: #888; white-space: nowrap; margin: 0;">Inbox · Announcement &nbsp; %s</p>
                                                            <span style="display: inline-block; margin-top: 4px; font-size: 10px; background: #ebebeb; color: #555; border-radius: 4px; padding: 2px 6px;">pages_parchment_%d</span>
                                                            <p style="color: #d44000; font-size: 13px; margin-top: 6px; margin-bottom: 0;">⚑</p>
                                                        </div>
                                                    </div>
                                                    <div style="padding: 32px 56px;">
                                                        <p style="text-align: center; font-size: 12px; font-weight: 600; color: #999; letter-spacing: 0.2px; margin: 0 0 4px 0;">pages_parchment_%d</p>
                                                        <p style="text-align: center; font-size: 22px; color: #bbb; font-weight: 300; margin: 0 0 16px 0;">Pages &amp; Parchment %d</p>
                                                        <h1 style="text-align: center; font-size: 18px; font-weight: 700; color: #1d1d1f; margin: 0 0 20px 0;">Resubscription instructions sent</h1>
                                                        <h2 style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 10px 0;">A letter to renew your fellowship</h2>
                                                        <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">Dearest <strong>%s</strong>,</p>
                                                        <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">A letter to renew your fellowship has been sent to your email. Please check your inbox for the next steps to rejoin our quiet community of readers.</p>
                                                        <p style="font-size: 15px; line-height: 1.65; color: #1d1d1f; margin: 0 0 20px 0;">The link will remain active for <strong>15 minutes</strong>. The shelves have been waiting for your return.</p>
                                                        <p style="text-align: center; font-size: 13px; color: #999; font-style: italic; margin-top: 10px;">We look forward to having you back</p>
                                                    </div>
                                                    <div style="background: #f0f0f0; border-top: 1px solid #e0e0e0; padding: 20px 56px;">
                                                        <p style="font-size: 12px; color: #999; margin: 0 0 2px 0;">Email brought to you by</p>
                                                        <p style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 12px 0;">Pages &amp; Parchment</p>
                                                        <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0 0 2px 0;">Didn't receive the email? *</p>
                                                        <p style="font-size: 13px; color: #666; margin: 0 0 12px 0;">Contact support at help@pagesparchment.com</p>
                                                        <p style="font-size: 11px; color: #999; line-height: 1.5; margin: 0;">*Please check your spam folder. If you still don't see it, contact our support team and we'll help you resubscribe.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        """,
                                LocalDate.now().getYear(), new Date().getTime(), LocalDate.now().getYear(), LocalDate.now().getYear(), LocalDate.now().getYear(), user.getUsername()
                        )
                );
                us.sendNotification(notification);
                return ResponseEntity.ok(Map.of("message", "User has been activated", "active", true));
            } else {
                return new ResponseEntity<>("Failed to resubscribe", HttpStatus.EXPECTATION_FAILED);
            }
        } catch (RuntimeException e) {
            er.setMessage("404 error: " + e.getMessage());
            er.setStatus(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //delete user
    @DeleteMapping("/delete/{id}")  // HANDLES HTTP DELETE REQUESTS
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            us.deleteUser(id);
            return ResponseEntity.noContent().build();  // HTTP 204: NO CONTENT (SUCCESSFUL DELETE)
        } catch (RuntimeException e) {
            er.setMessage("404 error: " + e.getMessage());
            er.setStatus(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: " + e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);  // HTTP 500
        }
    }
}