package com.ana.bookapi.service;

/* =================== config =================== */
import com.ana.bookapi.config.EncodeConfig;

/* =================== MODELS =================== */
import com.ana.bookapi.models.User;
import com.ana.bookapi.DTO.LoginDTO;

/* =================== repo =================== */
import com.ana.bookapi.repository.userRepo;

/* =================== PACKAGES =================== */
import jakarta.annotation.PostConstruct;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service; // telling spring boot to treat this class as a service

import java.util.List;
import java.util.Optional;

@Service
public class userService implements UserDetailsService {
    //@Autowired private userRepo ur; // field injection
    //@Autowired private PasswordEncoder passwordEncoder; // field inection

    //constructor injection
    private final userRepo ur;
    private final EncodeConfig ec;

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
            EncodeConfig ec) {
        this.ec = ec;
        this.ur = ur;
    }

    @PostConstruct // runs when spring boot starts - creates the table in the DB
    public void initDB() {
        System.out.println("=== USER TABLE CREATION ===");
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
        User existinguser = ur.findById(id).orElseThrow(() -> new RuntimeException("User not found")); // find the existing user

        //change the attributes...

        //username
        // if the username of the user changed and the new username does not exist in the DB
        if (!existinguser.getUsername().equals(user.getUsername()) && !ur.existsByUsername(user.getUsername())) {
            existinguser.setUsername(user.getUsername());
        }else{
            throw new RuntimeException("Could not change username. Please try again. We apologise for the inconvenience.");
        }

        //email
        if (!existinguser.getEmail().equals(user.getEmail()) && !ur.existsByEmail(user.getEmail())) {
            existinguser.setEmail(user.getEmail());
        }else{
            throw new RuntimeException("Could not change email. Please try again later. We apologise for the inconvenience.");
        }

        //phone
        if (!existinguser.getCellphone().equals(user.getCellphone())) {
            existinguser.setCellphone(user.getCellphone());
        }else{throw new RuntimeException("Could not change cellphone number. Please try again later. We apologise for the inconvenience.");}

        //bio
        if (!existinguser.getBio().equals(user.getBio())) {existinguser.setBio(user.getBio());}

        //profile photo
        if (!existinguser.getProfilePhoto().equals(user.getProfilePhoto())) {existinguser.setProfilePhoto(user.getProfilePhoto());}
        return ur.save(existinguser);
    }

    //delete user - hard delete
    public void deleteUser(String id) {
        if (!ur.existsById(id)) {throw new RuntimeException("User not found");}
        ur.deleteById(id);
    }

    //delete user - soft delete
    public void deactivateUser(String id) {
        User existinguser = ur.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (!ur.existsById(id)) {throw new RuntimeException("User not found");}
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
        if (!ur.existsById(id)) {throw new RuntimeException("User not found");}
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
    public Boolean authenticate(LoginDTO dto){
        Boolean isAuthenticated = false;
        User user = getUserByEmail(dto.getEmail());
        if (user.getEmail().equals(dto.getEmail()) && ec.matcher(dto.getPassword(), user.getPassword())) {
            isAuthenticated = true;
        }
        return isAuthenticated;
    }

    public Boolean isVerified(String email) {
        User user = getUserByEmail(email);
        if (!user.getVerfied()){return false;}
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

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = ur.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
        return user;
    }
}
