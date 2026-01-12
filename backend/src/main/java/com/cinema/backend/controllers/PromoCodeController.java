package com.cinema.backend.controllers;

import com.cinema.backend.models.PromoCode;
import com.cinema.backend.repositories.PromoCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/promo-code")
public class PromoCodeController {

    @Autowired
    private PromoCodeRepository promoCodeRepository;

    /**
     * UC-19: Validate promo code
     * Checks if promo code exists, is active, not expired, and has usage remaining
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validatePromoCode(@RequestBody Map<String, String> request) {
        try {
            String code = request.get("code");

            if (code == null || code.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "valid", false,
                                "message", "Promo code is required"));
            }

            // Find promo code (case-insensitive)
            Optional<PromoCode> promoOptional = promoCodeRepository.findByCode(code.toUpperCase());

            if (!promoOptional.isPresent()) {
                return ResponseEntity.ok()
                        .body(Map.of(
                                "valid", false,
                                "message", "Invalid promo code"));
            }

            PromoCode promo = promoOptional.get();

            // Check if active
            if (!promo.isActive()) {
                return ResponseEntity.ok()
                        .body(Map.of(
                                "valid", false,
                                "message", "This promo code is no longer active"));
            }

            // Check if expired
            if (promo.getExpiryDate() != null && new Date().after(promo.getExpiryDate())) {
                return ResponseEntity.ok()
                        .body(Map.of(
                                "valid", false,
                                "message", "This promo code has expired"));
            }

            // Check usage limit
            if (promo.getUsageLimit() > 0 && promo.getUsedCount() >= promo.getUsageLimit()) {
                return ResponseEntity.ok()
                        .body(Map.of(
                                "valid", false,
                                "message", "This promo code has reached its usage limit"));
            }

            // Promo code is valid
            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("message", "Promo code applied successfully!");
            response.put("promoCode", Map.of(
                    "code", promo.getCode(),
                    "discountType", promo.getDiscountType(),
                    "discountValue", promo.getDiscountValue(),
                    "description", promo.getDescription() != null ? promo.getDescription() : ""));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "valid", false,
                            "message", "Error validating promo code: " + e.getMessage()));
        }
    }

    /**
     * Get promo code details by code (for admin/testing)
     */
    @GetMapping("/{code}")
    public ResponseEntity<?> getPromoCode(@PathVariable String code) {
        Optional<PromoCode> promoOptional = promoCodeRepository.findByCode(code.toUpperCase());

        if (!promoOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Promo code not found"));
        }

        PromoCode promo = promoOptional.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id", promo.getId());
        response.put("code", promo.getCode());
        response.put("discountType", promo.getDiscountType());
        response.put("discountValue", promo.getDiscountValue());
        response.put("expiryDate", promo.getExpiryDate());
        response.put("usageLimit", promo.getUsageLimit());
        response.put("usedCount", promo.getUsedCount());
        response.put("active", promo.isActive());
        response.put("description", promo.getDescription());
        response.put("isValid", promo.isValid());

        return ResponseEntity.ok(response);
    }

    /**
     * Create a new promo code (for admin/testing)
     */
    @PostMapping
    public ResponseEntity<?> createPromoCode(@RequestBody PromoCode promoCode) {
        try {
            // Convert code to uppercase
            promoCode.setCode(promoCode.getCode().toUpperCase());

            // Check if code already exists
            Optional<PromoCode> existing = promoCodeRepository.findByCode(promoCode.getCode());
            if (existing.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Promo code already exists"));
            }

            PromoCode saved = promoCodeRepository.save(promoCode);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "Promo code created successfully",
                            "promoCode", saved));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create promo code: " + e.getMessage()));
        }
    }
}
