package com.cinema.backend.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@cinema.com}")
    private String fromEmail;

    @Value("${cinema.email.mock:true}")
    private boolean mockEmail;

    /**
     * Send booking confirmation email with QR code
     * Supports both mock (console) and real email sending
     * Toggle with cinema.email.mock property in application.properties
     */
    public boolean sendBookingConfirmationEmail(
            String toEmail,
            String bookingReference,
            String movieTitle,
            String movieSession,
            List<Integer> seats,
            double totalAmount,
            String qrCodeBase64) {

        try {
            if (mockEmail) {
                // Mock mode - print to console
                System.out.println("=".repeat(80));
                System.out.println("MOCK EMAIL - Booking Confirmation");
                System.out.println("=".repeat(80));
                System.out.println("To: " + toEmail);
                System.out.println("From: " + fromEmail);
                System.out.println("Subject: Booking Confirmation - " + bookingReference);
                System.out.println("-".repeat(80));
                System.out.println("Dear Customer,");
                System.out.println();
                System.out.println("Your booking has been confirmed!");
                System.out.println();
                System.out.println("Booking Reference: " + bookingReference);
                System.out.println("Movie: " + movieTitle);
                System.out.println("Session: " + movieSession);
                System.out.println("Seats: " + formatSeats(seats));
                System.out.println("Total Amount: $" + String.format("%.2f", totalAmount));
                System.out.println();
                System.out.println("QR Code: [Base64 Image - " + qrCodeBase64.length() + " characters]");
                System.out.println();
                System.out.println("Please present your QR code at the cinema entrance.");
                System.out.println("Arrive at least 15 minutes before the session starts.");
                System.out.println();
                System.out.println("Thank you for choosing our cinema!");
                System.out.println("=".repeat(80));
            } else {
                // Real email mode - send actual email via SMTP
                System.out.println("Sending actual email to: " + toEmail);
                sendActualEmail(toEmail, bookingReference, movieTitle, movieSession, seats, totalAmount,
                        qrCodeBase64);
                System.out.println("Email sent successfully to: " + toEmail);
            }

            return true;

        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Actual email sending implementation
     * Automatically used when cinema.email.mock=false
     */
    private void sendActualEmail(
            String toEmail,
            String bookingReference,
            String movieTitle,
            String movieSession,
            List<Integer> seats,
            double totalAmount,
            String qrCodeBase64) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Booking Confirmation - " + bookingReference);

        // Build HTML content with CID reference for QR code
        String htmlContent = buildEmailHtml(
                bookingReference, movieTitle, movieSession,
                seats, totalAmount);

        helper.setText(htmlContent, true);

        // Attach QR code as inline image with Content-ID
        // This ensures it displays properly in email clients
        byte[] qrCodeBytes = Base64.getDecoder().decode(qrCodeBase64);
        ByteArrayResource qrCodeResource = new ByteArrayResource(qrCodeBytes);
        helper.addInline("qrcode", qrCodeResource, "image/png");

        mailSender.send(message);
    }

    /**
     * Build HTML email content
     */
    private String buildEmailHtml(
            String bookingReference,
            String movieTitle,
            String movieSession,
            List<Integer> seats,
            double totalAmount) {

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #ef4444; color: white; padding: 20px; text-align: center; }
                        .content { background-color: #f9fafb; padding: 30px; }
                        .booking-ref { font-size: 24px; font-weight: bold; color: #2563eb; text-align: center; margin: 20px 0; }
                        .details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
                        .qr-code { text-align: center; margin: 30px 0; }
                        .qr-code img { max-width: 300px; height: auto; display: block; margin: 0 auto; }
                        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎬 Booking Confirmation</h1>
                        </div>
                        <div class="content">
                            <p>Dear Customer,</p>
                            <p>Your movie ticket booking has been confirmed!</p>

                            <div class="booking-ref">"""
                + bookingReference + """
                        </div>

                        <div class="details">
                            <div class="detail-row">
                                <strong>Movie:</strong>
                                <span>""" + movieTitle + """
                            </span>
                        </div>
                        <div class="detail-row">
                            <strong>Session:</strong>
                            <span>""" + movieSession + """
                            </span>
                        </div>
                        <div class="detail-row">
                            <strong>Seats:</strong>
                            <span>""" + formatSeats(seats) + """
                            </span>
                        </div>
                        <div class="detail-row">
                            <strong>Total Amount:</strong>
                            <span>$""" + String.format("%.2f", totalAmount)
                + """
                                    </span>
                                </div>
                            </div>

                            <div class="qr-code">
                                <h3>Your Ticket QR Code</h3>
                                <img src="cid:qrcode" alt="Booking QR Code" />
                                <p>Show this QR code at the cinema entrance</p>
                            </div>

                            <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px;">
                                <strong>Important Information:</strong>
                                <ul>
                                    <li>Please arrive at least 15 minutes before the session start time</li>
                                    <li>Present your QR code at the entrance</li>
                                    <li>This booking is non-refundable after the session starts</li>
                                </ul>
                            </div>
                        </div>
                                        <div class="footer">
                                            <p>Thank you for choosing our cinema!</p>
                                            <p>For any queries, please contact our customer service.</p>
                                        </div>
                                    </div>
                                </body>
                                </html>
                            """;
    }

    /**
     * Format seat list as string
     */
    private String formatSeats(List<Integer> seats) {
        if (seats == null || seats.isEmpty()) {
            return "N/A";
        }
        return seats.stream()
                .sorted()
                .map(String::valueOf)
                .reduce((a, b) -> a + ", " + b)
                .orElse("N/A");
    }
}
