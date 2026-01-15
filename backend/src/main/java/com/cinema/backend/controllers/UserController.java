package com.cinema.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.backend.dto.LoginResponseDTO;
import com.cinema.backend.models.User;
import com.cinema.backend.services.UserService;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/api/v1/register")
    User newUser(@RequestBody User newUser) {
        System.out.println("Registering user: " + newUser.toString());
        return userService.registerUser(newUser);
    }

    @PostMapping("/api/v1/login")
    public ResponseEntity<LoginResponseDTO> loginUser(@RequestBody User loginRequest) {
        System.out.println("Email from Frontend: [" + loginRequest.getEmail() + "]");
        User user = userService.getUserByEmail(loginRequest.getEmail());

        if (user == null) {
            System.out.println("Result: User NOT found in database.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponseDTO("Invalid credentials", null, null, null, null));
        }
        boolean isMatch = userService.isPasswordMatch(loginRequest.getPassword(), user.getPassword());

        System.out.println("Password from Frontend: [" + loginRequest.getPassword() + "]");
        System.out.println("Password from Database: [" + user.getPassword() + "]");
        System.out.println("Match Result: " + isMatch);
        if (isMatch) {
            System.out.println("User Logged In. Saved Genres: " + user.getGenres());
            LoginResponseDTO response = new LoginResponseDTO("Login successful", user.getName(), user.getId(), user.getGenres(), user.getFavorites());
            return ResponseEntity.ok().body(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponseDTO("Invalid credentials", null, null, null, null));
        }
    }

    @GetMapping("/api/v1/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
    User user = userService.getUserById(id);
    if (user != null) {
        return ResponseEntity.ok(user);
    } else {
        return ResponseEntity.notFound().build();
    }
}

    @PutMapping("/api/v1/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        // Update fields
        if (userDetails.getName() != null) {
        user.setName(userDetails.getName());
        }
        if (userDetails.getSurname() != null) {
            user.setSurname(userDetails.getSurname());
        }
        if (userDetails.getEmail() != null) {
            user.setEmail(userDetails.getEmail());
        }
        if (userDetails.getGenres() != null) {
            user.setGenres(userDetails.getGenres());
        }
        if (userDetails.getFavorites() != null) {
            user.setFavorites(userDetails.getFavorites());
        }

        // Password Update & Validation
        String newPassword = userDetails.getPassword();
        if (newPassword != null && !newPassword.trim().isEmpty()) {
        
        // CHECK: If it starts with $2a$, it's already a hash from the database.
        // We do NOT want to update the password in this case.
        if (newPassword.startsWith("$2a$")) {
            System.out.println("Password is already hashed. Skipping re-hash.");
        } else {
            // It's a new plain-text password from the user
            if (newPassword.length() < 8) {
                return ResponseEntity.badRequest().body("Password must be at least 8 characters long.");
            }
            user.setPassword(newPassword); 
            System.out.println("New plain-text password set. Will be hashed by Service.");
        }
        }
        User updatedUser = userService.registerUser(user);
        return ResponseEntity.ok(updatedUser);
    }
}