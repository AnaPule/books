package com.ana.bookapi.service.auth;

/* =================== config =================== */

import com.ana.bookapi.config.EncodeConfig;

/* =================== MODELS =================== */
import com.ana.bookapi.DTO.Auth.LoginDTO;
import com.ana.bookapi.DTO.userBookDTO;
import com.ana.bookapi.models.book.Book;
import com.ana.bookapi.models.user.Notification;
import com.ana.bookapi.models.user.User;
import com.ana.bookapi.models.user.UserWord;
import com.ana.bookapi.models.user.UserQuote;
import com.ana.bookapi.models.book.userBook;

/* =================== repo =================== */
import com.ana.bookapi.repository.BookRepo;
import com.ana.bookapi.repository.UserBookRepo;
import com.ana.bookapi.repository.auth.NotificationRepo;
import com.ana.bookapi.repository.auth.userRepo;
import com.ana.bookapi.repository.auth.userWordRepo;
import com.ana.bookapi.repository.auth.UserQuoteRepo;

/* =================== PACKAGES =================== */
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service; // telling spring boot to treat this class as a service

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.ana.bookapi.repository.auth.userWordRepo.now;

@Service
public class userService implements UserDetailsService {
    //@Autowired private userRepo ur; // field injection
    //@Autowired private PasswordEncoder passwordEncoder; // field inection

    //constructor injection
    private final userRepo ur;
    private final BookRepo br;
    private final EncodeConfig ec;
    private final UserBookRepo urb;
    private final userWordRepo urw;
    private final UserQuoteRepo uqr;
    private final NotificationRepo nr;

    // constructor injection vs. field injection
    /*
    With field injection, Spring tries to create both beans simultaneously and they keep waiting for each other.

    With constructor injection:
        1.Spring sees userService needs PasswordEncoder
        2.Spring creates PasswordEncoder bean first (from SecurityConfig)
        3.Spring creates userService using that PasswordEncoder
        4.Spring creates SecurityConfig using the fully-built userService

        Best Practice: Always use constructor injection unless you have a specific reason not to
    */
    public userService(
            userRepo ur,
            BookRepo br,
            EncodeConfig ec,
            UserBookRepo urp,
            userWordRepo urw,
            UserQuoteRepo uqr,
            NotificationRepo nr) {
        this.ec = ec;
        this.br = br;
        this.ur = ur;
        this.nr =  nr;
        this.urb = urp;
        this.urw = urw;
        this.uqr = uqr;
    }

    @PostConstruct // runs when spring boot starts - creates the table in the DB
    public void initDB() {
        System.out.println("=== USER TABLE CREATION ===");
    }

    // user library
    public userBook AddBookTouserBook(String userId, String bookId, Integer type) {
        if (!br.existsById(bookId) || urb.existsByBookIdAndUserIdAndType(userId, bookId, type)) {
            throw new RuntimeException("Book already exists in user's collection or book no exist");

        }
        userBook ub = new userBook(userId, bookId, type);
        return urb.save(ub);
    }

    //remove book from library
    @Transactional
    public void RemoveBookFromUserBook(String userId, String bookId, Integer type) {
        if (!urb.existsByBookIdAndUserIdAndType(userId, bookId, type)) {
            throw new RuntimeException("Book does not exist");
        }
        urb.deleteByUserIdAndBookIdAndType(userId, bookId, type);
    }

    public List<userBookDTO> getUserBooks(String userId) {
        try {
            List<userBook> ubs = urb.findByUserId(userId);

            List<userBookDTO> books = new ArrayList<>();

            for (userBook ub : ubs) {
                //check if book exists
                if (br.existsById(ub.getBookId())) {
                    Book book = br.findByBookId(ub.getBookId()).orElseThrow(() -> new RuntimeException("Book not found"));
                    userBookDTO bookDTO = new userBookDTO(book, ub.getType());
                    books.add(bookDTO);
                }
            }
            return books;
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve user books: " + e);
        }

    }

    public List<userBookDTO> getUserBooksByType(String userId, Integer type) {
        try {
            List<userBook> ubs = urb.findByUserIdAndType(userId, type);

            List<userBookDTO> books = new ArrayList<>();
            for (userBook ub : ubs) {
                if (br.existsById(ub.getBookId())) {
                    Book book = br.findById(ub.getBookId()).orElseThrow(() -> new RuntimeException("Book not found"));
                    userBookDTO bookDTO = new userBookDTO(book, ub.getType());
                    books.add(bookDTO);
                }
            }
            return books;
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve user books by type: " + e);
        }
    }

    public boolean checkUserBookExists(String userId, String bookId, Integer type) {
        return urb.existsByBookIdAndUserIdAndType(userId, bookId, type);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = ur.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
        return user;
    }

    //register user
    public User createUser(User user) {
        if (ur.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (ur.existsByEmail(user.getEmail())) {
            throw new RuntimeException("This email has already been used for an account. Please login.");
        }

        user.setPassword(ec.encoder(user.getPassword()));
        return ur.save(user); //SQL: INSERT INTO users ...
    }

    //update user
    public User updateUser(String id, User user) {
        User existinguser = ur.findById(id).orElseThrow(() -> new RuntimeException("User not found"));


        if (!existinguser.getUsername().equals(user.getUsername())) {
            if (ur.existsByUsername(user.getUsername())) {
                throw new RuntimeException("Username already taken");
            }
            existinguser.setUsername(user.getUsername());
        }

        if (!existinguser.getEmail().equals(user.getEmail())) {
            if (ur.existsByEmail(user.getEmail())) {
                throw new RuntimeException("Email already in use");
            }
            existinguser.setVerfied(false);
            existinguser.setEmail(user.getEmail());
        }


        if (user.getCellphone() != null && !user.getCellphone().equals(existinguser.getCellphone())) {
            existinguser.setCellphone(user.getCellphone());
        }


        if (user.getBio() != null && !user.getBio().equals(existinguser.getBio())) {
            existinguser.setBio(user.getBio());
        }


        if (user.getProfilePhoto() != null && !user.getProfilePhoto().equals(existinguser.getProfilePhoto())) {
            existinguser.setProfilePhoto(user.getProfilePhoto());
        }

        return ur.save(existinguser);
    }

    //delete user - hard delete
    public void deleteUser(String id) {
        if (!ur.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        ur.deleteById(id);
    }

    //delete user - soft delete
    public void deactivateUser(String id) {
        User existinguser = ur.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (!ur.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        existinguser.setActive(false);
        ur.save(existinguser);
    }

    //activate user
    public void activateUser(String id) {
        User existinguser = ur.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        existinguser.setActive(true);
        ur.save(existinguser);
    }

    // verify user
    public Boolean verifyUser(String id) {
        User existinguser = ur.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (!ur.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        existinguser.setVerfied(true);
        ur.save(existinguser);
        return existinguser.getVerfied();
    }

    //forgot password
    public String ResetPassword(String email, String rawpassword) {
        User existinguser = ur.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        existinguser.setPassword(ec.encoder(rawpassword));
        ur.save(existinguser);
        return "Your password has been updated. Please login";
    }

    //check user password and username for login
    public Boolean authenticate(LoginDTO dto) {
        Boolean isAuthenticated = false;
        User user = getUserByEmail(dto.getEmail());
        if (user.getEmail().equals(dto.getEmail()) && ec.matcher(dto.getPassword(), user.getPassword())) {
            isAuthenticated = true;
        }
        return isAuthenticated;
    }

    public Boolean isVerified(String email) {
        User user = getUserByEmail(email);
        if (!user.getVerfied()) {
            return false;
        }
        return true;
    }

    public Boolean isActive(String email) {
        User user = getUserByEmail(email);
        if (!user.getActive()) {
            return false;
        }
        return true;
    }

    //get users
    public List<User> getUsers() {
        return ur.findAll();
    }

    public User getUserById(String id) {
        //Optional<> -> JAVA FEATURE THAT PREVENTS NullPointerException
        User user = ur.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return user;
    }

    public User getUserByUsername(String username) {
        User user = ur.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        return user;
    }

    public User getUserByEmail(String email) {
        User user = ur.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return user;
    }

    private UserWord getUserWord(LocalDateTime date, String userId) {
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = now.toLocalDate().atTime(23, 59, 59);
        UserWord uw = urw.findByDateAndUserId(startOfDay, endOfDay, userId).orElseThrow(() -> new RuntimeException("User not found"));
        return uw;
    }

    //set user word of the day
    public void setUserWord(String word, String userId) {
        if (ur.existsById(userId)) {
            UserWord uw = new UserWord();
            uw.setWord(word);
            uw.setUserId(userId);
            urw.save(uw);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    //get user word of the day
    public UserWord getUserWord(String userId, LocalDateTime date) {
        if (ur.existsById(userId)) {
            UserWord uw = getUserWord(date, userId);
            return uw;
        } else {
            throw new RuntimeException("User not found");
        }
    }

    //check if user already has word already
    public Boolean wordCheck(String userId, LocalDateTime date) {
        return urw.existsByUserIdAndDate(userId, date);
    }

    // Check if user has quote for today
    public boolean quoteCheck(String userId, LocalDateTime date) {
        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = date.toLocalDate().atTime(23, 59, 59);
        return uqr.existsByUserIdAndDate(userId, date);
    }

    // Get user's quote for today
    public UserQuote getUserQuote(String userId, LocalDateTime date) {
        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = date.toLocalDate().atTime(23, 59, 59);

        if (ur.existsById(userId)) {
            return uqr.findByUserIdAndDate(userId, startOfDay, endOfDay)
                    .orElseThrow(() -> new RuntimeException("Quote not found for user on this date"));
        } else {
            System.err.println("Fetch Quote: User not found");
            throw new RuntimeException("User not found");
        }
    }

    // Save quote for user
    @Transactional
    public void setUserQuote(String userId, String quoteText, String quoteAuthor) {
        LocalDateTime date = LocalDateTime.now();

        if (quoteCheck(userId, date)) {
            System.out.println("Quote already exists for user on this date");
            throw new RuntimeException("Quote already exists for user on this date");
        }
        UserQuote quote = new UserQuote(userId, quoteText, quoteAuthor);
        uqr.save(quote);
    }

    // send user notification
    public Notification sendNotification(Notification message){
        if (!ur.existsById(message.getRecieveId())){
            throw new RuntimeException("User not found with recieveId: " + message.getRecieveId() + " - message no sent.");
        }

        return nr.save(message);
    }

    // get all user notifications
    public List<Notification> getUserNotifications(String userId) {
        if (!ur.existsById(userId)) {
            throw new RuntimeException("Get notifications: User not found: " + userId);
        }
        return nr.findAllToUser_Id(userId);
    }


}


