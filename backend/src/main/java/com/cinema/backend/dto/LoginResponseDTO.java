package com.cinema.backend.dto;

public class LoginResponseDTO {

    private String message;
    private String userName;
    private Long userId;
    private String genres;
    private String favorites;

    public LoginResponseDTO(String message, String userName, Long userId, String genres, String favorites) {
        this.message = message;
        this.userName = userName;
        this.userId = userId;
        this.genres = genres;
        this.favorites = favorites;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getGenres() {
        return genres;
    }

    public void setGenres(String genres) {
        this.genres = genres;
    }

    public String getFavorites() {
        return favorites;
    }

    public void setFavorites(String favorites) {
        this.favorites = favorites;
    }
}
