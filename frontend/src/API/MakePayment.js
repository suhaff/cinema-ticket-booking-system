async function MakePayment(BASE_URL, orderId, paymentDetails) {
  try {
    const response = await fetch(`${BASE_URL}/payment/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentDetails),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('Payment successful', data);
      return data;
    } else {
      console.error('Payment failed', data);
      return data; // Return error data
    }
  } catch (error) {
    console.error('Error occurred while processing payment:', error);
    return { success: false, error: 'Network error', message: error.message };
  }
}

export default MakePayment;
