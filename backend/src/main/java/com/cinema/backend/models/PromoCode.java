package com.cinema.backend.models;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "promo_codes")
public class PromoCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code; // e.g., "SAVE10", "MOVIE50"

    @Column(nullable = false)
    private String discountType; // PERCENTAGE, FIXED_AMOUNT

    @Column(nullable = false)
    private double discountValue; // 10 for 10% or $10

    @Temporal(TemporalType.TIMESTAMP)
    private Date expiryDate; // When promo code expires

    @Column(nullable = false)
    private int usageLimit; // Maximum number of times it can be used (0 = unlimited)

    @Column(nullable = false)
    private int usedCount = 0; // How many times it has been used

    @Column(nullable = false)
    private boolean active = true; // Whether promo code is currently active

    private String description; // Description of the promo

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }

    // Constructors
    public PromoCode() {
    }

    public PromoCode(String code, String discountType, double discountValue, Date expiryDate, int usageLimit,
            String description) {
        this.code = code;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.expiryDate = expiryDate;
        this.usageLimit = usageLimit;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    public double getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(double discountValue) {
        this.discountValue = discountValue;
    }

    public Date getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }

    public int getUsageLimit() {
        return usageLimit;
    }

    public void setUsageLimit(int usageLimit) {
        this.usageLimit = usageLimit;
    }

    public int getUsedCount() {
        return usedCount;
    }

    public void setUsedCount(int usedCount) {
        this.usedCount = usedCount;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    // Helper methods
    public boolean isValid() {
        // Check if promo code is active
        if (!active) {
            return false;
        }

        // Check if expired
        if (expiryDate != null && new Date().after(expiryDate)) {
            return false;
        }

        // Check if usage limit exceeded (0 means unlimited)
        if (usageLimit > 0 && usedCount >= usageLimit) {
            return false;
        }

        return true;
    }

    public void incrementUsage() {
        this.usedCount++;
    }

    @Override
    public String toString() {
        return "PromoCode{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", discountType='" + discountType + '\'' +
                ", discountValue=" + discountValue +
                ", expiryDate=" + expiryDate +
                ", usageLimit=" + usageLimit +
                ", usedCount=" + usedCount +
                ", active=" + active +
                ", description='" + description + '\'' +
                '}';
    }
}
