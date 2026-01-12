async function BuyTickets(BASE_URL, formData) {
  try {
    const response = await fetch(`${BASE_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Order successful', data);
      return data; // Return order data including orderId and priceBreakdown
    } else {
      console.error('Order failed');
      return null;
    }
  } catch (error) {
    console.error('Error occurred while ordering:', error);
    return null;
  }
}

export default BuyTickets;
