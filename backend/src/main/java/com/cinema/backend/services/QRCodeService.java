package com.cinema.backend.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
public class QRCodeService {

    /**
     * Generate QR code as Base64 encoded string
     * 
     * @param data   The data to encode in QR code
     * @param width  Width of QR code in pixels
     * @param height Height of QR code in pixels
     * @return Base64 encoded PNG image
     */
    public String generateQRCodeBase64(String data, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, width, height);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            byte[] qrCodeBytes = outputStream.toByteArray();

            return Base64.getEncoder().encodeToString(qrCodeBytes);
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    /**
     * Generate booking QR code data string
     * 
     * @param bookingRef   Booking reference number
     * @param movieTitle   Movie title
     * @param movieSession Session time
     * @param seats        Seat numbers
     * @param hallName     Hall name
     * @return Formatted string for QR code
     */
    public String generateBookingQRData(String bookingRef, String movieTitle, String movieSession,
            String seats, String hallName) {
        return String.format(
                "BOOKING REF: %s\nMOVIE: %s\nSESSION: %s\nSEATS: %s\nHALL: %s",
                bookingRef, movieTitle, movieSession, seats, hallName);
    }
}
