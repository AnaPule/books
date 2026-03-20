package com.ana.bookapi.controller;

/* =================== models =================== */

import com.ana.bookapi.DTO.*;
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
import java.time.LocalDateTime;
import java.util.*;

import org.apache.logging.log4j.Logger;
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
            userBook ub = us.AddBookTouserBook(dto.getUserId(), dto.getBookId(), dto.getType());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Book added successfully",
                    "userBook", ub,
                    "added", true
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

    @DeleteMapping("/{userId}/books/{bookId}")
    public ResponseEntity<?> removeUserBook(@PathVariable String userId, @PathVariable String bookId, @RequestParam Integer type) {
        try {
            us.RemoveBookFromUserBook(userId, bookId, type);
            return ResponseEntity.ok(Map.of(
                    "message", "Book removed successfully"
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

            Map<String, Object> response = new HashMap<>();
            response.put("user", user);

            return ResponseEntity.ok().body(response);
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
            return ResponseEntity.status(HttpStatus.CREATED).body("Your verification Email has been sent!");
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
            return ResponseEntity.ok(Map.of(
                    "verified", verified,
                    "message", "Email verified successfully!"
            ));
        } catch (Exception e) {
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