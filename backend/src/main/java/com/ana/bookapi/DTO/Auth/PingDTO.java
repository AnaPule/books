package com.ana.bookapi.DTO.Auth;
import java.util.Date;

public class PingDTO {

    private String id;
    private Integer type;
    private String title;
    private String preview;
    private String message;
    private Date timestamp;
    private Boolean read;
    private String recipient; // Id
    private From from;
    private MetaData meta;

    // Inner class for From
    public static class From {
        private String id;
        private String username;
        private String profilePhoto;

        // Default constructor
        public From() {}

        // All-args constructor
        public From(String id, String username, String profilePhoto) {
            this.id = id;
            this.username = username;
            this.profilePhoto = profilePhoto;
        }

        // Getters and Setters
        public String getId() {return id;}
        public void setId(String id) {this.id = id;}

        public String getUsername() {return username;}
        public void setUsername(String username) {this.username = username;}

        public String getProfilePhoto() {return profilePhoto;}
        public void setProfilePhoto(String profilePhoto) {this.profilePhoto = profilePhoto;}
    }

    // inner class room meta data
    public static class MetaData{
        private String roomId;
        private String roomName;
        private String bookId;
        private String bookName;

        public MetaData(String roomId, String roomName, String bookId, String bookName) {
            this.roomId = roomId;
            this.roomName = roomName;
            this.bookId = bookId;
            this.bookName = bookName;
        }

        public String getRoomId() {return roomId;}
        public void setRoomId(String roomId) {this.roomId = roomId;}

        public String getRoomName() {return roomName;}
        public void setRoomName(String roomName) {this.roomName = roomName;}

        public String getBookId() {return bookId;}
        public void setBookId(String bookId) {this.bookId = bookId;}

        public String getBookName() {return bookName;}
        public void setBookName(String bookName) {this.bookName = bookName;}
    }

    // Default constructor
    public PingDTO() {}

    // All-args constructor
    public PingDTO(String id, Integer type, String title, String preview, String message,
                   Date timestamp, Boolean read, From from) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.preview = preview;
        this.message = message;
        this.timestamp = timestamp;
        this.read = read;
        this.from = from;
    }

    //if interaction from room
    public PingDTO(String id, Integer type, String title, String preview, String message,
                   Date timestamp, Boolean read, From from, MetaData meta) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.preview = preview;
        this.message = message;
        this.timestamp = timestamp;
        this.read = read;
        this.from = from;
        this.meta = meta;
    }

    // Getters and Setters
    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public Integer getType() {return type;}
    public void setType(Integer type) {this.type = type;}

    public String getTitle() {return title;}
    public void setTitle(String title) {this.title = title;}

    public String getMessage() {return message;}
    public void setMessage(String message) {this.message = message;}

    public Date getTimestamp() {return timestamp;}
    public void setTimestamp(Date timestamp) {this.timestamp = timestamp;}

    public Boolean getRead() {return read;}
    public void setRead(Boolean read) {this.read = read;}

    public String getPreview() {return preview;}
    public void setPreview(String preview) {this.preview = preview;}

    public From getFrom() {return from;}
    public void setFrom(From from) {this.from = from;}

    public MetaData getMeta() {return meta;}
    public void setMeta(MetaData meta) {this.meta = meta;}

    public String getRecipient() {return recipient;}
    public void setRecipient(String recipient) {this.recipient = recipient;}
}

