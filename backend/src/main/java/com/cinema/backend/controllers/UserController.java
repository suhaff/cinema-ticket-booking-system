package com.cinema.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
        User user = userService.getUserByEmail(loginRequest.getEmail());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponseDTO("Invalid credentials", null, null, null));
        }

        if (userService.isPasswordMatch(loginRequest.getPassword(), user.getPassword())) {
            System.out.println("User Logged In. Saved Genres: " + user.getGenres());
            LoginResponseDTO response = new LoginResponseDTO("Login successful", user.getName(), user.getId(), user.getGenres());
            return ResponseEntity.ok().body(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponseDTO("Invalid credentials", null, null, null));
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
}