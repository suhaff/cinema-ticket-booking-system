import React, { useState } from 'react';

function PaymentModal({ isOpen, onClose, onConfirm, priceBreakdown }) {
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  // Validation function for card expiry
  const isCardExpired = (expiryDate) => {
    if (!expiryDate || expiryDate.length !== 5) return false; // Format: MM/YY
    
    const [month, year] = expiryDate.split('/');
    const expireMonth = parseInt(month);
    const expireYear = parseInt(year);
    
    if (isNaN(expireMonth) || isNaN(expireYear)) return false;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Last 2 digits
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    
    // If year is in the past
    if (expireYear < currentYear) return true;
    
    // If year is current but month has passed
    if (expireYear === currentYear && expireMonth < currentMonth) return true;
    
    return false;
  };

  // Validation function for CVV
  const isCVVValid = (cvvValue) => {
    // CVV must be 3 or 4 digits
    return /^\d{3,4}$/.test(cvvValue);
  };

  // Validation function for card number
  const isCardNumberValid = (cardNum) => {
    // Remove spaces and check if it's 16 digits
    const cleaned = cardNum.replace(/\s/g, '');
    return /^\d{16}$/.test(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validate payment method specific fields
    if (paymentMethod === 'Card') {
      // Validate card number
      if (!isCardNumberValid(cardNumber)) {
        setValidationError('Invalid card number. Please enter a valid 16-digit card number.');
        return;
      }

      // Validate cardholder name
      if (!cardName.trim()) {
        setValidationError('Cardholder name is required.');
        return;
      }

      // Validate expiry date
      if (!expiryDate || expiryDate.length !== 5) {
        setValidationError('Expiry date must be in MM/YY format.');
        return;
      }

      if (isCardExpired(expiryDate)) {
        setValidationError('Card expired. Please use a valid card.');
        return;
      }

      // Validate CVV
      if (!isCVVValid(cvv)) {
        setValidationError('Invalid CVV. CVV must be 3 or 4 digits.');
        return;
      }
    }

    setIsProcessing(true);

    const paymentDetails = {
      paymentMethod,
      // Add the total amount here so the backend can verify it
      amount: priceBreakdown?.total,
      cardNumber: paymentMethod === 'Card' ? cardNumber : undefined,
      cardName: paymentMethod === 'Card' ? cardName : undefined,
      expiryDate: paymentMethod === 'Card' ? expiryDate : undefined,
      cvv: paymentMethod === 'Card' ? cvv : undefined,
    };

    await onConfirm(paymentDetails);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>

        {/* Price Summary */}
        <div className="bg-gray-100 p-4 rounded mb-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>€{priceBreakdown?.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Booking Fee:</span>
            <span>€{priceBreakdown?.bookingFee?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax:</span>
            <span>€{priceBreakdown?.tax?.toFixed(2) || '0.00'}</span>
          </div>
          {priceBreakdown?.discount > 0 && (
            <div className="flex justify-between mb-2 text-green-600">
              <span>Discount:</span>
              <span>-€{priceBreakdown?.discount?.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Total:</span>
            <span>€{priceBreakdown?.total?.toFixed(2) || '0.00'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Validation Error Display */}
          {validationError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="text-sm font-semibold">{validationError}</p>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="Card">Credit/Debit Card</option>
              <option value="E-Wallet">E-Wallet (PayPal, Google Pay)</option>
              <option value="Cash">Cash (Pay at Counter)</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Card Payment Fields */}
          {paymentMethod === 'Card' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                  maxLength="19"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Test card: 4111 1111 1111 1111</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setExpiryDate(value);
                    }}
                    maxLength="5"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    maxLength="4"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">3 or 4 digits on back of card</p>
                </div>
              </div>
            </>
          )}

          {/* E-Wallet Info */}
          {paymentMethod === 'E-Wallet' && (
            <div className="mb-4 p-4 bg-blue-50 rounded">
              <p className="text-sm text-blue-800">
                You will be redirected to complete payment with your selected e-wallet provider.
              </p>
            </div>
          )}

          {/* Cash Payment Info */}
          {paymentMethod === 'Cash' && (
            <div className="mb-4 p-4 bg-yellow-50 rounded">
              <p className="text-sm text-yellow-800">
                Please collect your ticket at the cinema counter before the show starts.
                Bring this booking confirmation.
              </p>
            </div>
          )}

          {/* Bank Transfer Info */}
          {paymentMethod === 'Bank Transfer' && (
            <div className="mb-4 p-4 bg-green-50 rounded">
              <p className="text-sm text-green-800">
                Transfer details will be sent to your email. Payment must be completed within 24 hours.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : `Pay €${priceBreakdown?.total?.toFixed(2) || '0.00'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentModal;
