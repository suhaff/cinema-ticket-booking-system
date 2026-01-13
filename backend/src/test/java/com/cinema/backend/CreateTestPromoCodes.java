package com.cinema.backend;

import com.cinema.backend.models.PromoCode;
import com.cinema.backend.repositories.PromoCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Calendar;
import java.util.Date;

/**
 * Utility class to create test promo codes.
 * Run this once to populate the database with sample promo codes.
 */
public class CreateTestPromoCodes {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner createPromoCodes(PromoCodeRepository promoCodeRepository) {
        return args -> {
            // Check if promo codes already exist
            if (promoCodeRepository.count() > 0) {
                System.out.println("Promo codes already exist. Skipping creation.");
                return;
            }

            // Create PERCENTAGE discount promo codes
            PromoCode promo1 = new PromoCode();
            promo1.setCode("SAVE10");
            promo1.setDescription("10% off your booking");
            promo1.setDiscountType("PERCENTAGE");
            promo1.setDiscountValue(10.0);
            promo1.setExpiryDate(getDatePlusMonths(3));
            promo1.setUsageLimit(100);
            promo1.setUsedCount(0);
            promo1.setActive(true);

            PromoCode promo2 = new PromoCode();
            promo2.setCode("WELCOME20");
            promo2.setDescription("20% off for new customers");
            promo2.setDiscountType("PERCENTAGE");
            promo2.setDiscountValue(20.0);
            promo2.setExpiryDate(getDatePlusMonths(6));
            promo2.setUsageLimit(50);
            promo2.setUsedCount(0);
            promo2.setActive(true);

            // Create FIXED_AMOUNT discount promo codes
            PromoCode promo3 = new PromoCode();
            promo3.setCode("MOVIE5");
            promo3.setDescription("€5 off your booking");
            promo3.setDiscountType("FIXED_AMOUNT");
            promo3.setDiscountValue(5.0);
            promo3.setExpiryDate(getDatePlusMonths(2));
            promo3.setUsageLimit(200);
            promo3.setUsedCount(0);
            promo3.setActive(true);

            PromoCode promo4 = new PromoCode();
            promo4.setCode("CINEMA3");
            promo4.setDescription("€3 off for all users");
            promo4.setDiscountType("FIXED_AMOUNT");
            promo4.setDiscountValue(3.0);
            promo4.setExpiryDate(getDatePlusMonths(1));
            promo4.setUsageLimit(500);
            promo4.setUsedCount(0);
            promo4.setActive(true);

            // Create an expired promo code for testing
            PromoCode expiredPromo = new PromoCode();
            expiredPromo.setCode("EXPIRED");
            expiredPromo.setDescription("Expired promo code");
            expiredPromo.setDiscountType("PERCENTAGE");
            expiredPromo.setDiscountValue(15.0);
            expiredPromo.setExpiryDate(getDateMinusDays(1));
            expiredPromo.setUsageLimit(100);
            expiredPromo.setUsedCount(0);
            expiredPromo.setActive(true);

            // Create an inactive promo code for testing
            PromoCode inactivePromo = new PromoCode();
            inactivePromo.setCode("INACTIVE");
            inactivePromo.setDescription("Inactive promo code");
            inactivePromo.setDiscountType("PERCENTAGE");
            inactivePromo.setDiscountValue(25.0);
            inactivePromo.setExpiryDate(getDatePlusMonths(6));
            inactivePromo.setUsageLimit(100);
            inactivePromo.setUsedCount(0);
            inactivePromo.setActive(false);

            // Save all promo codes
            promoCodeRepository.save(promo1);
            promoCodeRepository.save(promo2);
            promoCodeRepository.save(promo3);
            promoCodeRepository.save(promo4);
            promoCodeRepository.save(expiredPromo);
            promoCodeRepository.save(inactivePromo);

            System.out.println("=".repeat(60));
            System.out.println("Test promo codes created successfully!");
            System.out.println("=".repeat(60));
            System.out.println("Valid promo codes:");
            System.out.println("  SAVE10     - 10% off (expires in 3 months, 100 uses)");
            System.out.println("  WELCOME20  - 20% off (expires in 6 months, 50 uses)");
            System.out.println("  MOVIE5     - €5 off (expires in 2 months, 200 uses)");
            System.out.println("  CINEMA3    - €3 off (expires in 1 month, 500 uses)");
            System.out.println("\nInvalid promo codes (for testing):");
            System.out.println("  EXPIRED    - Expired promo code");
            System.out.println("  INACTIVE   - Inactive promo code");
            System.out.println("=".repeat(60));
        };
    }

    // Helper methods to create dates
    private static Date getDatePlusMonths(int months) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MONTH, months);
        return calendar.getTime();
    }

    private static Date getDateMinusDays(int days) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, -days);
        return calendar.getTime();
    }
}
