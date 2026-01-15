package com.cinema.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.cinema.backend.models.User;
import com.cinema.backend.repositories.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User newUser) {
    String currentPassword = newUser.getPassword();

    if (currentPassword != null && !currentPassword.startsWith("$2a$")) {
        String encodedPassword = passwordEncoder.encode(currentPassword);
        newUser.setPassword(encodedPassword);
    }
    
    return userRepository.save(newUser);
}

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean isPasswordMatch(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
