import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import MenuCard from '../components/MenuCard';
import OrderSummary from '../components/OrderSummary';
import ApiService from '../services/api';

const CustomerDashboard = ({ user }) => {
  const [meals, setMeals] = useState([]);

  const [orderItems, setOrderItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch meals and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Fetch meals from Django API
        const mealsResponse = await ApiService.getMeals();
        setMeals(mealsResponse.results || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load menu. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuantityChange = (mealId, newQuantity) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(item => item.meal === mealId);
      
      if (newQuantity === 0) {
        return prevItems.filter(item => item.meal !== mealId);
      }
      
      if (existingItem) {
        return prevItems.map(item =>
          item.meal === mealId
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        return [...prevItems, { meal: mealId, quantity: newQuantity }];
      }
    });
  };

  const getItemQuantity = (mealId) => {
    const item = orderItems.find(item => item.meal === mealId);
    return item ? item.quantity : 0;
  };

  const handlePlaceOrder = async () => {
    try {
      setError('');
      
      // Prepare order data for Django API
      const orderData = {
        items: orderItems,
        notes: 'Order placed via web portal'
      };
      
      const response = await ApiService.createOrder(orderData);
      console.log('Order created:', response);
      
      // Order created successfully, proceed to payment
      return response;
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to place order. Please try again.');
      throw err;
    }
  };

  const handlePaymentSubmit = async (transactionCode, orderId) => {
    try {
      setError('');
      
      // Submit payment to Django API
      const paymentData = {
        order: orderId,
        transaction_code: transactionCode,
        amount_paid: calculateTotal(),
        phone_number: user.phone_number || ''
      };
      
      await ApiService.createPayment(paymentData);
      
      setOrderPlaced(true);
      setOrderItems([]);
      
      return 'Payment submitted successfully! Kitchen administrator will verify and confirm your order.';
    } catch (err) {
      console.error('Error submitting payment:', err);
      throw new Error('Failed to submit payment. Please try again.');
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const meal = meals.find(m => m.id === item.meal);
      return total + (meal ? parseFloat(meal.price) * item.quantity : 0);
    }, 0);
  };

  // Filter available meals
  const availableMeals = meals.filter(meal => meal.is_available);
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Styles (keeping your beautiful design)
  const containerStyle = {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.025em'
  };

  const subtitleStyle = {
    color: '#64748b',
    fontSize: '1.125rem',
    margin: 0,
    fontWeight: '500'
  };

  const descriptionStyle = {
    color: '#475569',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginTop: '1rem',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    border: '1px solid #f1f5f9'
  };

  const successMessageStyle = {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    fontWeight: '500',
    fontSize: '1rem',
    border: '1px solid #bbf7d0'
  };

  const errorMessageStyle = {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    marginBottom: '2rem',
    border: '1px solid #fecaca'
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#64748b'
  };

  const spinnerStyle = {
    width: '3rem',
    height: '3rem',
    border: '4px solid #f1f5f9',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    backgroundColor: 'white',
    padding: '4rem 2rem',
    borderRadius: '1rem',
    border: '2px dashed #d1d5db',
    margin: '2rem 0'
  };

  const emptyIconStyle = {
    fontSize: '4rem',
    marginBottom: '1.5rem',
    opacity: 0.6
  };

  const emptyTitleStyle = {
    color: '#374151',
    fontWeight: '600',
    marginBottom: '1rem',
    fontSize: '1.25rem'
  };

  const emptyTextStyle = {
    lineHeight: '1.6',
    maxWidth: '400px',
    margin: '0 auto',
    color: '#64748b'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  };

  // Mobile responsive styles
  const mobileStyles = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .customer-dashboard-title {
        font-size: 2rem !important;
      }
      .customer-dashboard-subtitle {
        font-size: 1rem !important;
      }
      .customer-dashboard-grid {
        grid-template-columns: 1fr !important;
        gap: 1rem !important;
      }
      .customer-dashboard-content {
        padding: 1rem !important;
      }
    }
    
    @media (max-width: 480px) {
      .customer-dashboard-title {
        font-size: 1.75rem !important;
      }
      .customer-dashboard-description {
        padding: 1rem !important;
        font-size: 0.875rem !important;
      }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{mobileStyles}</style>
      
      <div className="customer-dashboard-content" style={contentStyle}>
        <div style={headerStyle}>
          <h1 className="customer-dashboard-title" style={titleStyle}>
            Today's Menu
          </h1>
          <p className="customer-dashboard-subtitle" style={subtitleStyle}>
            {currentDate} • CA Kenya Staff Cafeteria
          </p>
          <div style={descriptionStyle}>
            Welcome to the CA Kenya staff meal ordering system. Browse our carefully curated menu, 
            select your preferred items, and place your order for pickup. All meals are freshly prepared 
            by our kitchen team using quality ingredients.
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div style={errorMessageStyle}>
            {error}
          </div>
        )}

        {/* Success Message */}
        {orderPlaced && (
          <div style={successMessageStyle}>
            <CheckCircle size={20} />
            Your order has been submitted successfully! You'll receive confirmation once payment is verified.
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div style={loadingStyle}>
            <div style={spinnerStyle}></div>
            <p>Loading today's menu...</p>
          </div>
        ) : availableMeals.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={emptyIconStyle}>🍽️</div>
            <h3 style={emptyTitleStyle}>No meals available today</h3>
            <p style={emptyTextStyle}>
              The kitchen menu hasn't been set for today. Please check back later or contact the kitchen administrator.
            </p>
          </div>
        ) : (
          <div className="customer-dashboard-grid" style={gridStyle}>
            {availableMeals.map(meal => (
              <MenuCard
                key={meal.id}
                meal={meal}
                quantity={getItemQuantity(meal.id)}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
        )}

        <OrderSummary
          orderItems={orderItems}
          meals={meals}
          onPlaceOrder={handlePlaceOrder}
          onPaymentSubmit={handlePaymentSubmit}
        />
      </div>
    </div>
  );
};

export default CustomerDashboard;