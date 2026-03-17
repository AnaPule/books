package com.ana.bookapi.models;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*; // JPA ANNOTATIONS FOR DB MAPPING
import org.hibernate.annotations.GenericGenerator;

/* =========== SECURITY IMPORTS ============ */
import org.springframework.security.core.GrantedAuthority; // required by Userdetails class that is being implemented
import org.springframework.security.core.userdetails.UserDetails; // allows integration of the User details model provided by java

@Entity
@Table(name = "\"user\"")// table name

public class User implements UserDetails {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    //auto generate uuid id -> makes my method obsolete
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(name = "username", unique = true, nullable = true, length = 50)
    private String username;

    @Column(name = "email", unique = true, nullable = false, length = 40)
    private String email;

    @Column(name = "cellphone", nullable = false, length = 10)
    private String cellphone;

    @Column(name = "bio", unique = false, nullable = true, length = 300)
    private String bio;

    @Column(name = "password", length = 255, nullable = false)
    private String password;

    @Column(name = "profile_photo", nullable = true)
    private String profilePhoto;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /* ============== VERIFICATION STUFFIES ================ */

    @Column(name = "verifiedEmail")
    private boolean verified = false;

    @Column(name = "active")
    private boolean active = true;

    //get and set methods
    public String getId() {return id;}

    public String getUsername() {return username;}
    public void setUsername(String username) {this.username = username;}

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    public String getCellphone() {return cellphone;}
    public void setCellphone(String cellphone) {this.cellphone = cellphone;}

    public String getPassword() {return password;}
    public void setPassword(String password) {this.password = password;}

    public String getBio() {return bio;}
    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }
    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public Boolean getVerfied() {return verified;}
    public void setVerfied(Boolean verified) {this.verified = verified;}

    public Boolean getActive() {return active;}
    public void setActive(Boolean active) {this.active = active;}
    //METHODS

    //default constructor
    public User(){}

    //custom constructor
    public User(String username, String email, String cellphone) {
        this.email = email;
        this.active = true;
        this.verified = false;
        this.username = username;
        this.cellphone = cellphone;
        this.createdAt = LocalDateTime.now();
        this.profilePhoto = generateDefaultProfilePhoto();
    }

    public String generateId() {
        UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }

    public String generateDefaultProfilePhoto() {
        return "https://i.pinimg.com/736x/13/74/20/137420f5b9c39bc911e472f5d20f053e.jpg";
    }

    // defaults by the user details claa being implemented...but we can ignore for now.
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(); // Return empty list for now
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Account never expires
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Account never locked
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credentials never expire
    }
}
