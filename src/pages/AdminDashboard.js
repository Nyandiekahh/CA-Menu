import React, { useState, useEffect } from 'react';
import { Plus, Check, Clock, ChefHat, ShoppingBag, AlertCircle, Loader2, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const AdminDashboard = () => {
  // API Configuration
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';
  
  // State management
  const [activeTab, setActiveTab] = useState('menu');
  const [meals, setMeals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [mealForm, setMealForm] = useState({
    name: '',
    price: '',
    image: null,
    category: '',
    description: '',
    max_per_person: 1,
    units_available: '',
    is_available: true
  });

  // Get auth token from localStorage - FIXED: Use correct key
  const getAuthToken = () => {
    return localStorage.getItem('ca_portal_token');
  };

  // API headers with authentication
  const getHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Token ${token}` : '',
    };
  };

  // API call helper
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: getHeaders(),
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  };

  // Fetch dashboard data
  const fetchDashboardStats = async () => {
    try {
      const stats = await apiCall('/admin/dashboard-stats/');
      setDashboardStats(stats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  // Fetch meals
  const fetchMeals = async () => {
    try {
      const mealsData = await apiCall('/admin/meals/');
      setMeals(mealsData.results || mealsData);
    } catch (error) {
      setError('Failed to fetch meals');
      console.error('Failed to fetch meals:', error);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const ordersData = await apiCall('/admin/orders/');
      setOrders(ordersData.results || ordersData);
    } catch (error) {
      setError('Failed to fetch orders');
      console.error('Failed to fetch orders:', error);
    }
  };

  // Fetch categories - FIXED: Use correct endpoint
  const fetchCategories = async () => {
    try {
      const categoriesData = await apiCall('/admin/categories/');
      setCategories(categoriesData.results || categoriesData);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchDashboardStats(),
          fetchMeals(),
          fetchOrders(),
          fetchCategories()
        ]);
      } catch (error) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle meal creation - FIXED: Proper FormData handling
  const handleAddMeal = async () => {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      formData.append('name', mealForm.name);
      formData.append('price', mealForm.price);
      formData.append('category', mealForm.category);
      formData.append('description', mealForm.description);
      formData.append('max_per_person', mealForm.max_per_person);
      formData.append('is_available', mealForm.is_available);
      
      if (mealForm.units_available) {
        formData.append('units_available', mealForm.units_available);
      }
      
      if (mealForm.image) {
        formData.append('image', mealForm.image);
      }

      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/meals/`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Token ${token}` : '',
          // Don't set Content-Type for FormData - let browser set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create meal: ${errorData}`);
      }

      await fetchMeals();
      resetForm();
      setError(null);
    } catch (error) {
      setError('Failed to add meal: ' + error.message);
      console.error('Failed to add meal:', error);
    }
  };

  // Handle meal update - FIXED: Proper FormData handling
  const handleUpdateMeal = async () => {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      formData.append('name', mealForm.name);
      formData.append('price', mealForm.price);
      formData.append('category', mealForm.category);
      formData.append('description', mealForm.description);
      formData.append('max_per_person', mealForm.max_per_person);
      formData.append('is_available', mealForm.is_available);
      
      if (mealForm.units_available) {
        formData.append('units_available', mealForm.units_available);
      }
      
      if (mealForm.image) {
        formData.append('image', mealForm.image);
      }

      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/meals/${editingMeal.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': token ? `Token ${token}` : '',
          // Don't set Content-Type for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to update meal: ${errorData}`);
      }

      await fetchMeals();
      resetForm();
      setError(null);
    } catch (error) {
      setError('Failed to update meal: ' + error.message);
      console.error('Failed to update meal:', error);
    }
  };

  // Handle meal deletion
  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/meals/${mealId}/`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete meal');
      }

      await fetchMeals();
      setError(null);
    } catch (error) {
      setError('Failed to delete meal');
      console.error('Failed to delete meal:', error);
    }
  };

  // Handle availability toggle
  const handleToggleAvailability = async (meal) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/meals/${meal.id}/`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          is_available: !meal.is_available
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle availability');
      }

      await fetchMeals();
      setError(null);
    } catch (error) {
      setError('Failed to toggle meal availability');
      console.error('Failed to toggle availability:', error);
    }
  };

  // Handle payment confirmation
  const handleConfirmPayment = async (order) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/payments/${order.payment_info.id}/`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          is_verified: true,
          verification_notes: 'Payment verified by admin'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm payment');
      }

      await fetchOrders();
      await fetchDashboardStats();
      setError(null);
    } catch (error) {
      setError('Failed to confirm payment');
      console.error('Failed to confirm payment:', error);
    }
  };

  // Form handling
  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setMealForm({
      name: meal.name,
      price: meal.price.toString(),
      image: null,
      category: meal.category,
      description: meal.description,
      max_per_person: meal.max_per_person,
      units_available: meal.units_available ? meal.units_available.toString() : '',
      is_available: meal.is_available
    });
    setShowAddMeal(true);
  };

  const resetForm = () => {
    setMealForm({
      name: '',
      price: '',
      image: null,
      category: '',
      description: '',
      max_per_person: 1,
      units_available: '',
      is_available: true
    });
    setShowAddMeal(false);
    setEditingMeal(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setMealForm(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={48} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#059669' }} />
          <p style={{ color: '#64748b', fontSize: '1.125rem' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid #fee2e2',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <AlertCircle size={48} style={{ color: '#dc2626', margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>Error Loading Dashboard</h3>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Styles
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

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 2rem 0',
    textAlign: 'center',
    letterSpacing: '-0.025em'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const statCardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    border: '1px solid #f1f5f9',
    textAlign: 'center'
  };

  const statValueStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#059669',
    marginBottom: '0.5rem'
  };

  const statLabelStyle = {
    color: '#64748b',
    fontSize: '0.875rem',
    fontWeight: '500'
  };

  const tabsStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    backgroundColor: 'white',
    padding: '0.5rem',
    borderRadius: '0.75rem',
    border: '1px solid #f1f5f9'
  };

  const tabStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flex: 1,
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    color: '#64748b'
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#1e293b',
    color: 'white'
  };

  const mealCardStyle = {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid #f1f5f9',
    transition: 'all 0.2s ease'
  };

  const orderCardStyle = {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid #f1f5f9',
    marginBottom: '1rem'
  };

  // Render statistics cards
  const renderStatsCards = () => (
    <div style={statsGridStyle}>
      <div style={statCardStyle}>
        <div style={statValueStyle}>{dashboardStats.total_orders_today || 0}</div>
        <div style={statLabelStyle}>Orders Today</div>
      </div>
      <div style={statCardStyle}>
        <div style={statValueStyle}>KSh {dashboardStats.total_revenue_today || 0}</div>
        <div style={statLabelStyle}>Revenue Today</div>
      </div>
      <div style={statCardStyle}>
        <div style={statValueStyle}>{dashboardStats.pending_payments || 0}</div>
        <div style={statLabelStyle}>Pending Payments</div>
      </div>
      <div style={statCardStyle}>
        <div style={statValueStyle}>{dashboardStats.active_meals || 0}</div>
        <div style={statLabelStyle}>Active Meals</div>
      </div>
    </div>
  );

  // Render meal form
  const renderMealForm = () => (
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '1rem',
      marginBottom: '2rem',
      border: '1px solid #f1f5f9'
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '1.5rem'
      }}>
        {editingMeal ? 'Edit Meal' : 'Add New Meal'}
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Meal Name
          </label>
          <input
            type="text"
            name="name"
            value={mealForm.name}
            onChange={handleFormChange}
            placeholder="Enter meal name"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              outline: 'none',
              backgroundColor: '#f9fafb',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Price (KSh)
          </label>
          <input
            type="number"
            name="price"
            value={mealForm.price}
            onChange={handleFormChange}
            placeholder="Enter price"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              outline: 'none',
              backgroundColor: '#f9fafb',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Category
          </label>
          <select
            name="category"
            value={mealForm.category}
            onChange={handleFormChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              outline: 'none',
              backgroundColor: '#f9fafb',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Max Per Person
          </label>
          <input
            type="number"
            name="max_per_person"
            value={mealForm.max_per_person}
            onChange={handleFormChange}
            min="1"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              outline: 'none',
              backgroundColor: '#f9fafb',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Available Units (optional)
          </label>
          <input
            type="number"
            name="units_available"
            value={mealForm.units_available}
            onChange={handleFormChange}
            placeholder="Leave empty for unlimited"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              outline: 'none',
              backgroundColor: '#f9fafb',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFormChange}
            accept="image/*"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              outline: 'none',
              backgroundColor: '#f9fafb',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Description
        </label>
        <textarea
          name="description"
          value={mealForm.description}
          onChange={handleFormChange}
          placeholder="Enter meal description"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            outline: 'none',
            backgroundColor: '#f9fafb',
            boxSizing: 'border-box',
            resize: 'vertical',
            minHeight: '100px',
            fontFamily: 'inherit'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
          <input
            type="checkbox"
            name="is_available"
            checked={mealForm.is_available}
            onChange={handleFormChange}
          />
          Available for ordering
        </label>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button
          onClick={editingMeal ? handleUpdateMeal : handleAddMeal}
          disabled={!mealForm.name || !mealForm.price || !mealForm.category}
          style={{
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem',
            opacity: (!mealForm.name || !mealForm.price || !mealForm.category) ? 0.6 : 1
          }}
        >
          {editingMeal ? 'Update Meal' : 'Add Meal'}
        </button>
        <button
          onClick={resetForm}
          style={{
            backgroundColor: 'white',
            color: '#374151',
            border: '1px solid #d1d5db',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Render meal card
  const renderMealCard = (meal) => (
    <div key={meal.id} style={mealCardStyle}>
      {meal.image_url && (
        <img
          src={meal.image_url}
          alt={meal.name}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}
        />
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
          {meal.name}
        </h3>
        <span style={{
          backgroundColor: meal.is_available ? '#dcfce7' : '#fee2e2',
          color: meal.is_available ? '#16a34a' : '#dc2626',
          padding: '0.25rem 0.75rem',
          borderRadius: '1rem',
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          {meal.is_available ? 'Available' : 'Unavailable'}
        </span>
      </div>
      
      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.5 }}>
        {meal.description}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#059669' }}>
          KSh {meal.price}
        </span>
        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
          {meal.category_name}
        </span>
      </div>
      
      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
        <div>Max per person: {meal.max_per_person}</div>
        {meal.units_available && (
          <div>Units available: {meal.units_available}</div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleEditMeal(meal)}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <Edit2 size={14} />
          Edit
        </button>
        
        <button
          onClick={() => handleToggleAvailability(meal)}
          style={{
            backgroundColor: meal.is_available ? '#f59e0b' : '#059669',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          {meal.is_available ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
          {meal.is_available ? 'Disable' : 'Enable'}
        </button>
        
        <button
          onClick={() => handleDeleteMeal(meal.id)}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );

  // Render orders
  const renderOrders = () => (
    <div>
      {orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '3rem 2rem',
          borderRadius: '1rem',
          border: '2px dashed #d1d5db'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.6 }}>📋</div>
          <h3 style={{ color: '#374151', fontWeight: '600', marginBottom: '0.5rem' }}>
            No orders yet today
          </h3>
          <p style={{ color: '#64748b', margin: 0 }}>
            Orders will appear here as customers place them.
          </p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} style={orderCardStyle}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                  {order.user_name}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {order.user_email}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
              <div style={{
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                backgroundColor: 
                  order.status === 'confirmed' ? '#dbeafe' :
                  order.status === 'paid' ? '#dcfce7' : '#fef3c7',
                color:
                  order.status === 'confirmed' ? '#2563eb' :
                  order.status === 'paid' ? '#16a34a' : '#d97706'
              }}>
                {order.status}
              </div>
            </div>

            <div style={{
              margin: '1rem 0',
              backgroundColor: '#f8fafc',
              padding: '1rem',
              borderRadius: '0.5rem'
            }}>
              <h4 style={{
                marginBottom: '0.75rem',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.025em'
              }}>
                Items:
              </h4>
              {order.items.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0',
                  borderBottom: index < order.items.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <span style={{ color: '#374151' }}>
                    {item.meal_name} × {item.quantity}
                  </span>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>
                    KSh {item.subtotal}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              fontWeight: '700',
              fontSize: '1.25rem',
              color: '#059669',
              margin: '1rem 0',
              padding: '1rem 0',
              borderTop: '2px solid #f1f5f9',
              textAlign: 'center'
            }}>
              Total: KSh {order.total_amount}
            </div>

            {order.payment_info && (
              <div style={{
                backgroundColor: '#f0fdf4',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #dcfce7',
                marginTop: '1rem'
              }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#166534' }}>Transaction Code:</strong>
                  <span style={{
                    marginLeft: '0.5rem',
                    fontFamily: 'monospace',
                    backgroundColor: '#f0fff4',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    color: '#16a34a',
                    fontWeight: '600'
                  }}>
                    {order.payment_info.transaction_code}
                  </span>
                </div>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#166534' }}>
                  Amount Paid: KSh {order.payment_info.amount_paid}
                </div>
                {order.payment_info.amount_remaining > 0 && (
                  <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#dc2626' }}>
                    Amount Remaining: KSh {order.payment_info.amount_remaining}
                  </div>
                )}
                {!order.payment_info.is_verified && (
                  <button
                    onClick={() => handleConfirmPayment(order)}
                    style={{
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '0.75rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Check size={16} />
                    Confirm Payment
                  </button>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Kitchen Administration</h1>
        
        {renderStatsCards()}
        
        <div style={tabsStyle}>
          <button
            style={activeTab === 'menu' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('menu')}
          >
            <ChefHat size={18} />
            Menu Management
          </button>
          <button
            style={activeTab === 'orders' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} />
            Orders ({orders.length})
          </button>
        </div>

        {activeTab === 'menu' ? (
          <>
            <button
              onClick={() => setShowAddMeal(!showAddMeal)}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={20} />
              Add New Meal
            </button>

            {showAddMeal && renderMealForm()}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}>
              {meals.map(renderMealCard)}
            </div>
          </>
        ) : (
          renderOrders()
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;