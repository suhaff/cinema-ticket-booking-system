package com.cinema.backend.models;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String password;
    private String genres;

    @Column(columnDefinition = "TEXT") 
    private String favorites;

    @Transient
    private String loginEmail;

    @Transient
    private String loginPassword;

    public User() {
    }

    public User(Long id, String name, String surname, String email, String password, String genres, String favorites) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.genres = genres;
        this.favorites = favorites;
    }

    public User(String username, String encodedPassword) {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getLoginEmail() {
        return loginEmail;
    }

    public void setLoginEmail(String loginEmail) {
        this.loginEmail = loginEmail;
    }

    public String getLoginPassword() {
        return loginPassword;
    }

    public void setLoginPassword(String loginPassword) {
        this.loginPassword = loginPassword;
    }

    public String getGenres() {
        return genres;
    }

    public void setGenres(Object genres) {
    if (genres instanceof java.util.List) {
        this.genres = ((java.util.List<?>) genres).stream()
                .map(Object::toString)
                .collect(java.util.stream.Collectors.joining(","));
    } else {
        this.genres = (String) genres;
    }
    }

    public String getFavorites() {
    return favorites;
    }

    public void setFavorites(String favorites) {
    if (favorites != null) {
        this.favorites = favorites;
    }
}

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", surename='" + surname + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", genres='" + genres + '\'' +
                ", favorites='" + favorites + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) && Objects.equals(name, user.name) && Objects.equals(surname, user.surname) && Objects.equals(email, user.email) && Objects.equals(password, user.password) && Objects.equals(genres, user.genres) && Objects.equals(favorites, user.favorites);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, surname, email, password, genres, favorites);
    }


}
