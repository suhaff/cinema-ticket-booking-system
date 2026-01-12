const CancelBooking = async (BASE_URL, orderId) => {
    try {
        const response = await fetch(`${BASE_URL}/order/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok && data.success) {
            return {
                success: true,
                message: data.message,
                refundAmount: data.refundAmount
            };
        } else {
            return {
                success: false,
                message: data.message || 'Failed to cancel booking'
            };
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
};

export default CancelBooking;
