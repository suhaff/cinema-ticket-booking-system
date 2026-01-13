const ValidatePromoCode = async (promoCode) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/promo-code/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: promoCode }),
        });

        const data = await response.json();
        
        if (response.ok && data.valid) {
            return {
                success: true,
                data: data.promoCode  // Extract the promoCode object from response
            };
        } else {
            return {
                success: false,
                message: data.message || 'Invalid promo code'
            };
        }
    } catch (error) {
        console.error('Error validating promo code:', error);
        return {
            success: false,
            message: 'Failed to validate promo code. Please try again.'
        };
    }
};

export default ValidatePromoCode;
