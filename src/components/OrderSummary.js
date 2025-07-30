import React, { useState } from 'react';
import { ShoppingCart, CreditCard, Info, CheckCircle, AlertCircle } from 'lucide-react';

const OrderSummary = ({ orderItems, meals, onPlaceOrder, onPaymentSubmit }) => {
  const [transactionCode, setTransactionCode] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const meal = meals.find(m => m.id === item.meal);
      return total + (meal ? parseFloat(meal.price) * item.quantity : 0);
    }, 0);
  };

  const total = calculateTotal();
  const itemCount = orderItems.reduce((count, item) => count + item.quantity, 0);

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Call the parent function to create order via API
      const orderResponse = await onPlaceOrder();
      setCurrentOrderId(orderResponse.id);
      setShowPayment(true);
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!transactionCode.trim() || transactionCode.length < 8) {
      setError('Please enter a valid M-Pesa confirmation code.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Call the parent function to submit payment via API
      const message = await onPaymentSubmit(transactionCode, currentOrderId);
      
      // Clear form and show success
      setTransactionCode('');
      setShowPayment(false);
      setCurrentOrderId(null);
      
      // Show success message (handled by parent component)
      alert(message);
    } catch (err) {
      setError(err.message || 'Failed to submit payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (orderItems.length === 0) {
    return null;
  }

  // Styles (keeping your beautiful design)
  const summaryStyle = {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid #f1f5f9',
    marginTop: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const descriptionStyle = {
    color: '#64748b',
    fontSize: '0.875rem',
    marginBottom: '1.5rem',
    lineHeight: '1.5'
  };

  const itemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f1f5f9'
  };

  const itemNameStyle = {
    flex: 1,
    marginRight: '1rem'
  };

  const itemTitleStyle = {
    fontWeight: '500',
    color: '#1e293b',
    fontSize: '0.875rem'
  };

  const itemSubtitleStyle = {
    fontSize: '0.75rem',
    color: '#64748b',
    marginTop: '0.25rem'
  };

  const itemPriceStyle = {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: '0.875rem'
  };

  const totalStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
    borderTop: '2px solid #f1f5f9',
    marginTop: '0.75rem',
    fontWeight: '600',
    fontSize: '1.125rem',
    color: '#1e293b'
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#1e293b',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1rem',
    transition: 'all 0.2s ease',
    disabled: isLoading
  };

  const successButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#059669'
  };

  const errorMessageStyle = {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    border: '1px solid #fecaca'
  };

  const infoBoxStyle = {
    backgroundColor: '#f0f9ff',
    border: '1px solid #e0f2fe',
    borderRadius: '0.5rem',
    padding: '1rem',
    margin: '1rem 0'
  };

  const infoHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  };

  const infoTitleStyle = {
    fontWeight: '600',
    color: '#0369a1',
    fontSize: '0.875rem'
  };

  const infoTextStyle = {
    color: '#075985',
    fontSize: '0.8rem',
    lineHeight: '1.5'
  };

  const paymentSectionStyle = {
    marginTop: '1rem'
  };

  const paymentInstructionsStyle = {
    backgroundColor: '#f0fdf4',
    border: '1px solid #dcfce7',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1rem'
  };

  const paymentHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem'
  };

  const paymentTitleStyle = {
    fontWeight: '600',
    color: '#16a34a',
    fontSize: '0.875rem'
  };

  const paymentStepsStyle = {
    margin: '0',
    paddingLeft: '1.25rem',
    color: '#166534'
  };

  const paymentStepStyle = {
    marginBottom: '0.5rem',
    fontSize: '0.8rem',
    lineHeight: '1.4'
  };

  const codeStyle = {
    backgroundColor: '#f0fff4',
    padding: '0.125rem 0.375rem',
    borderRadius: '0.25rem',
    color: '#16a34a',
    fontWeight: '700',
    fontFamily: 'monospace'
  };

  const warningBoxStyle = {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    padding: '1rem',
    margin: '1rem 0'
  };

  const warningHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  };

  const warningTitleStyle = {
    fontWeight: '600',
    color: '#dc2626',
    fontSize: '0.875rem'
  };

  const warningTextStyle = {
    color: '#991b1b',
    fontSize: '0.8rem',
    lineHeight: '1.5'
  };

  const labelStyle = {
    display: 'block',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem',
    fontSize: '0.875rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    textTransform: 'uppercase',
    fontFamily: 'monospace',
    fontWeight: '600',
    backgroundColor: '#f9fafb',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const inputHintStyle = {
    fontSize: '0.75rem',
    color: '#64748b',
    marginTop: '0.5rem',
    fontStyle: 'italic'
  };

  const spinnerStyle = {
    width: '1.25rem',
    height: '1.25rem',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '0.5rem'
  };

  return (
    <div style={summaryStyle}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <h3 style={titleStyle}>
        <ShoppingCart size={20} />
        Order Summary & Checkout
      </h3>
      
      <div style={descriptionStyle}>
        You have selected <strong>{itemCount} items</strong> from our menu. 
        Please review your order and proceed with checkout when ready.
      </div>
      
      {/* Error Message */}
      {error && (
        <div style={errorMessageStyle}>
          {error}
        </div>
      )}
      
      {/* Order Items */}
      {orderItems.map(item => {
        const meal = meals.find(m => m.id === item.meal);
        if (!meal) return null;
        
        return (
          <div key={item.meal} style={itemStyle}>
            <div style={itemNameStyle}>
              <div style={itemTitleStyle}>
                {meal.name} × {item.quantity}
              </div>
              <div style={itemSubtitleStyle}>
                {meal.category_name} • KSh {parseFloat(meal.price).toFixed(0)} each
              </div>
            </div>
            <div style={itemPriceStyle}>
              KSh {(parseFloat(meal.price) * item.quantity).toFixed(0)}
            </div>
          </div>
        );
      })}
      
      {/* Total */}
      <div style={totalStyle}>
        <div>
          <strong>Total Amount</strong>
          <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '400' }}>
            Including all applicable charges
          </div>
        </div>
        <div><strong>KSh {total.toFixed(0)}</strong></div>
      </div>

      {!showPayment ? (
        <>
          <div style={infoBoxStyle}>
            <div style={infoHeaderStyle}>
              <Info size={16} style={{ color: '#0284c7' }} />
              <strong style={infoTitleStyle}>Order Processing Information</strong>
            </div>
            <div style={infoTextStyle}>
              By placing this order, you confirm that all selected items and quantities are correct. 
              Our kitchen team will begin preparation immediately upon payment confirmation.
            </div>
          </div>
          <button 
            style={{
              ...buttonStyle,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            onClick={handlePlaceOrder}
            disabled={isLoading}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#374151';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#1e293b';
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={spinnerStyle}></div>
                Processing...
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                Proceed to Secure Payment
              </>
            )}
          </button>
        </>
      ) : (
        <div style={paymentSectionStyle}>
          <h4 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#1e293b',
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            <CreditCard size={20} />
            Secure M-Pesa Payment Processing
          </h4>
          
          <div style={paymentInstructionsStyle}>
            <div style={paymentHeaderStyle}>
              <CheckCircle size={16} style={{ color: '#16a34a' }} />
              <strong style={paymentTitleStyle}>
                Complete Your Payment in 3 Easy Steps:
              </strong>
            </div>
            <ol style={paymentStepsStyle}>
              <li style={paymentStepStyle}>
                <strong>Go to M-Pesa on your phone</strong> and select "Lipa na M-Pesa"
              </li>
              <li style={paymentStepStyle}>
                <strong>Enter Business Number:</strong> <span style={codeStyle}>0712345678</span>
              </li>
              <li style={paymentStepStyle}>
                <strong>Enter Amount:</strong> <span style={codeStyle}>KSh {total.toFixed(0)}</span>
              </li>
              <li style={paymentStepStyle}>
                <strong>Complete the transaction</strong> and copy the confirmation code below
              </li>
            </ol>
          </div>

          <div style={warningBoxStyle}>
            <div style={warningHeaderStyle}>
              <AlertCircle size={16} style={{ color: '#dc2626' }} />
              <strong style={warningTitleStyle}>Important Payment Notice</strong>
            </div>
            <div style={warningTextStyle}>
              Please ensure you complete the M-Pesa transaction before entering the confirmation code. 
              Your order will only be processed after successful payment verification by our kitchen administrator.
            </div>
          </div>

          <label style={labelStyle}>
            M-Pesa Transaction Confirmation Code:
            <input
              type="text"
              value={transactionCode}
              onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
              placeholder="Enter your M-Pesa confirmation code (e.g., QLK8H2J5X3)"
              style={inputStyle}
              disabled={isLoading}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.backgroundColor = 'white';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div style={inputHintStyle}>
              Example format: QLK8H2J5X3 (received via SMS after payment)
            </div>
          </label>
          
          <button 
            style={{
              ...successButtonStyle,
              opacity: (!transactionCode.trim() || transactionCode.length < 8 || isLoading) ? 0.6 : 1,
              cursor: (!transactionCode.trim() || transactionCode.length < 8 || isLoading) ? 'not-allowed' : 'pointer'
            }}
            onClick={handlePaymentSubmit}
            disabled={!transactionCode.trim() || transactionCode.length < 8 || isLoading}
            onMouseEnter={(e) => {
              if (!e.target.disabled) {
                e.target.style.backgroundColor = '#047857';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.disabled) {
                e.target.style.backgroundColor = '#059669';
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={spinnerStyle}></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Submit Payment & Confirm Order
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;