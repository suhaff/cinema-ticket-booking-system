package com.cinema.backend.models;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long orderId;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;
    private Long customerId;

    private String userName;
    private String orderDate;
    private Long movieId;
    private String movieTitle;
    private String movieGenres;
    private String movieLanguage;
    private String movieSession;
    private double moviePrice; // Base price per seat
    private int movieRuntime;
    @ElementCollection
    private List<Integer> seat;

    @Column(nullable = false)
    private String orderStatus = "PENDING"; // PENDING, CONFIRMED, CANCELLED, PAYMENT_FAILED

    // Price breakdown fields for UC-18
    private double subtotal; // Base price × seat count
    private double bookingFee; // Booking service fee
    private double tax; // Applicable taxes
    private double discount; // Promo code discount (UC-19)
    private double totalAmount; // Final total amount

    // Payment fields for UC-20
    private String transactionId; // Payment transaction ID
    @Temporal(TemporalType.TIMESTAMP)
    private Date paymentDate; // When payment was completed
    private String paymentMethod; // Card, Cash, etc.

    public Order() {
    }

    public Order(Long orderId, Long customerId, String userName, String orderDate, Long movieId, String movieTitle,
            String movieGenres, String movieLanguage, String movieSession, double moviePrice, int movieRuntime,
            List<Integer> seat, String orderStatus) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.userName = userName;
        this.orderDate = orderDate;
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.movieGenres = movieGenres;
        this.movieLanguage = movieLanguage;
        this.movieSession = movieSession;
        this.moviePrice = moviePrice;
        this.movieRuntime = movieRuntime;
        this.seat = seat;
        this.orderStatus = orderStatus;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public String getMovieGenres() {
        return movieGenres;
    }

    public void setMovieGenres(String movieGenres) {
        this.movieGenres = movieGenres;
    }

    public String getMovieLanguage() {
        return movieLanguage;
    }

    public void setMovieLanguage(String movieLanguage) {
        this.movieLanguage = movieLanguage;
    }

    public double getMoviePrice() {
        return moviePrice;
    }

    public void setMoviePrice(double moviePrice) {
        this.moviePrice = moviePrice;
    }

    public int getMovieRuntime() {
        return movieRuntime;
    }

    public void setMovieRuntime(int movieRuntime) {
        this.movieRuntime = movieRuntime;
    }

    public List<Integer> getSeat() {
        return seat;
    }

    public void setSeat(List<Integer> seat) {
        this.seat = seat;
    }

    public String getMovieSession() {
        return movieSession;
    }

    public void setMovieSession(String movieSession) {
        this.movieSession = movieSession;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public Date getCreatedAt() {
        return createdAt;
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

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Order order = (Order) o;
        return Double.compare(moviePrice, order.moviePrice) == 0 && movieRuntime == order.movieRuntime
                && Objects.equals(orderId, order.orderId) && Objects.equals(customerId, order.customerId)
                && Objects.equals(userName, order.userName) && Objects.equals(orderDate, order.orderDate)
                && Objects.equals(movieId, order.movieId) && Objects.equals(movieTitle, order.movieTitle)
                && Objects.equals(movieGenres, order.movieGenres) && Objects.equals(movieLanguage, order.movieLanguage)
                && Objects.equals(movieSession, order.movieSession) && Objects.equals(seat, order.seat)
                && Objects.equals(orderStatus, order.orderStatus);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderId, customerId, userName, orderDate, movieId, movieTitle, movieGenres, movieLanguage,
                movieSession, moviePrice, movieRuntime, seat, orderStatus);
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +
                ", customerId=" + customerId +
                ", userName='" + userName + '\'' +
                ", orderDate='" + orderDate + '\'' +
                ", movieId=" + movieId +
                ", movieTitle='" + movieTitle + '\'' +
                ", movieGenres='" + movieGenres + '\'' +
                ", movieLanguage='" + movieLanguage + '\'' +
                ", movieSession='" + movieSession + '\'' +
                ", moviePrice=" + moviePrice +
                ", movieRuntime=" + movieRuntime +
                ", seat=" + seat +
                ", orderStatus='" + orderStatus + '\'' +
                '}';
    }
}
