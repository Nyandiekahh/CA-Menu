import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import MenuCard from '../components/MenuCard';
import OrderSummary from '../components/OrderSummary';
import { mockMeals } from '../data/mockData';

const CustomerDashboard = ({ user }) => {
  const [meals] = useState(mockMeals);
  const [orderItems, setOrderItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleQuantityChange = (mealId, newQuantity) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(item => item.mealId === mealId);
      
      if (newQuantity === 0) {
        return prevItems.filter(item => item.mealId !== mealId);
      }
      
      if (existingItem) {
        return prevItems.map(item =>
          item.mealId === mealId
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        return [...prevItems, { mealId, quantity: newQuantity }];
      }
    });
  };

  const getItemQuantity = (mealId) => {
    const item = orderItems.find(item => item.mealId === mealId);
    return item ? item.quantity : 0;
  };

  const handlePlaceOrder = () => {
    console.log('Order placed:', orderItems);
    // Here you would normally send the order to the backend
    alert('Order placed successfully! You can now proceed with payment.');
  };

  const handlePaymentSubmit = (transactionCode) => {
    console.log('Payment submitted:', transactionCode);
    // Here you would normally send payment info to backend
    alert('Payment information submitted! Kitchen administrator will verify and confirm your order.');
    setOrderPlaced(true);
    setOrderItems([]);
  };

  const availableMeals = meals.filter(meal => meal.available);
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Today's Menu</h1>
        <p className="dashboard-subtitle">{currentDate} • CA Kenya Staff Cafeteria</p>
      </div>
      
      {orderPlaced && (
        <div className="success-message">
          <CheckCircle size={20} />
          Your order has been submitted successfully! You'll receive confirmation once payment is verified.
        </div>
      )}

      {availableMeals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🍽️</div>
          <h3>No meals available today</h3>
          <p>The kitchen menu hasn't been set for today. Please check back later or contact the kitchen administrator.</p>
        </div>
      ) : (
        <div className="meals-grid">
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
  );
};

export default CustomerDashboard;