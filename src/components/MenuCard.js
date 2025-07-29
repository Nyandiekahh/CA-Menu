import React from 'react';
import { Plus, Minus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

const MenuCard = ({ meal, onQuantityChange, quantity = 0, isAdmin = false, onEdit, onDelete, onToggleAvailability }) => {
  const handleIncrement = () => {
    if (quantity < meal.maxPerPerson) {
      onQuantityChange(meal.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(meal.id, quantity - 1);
    }
  };

  const canAddMore = quantity < meal.maxPerPerson && (meal.units === null || meal.units > 0);

  return (
    <div className={`menu-card ${!meal.available ? 'unavailable' : ''}`}>
      <img src={meal.image} alt={meal.name} className="menu-card-image" />
      <div className="menu-card-content">
        <div className="menu-card-header">
          <h3 className="menu-card-title">{meal.name}</h3>
          <span className="menu-card-price">KSh {meal.price}</span>
        </div>
        
        <p className="menu-card-description">{meal.description}</p>
        
        <div className="menu-card-info">
          <span className="info-badge">{meal.category}</span>
          {meal.units !== null && (
            <span className={`info-badge ${meal.units < 5 ? 'warning' : 'success'}`}>
              {meal.units} units left
            </span>
          )}
          <span className="info-badge">Max: {meal.maxPerPerson}</span>
          {!meal.available && <span className="info-badge warning">Unavailable</span>}
        </div>

        {meal.restrictions.length > 0 && (
          <div className="menu-card-info">
            <span className="info-badge warning">Has restrictions</span>
          </div>
        )}

        <div className="menu-card-actions">
          {isAdmin ? (
            <>
              <button className="card-btn secondary" onClick={() => onEdit(meal)}>
                <Edit size={16} />
                Edit
              </button>
              <button 
                className={`card-btn ${meal.available ? 'danger' : 'success'}`}
                onClick={() => onToggleAvailability(meal.id)}
              >
                {meal.available ? <EyeOff size={16} /> : <Eye size={16} />}
                {meal.available ? 'Hide' : 'Show'}
              </button>
              <button className="card-btn danger" onClick={() => onDelete(meal.id)}>
                <Trash2 size={16} />
                Delete
              </button>
            </>
          ) : (
            meal.available && (
              <div className="quantity-controls">
                <button 
                  className="quantity-btn" 
                  onClick={handleDecrement}
                  disabled={quantity === 0}
                >
                  <Minus size={16} />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  className="quantity-btn" 
                  onClick={handleIncrement}
                  disabled={!canAddMore}
                >
                  <Plus size={16} />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;