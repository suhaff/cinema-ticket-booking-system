package com.cinema.backend.dto;

public class PriceBreakdownDTO {
    private double basePrice;
    private int seatCount;
    private double subtotal;
    private double bookingFee;
    private double tax;
    private double discount;
    private double total;

    public PriceBreakdownDTO() {
    }

    public PriceBreakdownDTO(double basePrice, int seatCount, double subtotal, double bookingFee, double tax,
            double discount, double total) {
        this.basePrice = basePrice;
        this.seatCount = seatCount;
        this.subtotal = subtotal;
        this.bookingFee = bookingFee;
        this.tax = tax;
        this.discount = discount;
        this.total = total;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    public int getSeatCount() {
        return seatCount;
    }

    public void setSeatCount(int seatCount) {
        this.seatCount = seatCount;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public double getBookingFee() {
        return bookingFee;
    }

    public void setBookingFee(double bookingFee) {
        this.bookingFee = bookingFee;
    }

    public double getTax() {
        return tax;
    }

    public void setTax(double tax) {
        this.tax = tax;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    @Override
    public String toString() {
        return "PriceBreakdownDTO{" +
                "basePrice=" + basePrice +
                ", seatCount=" + seatCount +
                ", subtotal=" + subtotal +
                ", bookingFee=" + bookingFee +
                ", tax=" + tax +
                ", discount=" + discount +
                ", total=" + total +
                '}';
    }
}
