import React, { useState } from 'react';
import { ShoppingCart, CreditCard, Info, CheckCircle, AlertCircle } from 'lucide-react';

const OrderSummary = ({ orderItems, meals, onPlaceOrder, onPaymentSubmit }) => {
  const [transactionCode, setTransactionCode] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const meal = meals.find(m => m.id === item.mealId);
      return total + (meal ? meal.price * item.quantity : 0);
    }, 0);
  };

  const total = calculateTotal();
  const itemCount = orderItems.reduce((count, item) => count + item.quantity, 0);

  const handlePlaceOrder = () => {
    onPlaceOrder();
    setShowPayment(true);
  };

  const handlePaymentSubmit = () => {
    if (transactionCode.trim()) {
      onPaymentSubmit(transactionCode);
      setTransactionCode('');
      setShowPayment(false);
    }
  };

  if (orderItems.length === 0) {
    return null;
  }

  return (
    <div className="order-summary">
      <h3>
        <ShoppingCart size={24} style={{ marginRight: '0.75rem', verticalAlign: 'middle' }} />
        Your Order Summary & Checkout
      </h3>
      
      <div className="order-summary-description">
        You have selected <strong>{itemCount} items</strong> from our premium menu. 
        Please review your order details below and proceed with secure checkout when ready.
      </div>
      
      {orderItems.map(item => {
        const meal = meals.find(m => m.id === item.mealId);
        if (!meal) return null;
        
        return (
          <div key={item.mealId} className="order-item">
            <div className="order-item-name">
              <strong>{meal.name}</strong> × {item.quantity}
              <div style={{ fontSize: '0.85rem', color: '#718096', fontWeight: '500' }}>
                {meal.category} • KSh {meal.price} each
              </div>
            </div>
            <div className="order-item-price">KSh {meal.price * item.quantity}</div>
          </div>
        );
      })}
      
      <div className="order-item">
        <div>
          <strong>Total Amount</strong>
          <div style={{ fontSize: '0.9rem', color: '#718096', fontWeight: '500' }}>
            Including all applicable charges
          </div>
        </div>
        <div><strong>KSh {total}</strong></div>
      </div>

      {!showPayment ? (
        <>
          <div style={{
            background: 'rgba(102, 126, 234, 0.05)',
            padding: '1rem',
            borderRadius: '10px',
            margin: '1rem 0',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Info size={16} style={{ color: '#667eea' }} />
              <strong style={{ color: '#4a5568', fontSize: '0.9rem' }}>Order Processing Information</strong>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#718096', lineHeight: '1.5' }}>
              By placing this order, you confirm that all selected items and quantities are correct. 
              Our kitchen team will begin preparation immediately upon payment confirmation.
            </div>
          </div>
          <div className="order-actions">
            <button className="order-btn primary" onClick={handlePlaceOrder}>
              <ShoppingCart size={20} />
              Proceed to Secure Payment
            </button>
          </div>
        </>
      ) : (
        <div className="payment-section">
          <h4>
            <CreditCard size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Secure M-Pesa Payment Processing
          </h4>
          
          <div className="payment-instructions">
            <h5>
              <CheckCircle size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Complete Your Payment in 3 Easy Steps:
            </h5>
            <ol>
              <li><strong>Go to M-Pesa on your phone</strong> and select "Lipa na M-Pesa"</li>
              <li><strong>Enter Business Number:</strong> <code style={{ background: '#f0fff4', padding: '2px 6px', borderRadius: '4px', color: '#38a169', fontWeight: '700' }}>0712345678</code></li>
              <li><strong>Enter Amount:</strong> <code style={{ background: '#f0fff4', padding: '2px 6px', borderRadius: '4px', color: '#38a169', fontWeight: '700' }}>KSh {total}</code></li>
              <li><strong>Complete the transaction</strong> and copy the confirmation code below</li>
            </ol>
          </div>

          <div style={{
            background: 'rgba(229, 62, 62, 0.05)',
            padding: '1rem',
            borderRadius: '10px',
            margin: '1rem 0',
            border: '1px solid rgba(229, 62, 62, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <AlertCircle size={16} style={{ color: '#e53e3e' }} />
              <strong style={{ color: '#e53e3e', fontSize: '0.9rem' }}>Important Payment Notice</strong>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#721c24', lineHeight: '1.5' }}>
              Please ensure you complete the M-Pesa transaction before entering the confirmation code. 
              Your order will only be processed after successful payment verification by our kitchen administrator.
            </div>
          </div>

          <label>
            <strong>M-Pesa Transaction Confirmation Code:</strong>
            <input
              type="text"
              value={transactionCode}
              onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
              placeholder="Enter your M-Pesa confirmation code (e.g., QLK8H2J5X3)"
              style={{ textTransform: 'uppercase' }}
            />
            <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.5rem', fontStyle: 'italic' }}>
              Example format: QLK8H2J5X3 (received via SMS after payment)
            </div>
          </label>
          <div className="order-actions">
            <button 
              className="order-btn success" 
              onClick={handlePaymentSubmit}
              disabled={!transactionCode.trim() || transactionCode.length < 8}
            >
              <CheckCircle size={20} />
              Submit Payment & Confirm Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;