package com.cinema.backend.controllers;

import com.cinema.backend.models.Order;
import com.cinema.backend.repositories.OrderRepository;
import com.cinema.backend.services.QRCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private QRCodeService qrCodeService;

    @PostMapping("/{orderId}")
    public ResponseEntity<?> processPayment(@PathVariable Long orderId,
            @RequestBody Map<String, String> paymentDetails) {
        try {
            // Pre-condition 1: Booking exists with PENDING status
            Optional<Order> orderOptional = orderRepository.findById(orderId);

            if (!orderOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "error", "Order not found", "message",
                                "Booking does not exist"));
            }

            Order order = orderOptional.get();

            // Check if order is in PENDING status
            if (!"PENDING".equals(order.getOrderStatus())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "error", "Invalid order status",
                                "message",
                                "Order status is " + order.getOrderStatus() + ". Only PENDING orders can be paid."));
            }

            // Pre-condition 2: Total amount calculated
            if (order.getTotalAmount() <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "error", "Invalid amount", "message",
                                "Total amount not calculated"));
            }

            // Extract payment details
            String paymentMethod = paymentDetails.getOrDefault("paymentMethod", "Card");
            String cardNumber = paymentDetails.getOrDefault("cardNumber", "");

            // UC-20: Mock payment processing
            boolean paymentSuccess = processMockPayment(paymentMethod, cardNumber, order.getTotalAmount());

            if (paymentSuccess) {
                // Payment successful - update order
                String transactionId = generateTransactionId();
                order.setTransactionId(transactionId);
                order.setPaymentDate(new Date());
                order.setPaymentMethod(paymentMethod);
                order.setOrderStatus("CONFIRMED");

                // UC-21: Generate booking reference and QR code
                String bookingReference = generateBookingReference(order);
                order.setBookingReference(bookingReference);

                // Generate QR code with booking details
                String qrData = qrCodeService.generateBookingQRData(
                        bookingReference,
                        order.getMovieTitle(),
                        order.getMovieSession(),
                        formatSeats(order.getSeat()),
                        "Hall 1" // TODO: Get actual hall name from session
                );
                String qrCodeBase64 = qrCodeService.generateQRCodeBase64(qrData, 300, 300);
                order.setQrCode(qrCodeBase64);

                orderRepository.save(order);

                System.out
                        .println("Payment successful for Order ID: " + orderId + ", Transaction ID: " + transactionId);

                return ResponseEntity.ok()
                        .body(Map.of(
                                "success", true,
                                "orderId", order.getOrderId(),
                                "transactionId", transactionId,
                                "bookingReference", bookingReference,
                                "qrCode", qrCodeBase64,
                                "orderStatus", "CONFIRMED",
                                "message", "Payment successful. Booking confirmed!",
                                "totalAmount", order.getTotalAmount(),
                                "paymentDate", order.getPaymentDate().toString()));
            } else {
                // Payment failed
                order.setOrderStatus("PAYMENT_FAILED");
                orderRepository.save(order);

                System.out.println("Payment failed for Order ID: " + orderId);

                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                        .body(Map.of(
                                "success", false,
                                "orderId", order.getOrderId(),
                                "orderStatus", "PAYMENT_FAILED",
                                "error", "Payment failed",
                                "message",
                                "Payment was rejected. Please try again or use a different payment method."));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Payment processing failed", "message", e.getMessage()));
        }
    }

    // Mock payment processor - simulates payment gateway
    private boolean processMockPayment(String paymentMethod, String cardNumber, double amount) {
        System.out.println("Processing " + paymentMethod + " payment for amount: $" + amount);

        // Handle different payment methods
        switch (paymentMethod) {
            case "Card":
                return processCardPayment(cardNumber);
            case "E-Wallet":
                return processEWalletPayment();
            case "Cash":
                return processCashPayment();
            case "Bank Transfer":
                return processBankTransferPayment();
            default:
                System.out.println("Unknown payment method: " + paymentMethod);
                return false;
        }
    }

    // Mock card payment processing
    private boolean processCardPayment(String cardNumber) {
        // Validation: Basic card number check
        if (cardNumber == null || cardNumber.trim().isEmpty()) {
            System.out.println("Mock Card Payment: Invalid card number");
            return false;
        }

        // Remove spaces and check length
        String cleanCardNumber = cardNumber.replaceAll("\\s+", "");
        if (cleanCardNumber.length() < 13 || cleanCardNumber.length() > 19) {
            System.out.println("Mock Card Payment: Card number length invalid");
            return false;
        }

        // Mock: Simulate 90% success rate (for testing purposes)
        // In production, this would call real payment gateway API
        boolean success = Math.random() > 0.1; // 90% success rate

        System.out.println("Mock Card Payment: CardNumber=" +
                cleanCardNumber.substring(0, 4) + "****" + cleanCardNumber.substring(cleanCardNumber.length() - 4) +
                ", Result=" + (success ? "SUCCESS" : "FAILED"));

        return success;
    }

    // Mock e-wallet payment processing
    private boolean processEWalletPayment() {
        // Simulate e-wallet payment (PayPal, Google Pay, etc.)
        // In real app, would redirect to e-wallet provider
        boolean success = Math.random() > 0.05; // 95% success rate
        System.out.println("Mock E-Wallet Payment: Result=" + (success ? "SUCCESS" : "FAILED"));
        return success;
    }

    // Mock cash payment processing
    private boolean processCashPayment() {
        // Cash payments are always "successful" at booking time
        // Actual payment happens at counter
        System.out.println("Mock Cash Payment: Booking reserved for cash payment at counter");
        return true; // Always succeeds - payment at counter
    }

    // Mock bank transfer payment processing
    private boolean processBankTransferPayment() {
        // Bank transfer - booking confirmed, awaiting transfer
        // In real app, would send transfer instructions
        System.out.println("Mock Bank Transfer: Booking confirmed, transfer instructions sent");
        return true; // Always succeeds - awaiting transfer
    }

    // Generate unique transaction ID
    private String generateTransactionId() {
        return "TXN" + System.currentTimeMillis() + (int) (Math.random() * 1000);
    }

    // Generate unique booking reference for UC-21
    private String generateBookingReference(Order order) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
        String datePart = dateFormat.format(new Date());
        String randomPart = String.format("%04d", (int) (Math.random() * 10000));
        return "BK-" + datePart + "-" + randomPart;
    }

    // Format seat list as string
    private String formatSeats(List<Integer> seats) {
        if (seats == null || seats.isEmpty()) {
            return "N/A";
        }
        return seats.stream()
                .sorted()
                .map(String::valueOf)
                .collect(Collectors.joining(", "));
    }

    // Get payment status for an order
    @GetMapping("/{orderId}/status")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long orderId) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);

        if (!orderOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Order not found"));
        }

        Order order = orderOptional.get();

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.getOrderId());
        response.put("orderStatus", order.getOrderStatus());
        response.put("totalAmount", order.getTotalAmount());

        if (order.getTransactionId() != null) {
            response.put("transactionId", order.getTransactionId());
            response.put("paymentDate", order.getPaymentDate());
            response.put("paymentMethod", order.getPaymentMethod());
            response.put("bookingReference", order.getBookingReference());
        }

        return ResponseEntity.ok(response);
    }
}
