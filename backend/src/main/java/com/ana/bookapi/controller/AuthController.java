package com.ana.bookapi.controller;

/* =================== models =================== */
import com.ana.bookapi.DTO.LoginResponse;
import com.ana.bookapi.models.User;
import com.ana.bookapi.DTO.LoginDTO;
import com.ana.bookapi.DTO.errResponse;

/* =================== services =================== */
import com.ana.bookapi.service.JwtService;
import com.ana.bookapi.service.userService;

/* =================== PACKAGES =================== */
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import io.jsonwebtoken.Jwts;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/auth")

public class AuthController {
    //@Autowired private userService us;
    //@Autowired private errResponse er;
    //@Autowired private JwtService js;

    private errResponse er = new errResponse();
    private final userService us;
    private final JwtService js;
    private AuthController(userService us, JwtService js) {
        this.us = us;
        this.js = js;
    }

    @Value("${app.mode}")
    private String mode;

    // ==================== ENDPOINTS ========================= //
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try{
            List<User> user = us.getUsers();
            return ResponseEntity.ok(user);
        }catch(Exception e){
            er.setMessage(e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er); // 500 STATUS
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> AuthenticateUser(@RequestHeader(value = "Authorization", required = false)String header){
        // ============ PRODUCTION ============= //

        //check authorisation header
        if (header == null || !header.startsWith("Bearer ")) {
            er.setMessage("401 error: Invalid Token. Authorisation header missing or invalid");
            er.setStatus(HttpStatus.UNAUTHORIZED.value());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(er);
        }

        String token = header.substring(7); ///**Note: The actual token starts at position 7; "Bearer " = 7 characters
        try{
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
            response.put("user",user);

            return ResponseEntity.ok().body(response);
        }catch(Exception e){
            er.setMessage("401 error: "+e.getMessage());
            er.setStatus(HttpStatus.UNAUTHORIZED.value());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(er);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> GetUserById(@PathVariable String id) {
        try{
            User user = us.getUserById(id);
            if (user != null){
                return ResponseEntity.ok(user);
            }else{
                return ResponseEntity.notFound().build(); //404 STATUS
            }
        }catch(Exception e){
            er.setMessage(e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //register
    @PostMapping("/register")
    public ResponseEntity<?> Register(@RequestBody User user){
        try{
            User createdUser = us.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        }catch(RuntimeException e){
            er.setMessage("400 error: "+e.getMessage());
            er.setStatus(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
        }catch(Exception e){
            er.setMessage("500 error: "+e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //login
    @PostMapping("/login")
    public ResponseEntity<?> Login(@RequestBody LoginDTO user){
        try{
            if(us.authenticate(user)){
                User found_user = us.getUserByEmail(user.getEmail());
                String jwtToken = js.generateTokenWithUserDetails(found_user);
                LoginResponse lr = new LoginResponse(jwtToken, js.getExpirationTime());
                return ResponseEntity.ok(lr);
            }else{
                er.setMessage("Invalid Credentials: Please enter the correct credentials");
                er.setStatus(HttpStatus.UNAUTHORIZED.value());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(er);
            }
        }catch(Exception e){
            er.setMessage("500 error: "+e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //update user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User user){
        try{
            User updatedUser = us.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        }catch(RuntimeException e){
            er.setMessage("400 error: "+e.getMessage());
            er.setStatus(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
        }catch(Exception e){
            er.setMessage("500 error: "+e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //deactivate user
    @PutMapping("/deactivate/{id}")
    public ResponseEntity<?> deactivateUser(@PathVariable String id){
        try{
            User user = us.getUserById(id);
            if (user != null){
                us.deactivateUser(id);
                return ResponseEntity.ok("User has been deactivated");
            }else{
                return new ResponseEntity<>("Failed to deactivate", HttpStatus.EXPECTATION_FAILED);
            }
        } catch (RuntimeException e) {
            er.setMessage("404 error: "+e.getMessage());
            er.setStatus(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
        }catch(Exception e){
            er.setMessage("500 error: "+e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);
        }
    }

    //activate user
    @PutMapping("/activate/{id}")
    public ResponseEntity<?> activateUser(@PathVariable String id){
        try{
            User user = us.getUserById(id);
            if (user != null){
                us.activateUser(id);
                return ResponseEntity.ok("User has been activated");
            }else{
                return new ResponseEntity<>("Failed to activate", HttpStatus.EXPECTATION_FAILED);
            }
        } catch (RuntimeException e) {
            er.setMessage("404 error: "+e.getMessage());
            er.setStatus(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
        }catch(Exception e){
            er.setMessage("500 error: "+e.getMessage());
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
            er.setMessage("404 error: "+e.getMessage());
            er.setStatus(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
        } catch (Exception e) {
            er.setMessage("500 error: "+e.getMessage());
            er.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(er);  // HTTP 500
        }
    }
}