import React, { useState } from 'react';
import { Plus, Check, X, Clock, DollarSign } from 'lucide-react';
import MenuCard from '../components/MenuCard';
import { mockMeals, mockOrders } from '../data/mockData';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('menu');
  const [meals, setMeals] = useState(mockMeals);
  const [orders, setOrders] = useState(mockOrders);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [mealForm, setMealForm] = useState({
    name: '',
    price: '',
    image: '',
    category: 'Main Course',
    description: '',
    maxPerPerson: 1,
    units: '',
    restrictions: []
  });

  const handleAddMeal = () => {
    const newMeal = {
      id: meals.length + 1,
      ...mealForm,
      price: parseFloat(mealForm.price),
      maxPerPerson: parseInt(mealForm.maxPerPerson),
      units: mealForm.units ? parseInt(mealForm.units) : null,
      available: true,
      restrictions: []
    };
    setMeals([...meals, newMeal]);
    resetForm();
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setMealForm({
      name: meal.name,
      price: meal.price.toString(),
      image: meal.image,
      category: meal.category,
      description: meal.description,
      maxPerPerson: meal.maxPerPerson,
      units: meal.units ? meal.units.toString() : '',
      restrictions: meal.restrictions
    });
    setShowAddMeal(true);
  };

  const handleUpdateMeal = () => {
    const updatedMeal = {
      ...editingMeal,
      ...mealForm,
      price: parseFloat(mealForm.price),
      maxPerPerson: parseInt(mealForm.maxPerPerson),
      units: mealForm.units ? parseInt(mealForm.units) : null
    };
    setMeals(meals.map(m => m.id === editingMeal.id ? updatedMeal : m));
    resetForm();
  };

  const resetForm = () => {
    setMealForm({
      name: '',
      price: '',
      image: '',
      category: 'Main Course',
      description: '',
      maxPerPerson: 1,
      units: '',
      restrictions: []
    });
    setShowAddMeal(false);
    setEditingMeal(null);
  };

  const handleDeleteMeal = (mealId) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      setMeals(meals.filter(m => m.id !== mealId));
    }
  };

  const handleToggleAvailability = (mealId) => {
    setMeals(meals.map(m => 
      m.id === mealId ? { ...m, available: !m.available } : m
    ));
  };

  const handleConfirmPayment = (orderId) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, confirmed: true, paymentStatus: 'paid' } : o
    ));
  };

  const handleFormChange = (e) => {
    setMealForm({
      ...mealForm,
      [e.target.name]: e.target.value
    });
  };

  const renderMealForm = () => (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.95)', 
      padding: '2rem', 
      borderRadius: '15px', 
      marginBottom: '2rem' 
    }}>
      <h3>{editingMeal ? 'Edit Meal' : 'Add New Meal'}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group">
          <label>Meal Name</label>
          <input
            type="text"
            name="name"
            value={mealForm.name}
            onChange={handleFormChange}
            placeholder="Enter meal name"
          />
        </div>
        <div className="form-group">
          <label>Price (KSh)</label>
          <input
            type="number"
            name="price"
            value={mealForm.price}
            onChange={handleFormChange}
            placeholder="Enter price"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={mealForm.category} onChange={handleFormChange}>
            <option value="Main Course">Main Course</option>
            <option value="Sides">Sides</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverages">Beverages</option>
          </select>
        </div>
        <div className="form-group">
          <label>Max Per Person</label>
          <input
            type="number"
            name="maxPerPerson"
            value={mealForm.maxPerPerson}
            onChange={handleFormChange}
            min="1"
          />
        </div>
        <div className="form-group">
          <label>Available Units (leave empty for unlimited)</label>
          <input
            type="number"
            name="units"
            value={mealForm.units}
            onChange={handleFormChange}
            placeholder="Enter units or leave empty"
          />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            name="image"
            value={mealForm.image}
            onChange={handleFormChange}
            placeholder="Enter image URL"
          />
        </div>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={mealForm.description}
          onChange={handleFormChange}
          placeholder="Enter meal description"
          rows="3"
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button 
          className="card-btn success" 
          onClick={editingMeal ? handleUpdateMeal : handleAddMeal}
          disabled={!mealForm.name || !mealForm.price}
        >
          {editingMeal ? 'Update Meal' : 'Add Meal'}
        </button>
        <button className="card-btn secondary" onClick={resetForm}>
          Cancel
        </button>
      </div>
    </div>
  );

  const renderMenuManagement = () => (
    <>
      <button className="add-meal-btn" onClick={() => setShowAddMeal(!showAddMeal)}>
        <Plus size={20} />
        Add New Meal
      </button>
      
      {showAddMeal && renderMealForm()}
      
      <div className="meals-grid">
        {meals.map(meal => (
          <MenuCard
            key={meal.id}
            meal={meal}
            isAdmin={true}
            onEdit={handleEditMeal}
            onDelete={handleDeleteMeal}
            onToggleAvailability={handleToggleAvailability}
          />
        ))}
      </div>
    </>
  );

  const renderOrders = () => (
    <div className="orders-list">
      {orders.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: 'white', 
          fontSize: '1.2rem',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '15px'
        }}>
          No orders yet today.
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <div className="order-customer">{order.customerName}</div>
                <div className="order-time">
                  {new Date(order.orderTime).toLocaleString()}
                </div>
              </div>
              <div className={`order-status ${order.paymentStatus}`}>
                {order.confirmed ? 'Confirmed' : order.paymentStatus}
              </div>
            </div>
            
            <div className="order-items">
              <h4>Items:</h4>
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>KSh {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="order-total">
              Total: KSh {order.total}
            </div>

            {order.paymentStatus === 'paid' && order.transactionCode && (
              <div className="payment-section">
                <strong>Transaction Code:</strong> {order.transactionCode}
                {!order.confirmed && (
                  <div style={{ marginTop: '1rem' }}>
                    <button 
                      className="card-btn success"
                      onClick={() => handleConfirmPayment(order.id)}
                    >
                      <Check size={16} />
                      Confirm Payment
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          <DollarSign size={20} />
          Menu Management
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Clock size={20} />
          Orders ({orders.length})
        </button>
      </div>

      {activeTab === 'menu' ? renderMenuManagement() : renderOrders()}
    </div>
  );
};

export default AdminDashboard;