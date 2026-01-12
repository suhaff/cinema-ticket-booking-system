async function SendBookingEmail(baseUrl, orderId, email) {
    try {
        const response = await fetch(`${baseUrl}/booking/${orderId}/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Failed to send email:', data);
            return { success: false, message: data.message || 'Failed to send email' };
        }

        console.log('Email sent successfully:', data);
        return data;
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

export default SendBookingEmail;
