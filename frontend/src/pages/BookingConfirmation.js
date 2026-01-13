import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SendBookingEmail from '../API/SendBookingEmail';
import CancelBooking from '../API/CancelBooking';

const BookingConfirmation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [emailSending, setEmailSending] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchBookingDetails();
    }, [orderId]);

    const fetchBookingDetails = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/booking/${orderId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch booking details');
            }

            const data = await response.json();
            setBooking(data);
            console.log('Booking loaded:', { orderStatus: data.orderStatus, orderDate: data.orderDate });
            setLoading(false);
        } catch (err) {
            console.error('Error fetching booking:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleDownloadTicket = () => {
        // Create a printable version
        window.print();
    };

    const handleSendEmail = async () => {
        if (!email || !email.trim()) {
            setEmailError('Please enter your email address');
            return;
        }

        // Simple email validation
        const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        setEmailSending(true);
        setEmailError('');
        setEmailSuccess(false);

        const result = await SendBookingEmail(process.env.REACT_APP_BASE_URL, orderId, email);

        setEmailSending(false);

        if (result.success) {
            setEmailSuccess(true);
            setEmail(''); // Clear the email field
            setTimeout(() => setEmailSuccess(false), 5000); // Hide success message after 5 seconds
        } else {
            setEmailError(result.message || 'Failed to send email. Please try again.');
        }
    };

    const handleCancelBooking = async () => {
        setCancelling(true);
        
        const result = await CancelBooking(process.env.REACT_APP_BASE_URL, orderId);
        
        setCancelling(false);
        setShowCancelModal(false);

        if (result.success) {
            alert(`Booking cancelled successfully!\n\nRefund amount: €${result.refundAmount?.toFixed(2)}\n\nRefund will be processed within 5-7 business days.`);
            // Refresh booking details to show cancelled status
            fetchBookingDetails();
        } else {
            alert(`Failed to cancel booking:\n${result.message}`);
        }
    };

    const isWithin24Hours = (orderDate) => {
        if (!orderDate) return false;
        const orderTime = new Date(orderDate).getTime();
        const currentTime = new Date().getTime();
        const diffInHours = (currentTime - orderTime) / (60 * 60 * 1000);
        console.log('Checking 24-hour window:', { orderDate, diffInHours, isValid: diffInHours <= 24 });
        return diffInHours <= 24;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatSeats = (seats) => {
        if (!seats || seats.length === 0) return 'N/A';
        return seats.sort((a, b) => a - b).join(', ');
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading booking details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <div className="flex-grow flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
                        <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="mt-4 text-2xl font-bold text-gray-900">Booking Not Found</h2>
                            <p className="mt-2 text-gray-600">{error || 'Unable to load booking details'}</p>
                            <button
                                onClick={() => navigate('/')}
                                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Go to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Success Header */}
                    <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6 rounded-r-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h1 className="text-2xl font-bold text-green-800">Booking Confirmed!</h1>
                                <p className="text-green-700 mt-1">Your tickets have been successfully booked</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Booking Reference */}
                        <div className="bg-blue-600 text-white p-6">
                            <div className="text-center">
                                <p className="text-sm uppercase tracking-wide">Booking Reference</p>
                                <p className="text-3xl font-bold mt-2">{booking.bookingReference}</p>
                                <p className="text-sm mt-2 opacity-90">Please save this reference for entry</p>
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="p-6 bg-gray-50 border-b border-gray-200">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Ticket QR Code</h3>
                                {booking.qrCode ? (
                                    <div className="inline-block bg-white p-4 rounded-lg shadow">
                                        <img
                                            src={`data:image/png;base64,${booking.qrCode}`}
                                            alt="Booking QR Code"
                                            className="w-64 h-64 mx-auto"
                                        />
                                        <p className="text-sm text-gray-600 mt-2">Show this at the cinema entrance</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-600">QR code not available</p>
                                )}
                            </div>
                        </div>

                        {/* Movie Details */}
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Movie Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Movie</p>
                                    <p className="font-semibold text-gray-900">{booking.movieTitle}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Session Time</p>
                                    <p className="font-semibold text-gray-900">{booking.movieSession}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Language</p>
                                    <p className="font-semibold text-gray-900">{booking.movieLanguage}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Runtime</p>
                                    <p className="font-semibold text-gray-900">{booking.movieRuntime} mins</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Seats</p>
                                    <p className="font-semibold text-gray-900">{formatSeats(booking.seats)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Hall</p>
                                    <p className="font-semibold text-gray-900">Hall 1</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">${booking.subtotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Booking Fee</span>
                                    <span className="font-semibold">${booking.bookingFee?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-semibold">${booking.tax?.toFixed(2)}</span>
                                </div>
                                {booking.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span className="font-semibold">-${booking.discount?.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                                    <span className="text-lg font-bold text-gray-900">Total Paid</span>
                                    <span className="text-lg font-bold text-gray-900">${booking.totalAmount?.toFixed(2)}</span>
                                </div>
                                <div className="pt-2 text-sm text-gray-600">
                                    <p>Payment Method: <span className="font-semibold">{booking.paymentMethod}</span></p>
                                    <p>Transaction ID: <span className="font-semibold">{booking.transactionId}</span></p>
                                    <p>Payment Date: <span className="font-semibold">{formatDate(booking.paymentDate)}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 bg-gray-50">
                            <div className="flex flex-col gap-4">
                                {/* Email Section */}
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Send Ticket to Email
                                    </h4>
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={emailSending}
                                        />
                                        <button
                                            onClick={handleSendEmail}
                                            disabled={emailSending}
                                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {emailSending ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                    </svg>
                                                    Send
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    {emailSuccess && (
                                        <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Email sent successfully! Check your inbox.
                                        </div>
                                    )}
                                    {emailError && (
                                        <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            {emailError}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={handleDownloadTicket}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Print Ticket
                                    </button>
                                    
                                    {/* Cancel Button - Only show if within 24 hours and not cancelled */}
                                    {booking.orderStatus !== 'CANCELLED' && isWithin24Hours(booking.orderDate) && (
                                        <button
                                            onClick={() => setShowCancelModal(true)}
                                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancel Booking
                                        </button>
                                    )}
                                    
                                    <button
                                        onClick={() => navigate('/')}
                                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
                                    >
                                        Back to Home
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Important Information */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Important Information</h4>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                            <li>Please arrive at least 15 minutes before the session start time</li>
                            <li>Present your QR code or booking reference at the entrance</li>
                            <li>Bookings can be cancelled within 24 hours for a full refund</li>
                            <li>Refunds will be processed within 5-7 business days</li>
                        </ul>
                    </div>
                </div>

                {/* Cancel Confirmation Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Booking?</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to cancel this booking? This action cannot be undone.
                                A refund of <span className="font-semibold">€{booking.totalAmount?.toFixed(2)}</span> will be processed within 5-7 business days.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    disabled={cancelling}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                                >
                                    Keep Booking
                                </button>
                                <button
                                    onClick={handleCancelBooking}
                                    disabled={cancelling}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {cancelling ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Cancelling...
                                        </>
                                    ) : (
                                        'Yes, Cancel'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingConfirmation;
