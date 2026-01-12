const GetBookingHistory = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/order/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch booking history: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.success) {
            return {
                success: true,
                bookings: data.bookings || [],
                totalBookings: data.totalBookings || 0,
            };
        } else {
            return {
                success: false,
                message: data.message || "Failed to retrieve booking history",
                bookings: [],
            };
        }
    } catch (error) {
        console.error("Error fetching booking history:", error);
        return {
            success: false,
            message: error.message || "An error occurred while fetching booking history",
            bookings: [],
        };
    }
};

export default GetBookingHistory;
