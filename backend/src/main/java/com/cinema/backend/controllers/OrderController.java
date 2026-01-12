package com.cinema.backend.controllers;

import com.cinema.backend.dto.PriceBreakdownDTO;
import com.cinema.backend.models.CinemaHall;
import com.cinema.backend.models.Order;
import com.cinema.backend.repositories.CinemaHallRepository;
import com.cinema.backend.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CinemaHallRepository cinemaHallRepository;

    @PostMapping("/api/v1/order")
    ResponseEntity<?> newOrder(@RequestBody Order newOrder) {
        try {
            // Log incoming order details for debugging
            System.out.println("Received order: MovieID=" + newOrder.getMovieId()
                    + ", Session=" + newOrder.getMovieSession()
                    + ", Seats=" + newOrder.getSeat());

            // Pre-condition 1: User is authenticated (handled by frontend/auth middleware)

            // Pre-condition 2: Session exists and is not already started (only if
            // movieSession is provided)
            if (newOrder.getMovieSession() != null && !newOrder.getMovieSession().isEmpty()) {
                if (!validateSessionTime(newOrder.getMovieSession())) {
                    System.out.println("Session validation failed for: " + newOrder.getMovieSession());
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Session unavailable", "message", "Session is past or full"));
                }
            }

            // Pre-condition 3: Selected seats are available (only if movieSession is
            // provided)
            if (newOrder.getMovieSession() != null && !newOrder.getMovieSession().isEmpty()) {
                Optional<CinemaHall> hallOptional = cinemaHallRepository
                        .findByMovieIdAndMovieSession(newOrder.getMovieId(), newOrder.getMovieSession());

                if (hallOptional.isPresent()) {
                    CinemaHall hall = hallOptional.get();
                    List<Integer> occupiedSeats = hall.getUpdatedSeats();

                    // Check if any selected seat is already occupied/reserved
                    for (Integer seat : newOrder.getSeat()) {
                        if (occupiedSeats.contains(seat)) {
                            return ResponseEntity.status(HttpStatus.CONFLICT)
                                    .body(Map.of("error", "Seat no longer available", "message",
                                            "One or more selected seats are already reserved/occupied"));
                        }
                    }
                }
            }

            // Set order status to PENDING (reserved)
            newOrder.setOrderStatus("PENDING");

            // UC-18: Calculate price breakdown
            PriceBreakdownDTO priceBreakdown = calculatePriceBreakdown(
                    newOrder.getMoviePrice(),
                    newOrder.getSeat().size(),
                    0.0 // discount will be applied by UC-19
            );

            // Store price breakdown in order
            newOrder.setSubtotal(priceBreakdown.getSubtotal());
            newOrder.setBookingFee(priceBreakdown.getBookingFee());
            newOrder.setTax(priceBreakdown.getTax());
            newOrder.setDiscount(priceBreakdown.getDiscount());
            newOrder.setTotalAmount(priceBreakdown.getTotal());

            // Save booking with PENDING status
            Order savedOrder = orderRepository.save(newOrder);

            // Reserve seats in cinema hall (only if movieSession is provided)
            if (newOrder.getMovieSession() != null && !newOrder.getMovieSession().isEmpty()) {
                reserveSeats(newOrder.getMovieId(), newOrder.getMovieSession(), newOrder.getSeat());
            }

            // Return booking ID and price breakdown to proceed to payment
            System.out.println("Order created successfully: OrderID=" + savedOrder.getOrderId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "orderId", savedOrder.getOrderId(),
                            "status", savedOrder.getOrderStatus(),
                            "message", "Booking created successfully. Proceed to payment.",
                            "priceBreakdown", Map.of(
                                    "basePrice", priceBreakdown.getBasePrice(),
                                    "seatCount", priceBreakdown.getSeatCount(),
                                    "subtotal", priceBreakdown.getSubtotal(),
                                    "bookingFee", priceBreakdown.getBookingFee(),
                                    "tax", priceBreakdown.getTax(),
                                    "discount", priceBreakdown.getDiscount(),
                                    "total", priceBreakdown.getTotal())));

        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Booking creation failed", "message", e.getMessage()));
        }
    }

    @GetMapping("/api/v1/order/{userId}")
    Optional<Order> getLastOrderByUserId(@PathVariable Long userId) {
        return orderRepository.findFirstByCustomerIdOrderByCreatedAtDesc(userId);
    }

    // Helper method to validate session time
    private boolean validateSessionTime(String sessionTime) {
        // TODO: For now, allow all bookings for testing purposes
        // Will enforce strict validation when implementing payment flow
        System.out
                .println("Validating session time: " + sessionTime + " (Currently allowing all sessions for testing)");
        return true;

        /*
         * Commented out for testing - uncomment when ready for production
         * try {
         * // Parse the session time (e.g., "09:15 AM")
         * SimpleDateFormat sdf = new SimpleDateFormat("hh:mm a", Locale.ENGLISH);
         * sdf.setLenient(false);
         * 
         * // Get today's date
         * Calendar sessionCal = Calendar.getInstance();
         * Date parsedTime = sdf.parse(sessionTime);
         * 
         * // Set the parsed time to today's date
         * Calendar timeCal = Calendar.getInstance();
         * timeCal.setTime(parsedTime);
         * sessionCal.set(Calendar.HOUR_OF_DAY, timeCal.get(Calendar.HOUR_OF_DAY));
         * sessionCal.set(Calendar.MINUTE, timeCal.get(Calendar.MINUTE));
         * sessionCal.set(Calendar.SECOND, 0);
         * sessionCal.set(Calendar.MILLISECOND, 0);
         * 
         * Date sessionDateTime = sessionCal.getTime();
         * Date currentTime = new Date();
         * 
         * // Check if session is not in the past (allow if session is in the future or
         * // within 30 minutes)
         * long diffInMinutes = (sessionDateTime.getTime() - currentTime.getTime()) /
         * (60 * 1000);
         * return diffInMinutes >= -30; // Allow booking up to 30 minutes after session
         * start
         * } catch (ParseException e) {
         * // If parsing fails, allow the booking (might be a different format)
         * System.out.println("Failed to parse session time: " + sessionTime +
         * ". Allowing booking.");
         * return true;
         * }
         */
    }

    // UC-18: Calculate price breakdown with booking fees and taxes
    private PriceBreakdownDTO calculatePriceBreakdown(double basePrice, int seatCount, double discount) {
        // Configurable pricing rules (can be moved to application.properties)
        final double BOOKING_FEE_RATE = 0.10; // 10% booking fee
        final double TAX_RATE = 0.10; // 10% tax rate

        // Calculate subtotal
        double subtotal = basePrice * seatCount;

        // Calculate booking fee
        double bookingFee = subtotal * BOOKING_FEE_RATE;

        // Calculate tax on (subtotal + booking fee - discount)
        double taxableAmount = subtotal + bookingFee - discount;
        double tax = taxableAmount * TAX_RATE;

        // Calculate final total
        double total = subtotal + bookingFee + tax - discount;

        // Ensure total is not negative
        if (total < 0) {
            total = 0;
        }

        PriceBreakdownDTO breakdown = new PriceBreakdownDTO(
                basePrice,
                seatCount,
                subtotal,
                bookingFee,
                tax,
                discount,
                total);

        System.out.println("Price Breakdown: " + breakdown);
        return breakdown;
    }

    // Helper method to reserve seats
    private void reserveSeats(Long movieId, String movieSession, List<Integer> seats) {
        Optional<CinemaHall> hallOptional = cinemaHallRepository
                .findByMovieIdAndMovieSession(movieId, movieSession);

        if (hallOptional.isPresent()) {
            CinemaHall hall = hallOptional.get();
            List<Integer> updatedSeats = new ArrayList<>(hall.getUpdatedSeats());
            updatedSeats.addAll(seats);
            hall.setUpdatedSeats(updatedSeats);
            cinemaHallRepository.save(hall);
        } else {
            // Create new cinema hall entry if doesn't exist
            CinemaHall newHall = new CinemaHall();
            newHall.setMovieId(movieId);
            newHall.setMovieSession(movieSession);
            newHall.setUpdatedSeats(new ArrayList<>(seats));
            newHall.setOrderTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
            cinemaHallRepository.save(newHall);
        }
    }
}
