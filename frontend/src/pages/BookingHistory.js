import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GetBookingHistory from "../API/GetBookingHistory";
import formatDate from "../utils/formatDate";
import "../styles/BookingHistory.css";

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookingHistory = async () => {
            try {
                setLoading(true);
                const storedUser = JSON.parse(localStorage.getItem('user'));
                
                if (!storedUser || !storedUser.userId) {
                    setError("Please log in to view your booking history");
                    setLoading(false);
                    return;
                }

                const userId = storedUser.userId;
                const result = await GetBookingHistory(userId);

                if (result.success) {
                    setBookings(result.bookings);
                    filterBookings(result.bookings, "ALL");
                } else {
                    setError(result.message || "Failed to load booking history");
                }
            } catch (err) {
                console.error("Error loading booking history:", err);
                setError("An error occurred while loading your bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchBookingHistory();
    }, []);

    const filterBookings = (bookingsList, status) => {
        if (status === "ALL") {
            setFilteredBookings(bookingsList);
        } else {
            setFilteredBookings(bookingsList.filter(booking => booking.orderStatus === status));
        }
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        filterBookings(bookings, status);
    };

    const handleViewDetails = (orderId) => {
        navigate(`/booking-confirmation/${orderId}`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "CONFIRMED":
                return "status-confirmed";
            case "PENDING":
                return "status-pending";
            case "CANCELLED":
                return "status-cancelled";
            default:
                return "";
        }
    };

    if (loading) {
        return (
            <div className="booking-history-container">
                <div className="loading">Loading your booking history...</div>
            </div>
        );
    }

    return (
        <div className="booking-history-container">
            <div className="booking-history-header">
                <h1>My Booking History</h1>
                {bookings.length > 0 && (
                    <p className="total-bookings">Total Bookings: {bookings.length}</p>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {bookings.length === 0 ? (
                <div className="no-bookings">
                    <p>No bookings found. Start booking tickets to see your history here!</p>
                </div>
            ) : (
                <>
                    <div className="filter-section">
                        <label>Filter by Status:</label>
                        <div className="filter-buttons">
                            {["ALL", "CONFIRMED", "PENDING", "CANCELLED"].map((status) => (
                                <button
                                    key={status}
                                    className={`filter-btn ${selectedStatus === status ? "active" : ""}`}
                                    onClick={() => handleStatusFilter(status)}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <p className="filter-count">Showing {filteredBookings.length} booking(s)</p>
                    </div>

                    <div className="bookings-list">
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking, index) => (
                                <div key={index} className="booking-card">
                                    <div className="booking-card-header">
                                        <div className="booking-ref">
                                            <strong>Booking Ref:</strong> {booking.bookingReference}
                                        </div>
                                        <div className={`status-badge ${getStatusColor(booking.orderStatus)}`}>
                                            {booking.orderStatus}
                                        </div>
                                    </div>

                                    <div className="booking-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Movie:</span>
                                            <span className="detail-value">{booking.movieTitle}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Session:</span>
                                            <span className="detail-value">{booking.movieSession}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Booking Date:</span>
                                            <span className="detail-value">
                                                {formatDate(booking.orderDate)}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Seats:</span>
                                            <span className="detail-value">{booking.seatCount} ticket(s)</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Total Amount:</span>
                                            <span className="detail-value amount">€{booking.totalAmount.toFixed(2)}</span>
                                        </div>
                                        {booking.paymentMethod && (
                                            <div className="detail-row">
                                                <span className="detail-label">Payment Method:</span>
                                                <span className="detail-value">{booking.paymentMethod}</span>
                                            </div>
                                        )}
                                        {booking.transactionId && (
                                            <div className="detail-row">
                                                <span className="detail-label">Transaction ID:</span>
                                                <span className="detail-value">{booking.transactionId}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="booking-actions">
                                        <button
                                            className="view-details-btn"
                                            onClick={() => handleViewDetails(booking.orderId)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                <p>No bookings found with the selected status.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default BookingHistory;
