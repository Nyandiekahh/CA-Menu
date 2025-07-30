import React from 'react';
import { Plus, Minus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

const MenuCard = ({ meal, onQuantityChange, quantity = 0, isAdmin = false, onEdit, onDelete, onToggleAvailability }) => {
  const handleIncrement = () => {
    if (quantity < meal.max_per_person) {
      onQuantityChange(meal.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(meal.id, quantity - 1);
    }
  };

  // Check if user can add more based on Django API data structure
  const canAddMore = quantity < meal.max_per_person && (meal.units_available === null || meal.units_available > 0);

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '1rem',
    overflow: 'hidden',
    border: '1px solid #f1f5f9',
    transition: 'all 0.2s ease',
    opacity: meal.is_available ? 1 : 0.6,
    position: 'relative'
  };

  const imageStyle = {
    width: '100%',
    height: '12rem',
    objectFit: 'cover',
    backgroundColor: '#f8fafc'
  };

  const contentStyle = {
    padding: '1.5rem'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem',
    gap: '1rem'
  };

  const titleStyle = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
    lineHeight: '1.3',
    flex: 1
  };

  const priceStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#059669',
    whiteSpace: 'nowrap'
  };

  const descriptionStyle = {
    color: '#64748b',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    lineHeight: '1.5'
  };

  const badgesStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem'
  };

  const badgeStyle = {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.75rem',
    fontWeight: '500'
  };

  const warningBadgeStyle = {
    ...badgeStyle,
    backgroundColor: '#fef3c7',
    color: '#d97706'
  };

  const successBadgeStyle = {
    ...badgeStyle,
    backgroundColor: '#dcfce7',
    color: '#16a34a'
  };

  const actionsStyle = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    flex: 1,
    justifyContent: 'center',
    minWidth: '80px'
  };

  const quantityControlsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    justifyContent: 'center',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.75rem',
    marginTop: '1rem'
  };

  const quantityBtnStyle = {
    width: '2.5rem',
    height: '2.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    color: '#374151'
  };

  const quantityDisplayStyle = {
    minWidth: '3rem',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '1.125rem',
    color: '#1e293b'
  };

  return (
    <div style={cardStyle}>
      {!meal.is_available && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '0.25rem 0.75rem',
          borderRadius: '1rem',
          fontSize: '0.75rem',
          fontWeight: '600',
          zIndex: 1
        }}>
          Unavailable
        </div>
      )}
      
      {/* Use image_url from Django API or fallback */}
      <img 
        src={meal.image_url || meal.image || `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop`} 
        alt={meal.name} 
        style={imageStyle} 
        onError={(e) => {
          e.target.src = `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop`;
        }}
      />
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>{meal.name}</h3>
          <span style={priceStyle}>KSh {parseFloat(meal.price).toFixed(0)}</span>
        </div>
        
        <p style={descriptionStyle}>{meal.description}</p>
        
        <div style={badgesStyle}>
          {/* Use category_name from Django API */}
          <span style={badgeStyle}>{meal.category_name || 'Unknown'}</span>
          {meal.units_available !== null && (
            <span style={meal.units_available < 5 ? warningBadgeStyle : successBadgeStyle}>
              {meal.units_available} units left
            </span>
          )}
          <span style={badgeStyle}>Max: {meal.max_per_person}</span>
        </div>

        <div style={actionsStyle}>
          {isAdmin ? (
            <>
              <button 
                style={buttonStyle} 
                onClick={() => onEdit(meal)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.color = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.color = '#374151';
                }}
              >
                <Edit size={16} />
                Edit
              </button>
              <button 
                style={{...buttonStyle, color: meal.is_available ? '#ef4444' : '#059669'}}
                onClick={() => onToggleAvailability(meal.id)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.borderColor = meal.is_available ? '#ef4444' : '#059669';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                {meal.is_available ? <EyeOff size={16} /> : <Eye size={16} />}
                {meal.is_available ? 'Hide' : 'Show'}
              </button>
              <button 
                style={{...buttonStyle, color: '#ef4444'}} 
                onClick={() => onDelete(meal.id)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fef2f2';
                  e.target.style.borderColor = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </>
          ) : (
            meal.is_available && (
              <div style={quantityControlsStyle}>
                <button 
                  style={{
                    ...quantityBtnStyle, 
                    opacity: quantity === 0 ? 0.5 : 1,
                    cursor: quantity === 0 ? 'not-allowed' : 'pointer'
                  }}
                  onClick={handleDecrement}
                  disabled={quantity === 0}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.color = '#3b82f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.color = '#374151';
                    }
                  }}
                >
                  <Minus size={16} />
                </button>
                <span style={quantityDisplayStyle}>{quantity}</span>
                <button 
                  style={{
                    ...quantityBtnStyle, 
                    opacity: !canAddMore ? 0.5 : 1,
                    cursor: !canAddMore ? 'not-allowed' : 'pointer'
                  }}
                  onClick={handleIncrement}
                  disabled={!canAddMore}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.backgroundColor = '#f0fdf4';
                      e.target.style.borderColor = '#059669';
                      e.target.style.color = '#059669';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.color = '#374151';
                    }
                  }}
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