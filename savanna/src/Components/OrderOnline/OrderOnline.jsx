import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderOnline.css';
import eight from '../../assets/Images/8.png';
import nine from '../../assets/Images/9.png';
import ten from '../../assets/Images/10.png';
import seven from '../../assets/Images/7.png';
import two from '../../assets/Images/2.png';
import one from '../../assets/Images/1.png';
import six from '../../assets/Images/6.png';
import three from '../../assets/Images/3.png';
import eleven from '../../assets/Images/11.png';
import five from '../../assets/Images/5.png'

const OrderOnline = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('restaurant-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCart, setShowCart] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Hardcoded menu items as fallback
  const fallbackMenuItems = [
    {
      _id: '1',
      title: "Cream Ling Shrimp",
      price: 12.99,
      description: "Crispy spring rolls filled with traditional African vegetables and served with spicy peanut dipping sauce",
      category: "appetizers",
      image: eight,
      available: true
    },
    {
      _id: '2',
      title: "Mozzarella tomato Salad",
      price: 8.99,
      description: "Golden fried plantain chips seasoned with African spices, served with tangy tamarind sauce",
      category: "appetizers",
      image: one,
      available: true
    },
    {
      _id: '3',
      title: "Beetroot Shrimp",
      price: 10.99,
      description: "Traditional pastry triangles filled with spiced vegetables or meat, served with mint chutney",
      category: "appetizers",
      image: six,
      available: true
    },
    {
      _id: '4',
      title: "Wagyu Steak",
      price: 18.99,
      description: "Aromatic rice cooked in tomato sauce with African spices, served with grilled chicken and vegetables",
      category: "mains",
      image: three,
      available: true
    },
    {
      _id: '5',
      title: "Club Sandwich",
      price: 24.99,
      description: "Fresh tilapia marinated in African herbs and spices, grilled to perfection with seasonal vegetables",
      category: "mains",
      image: eleven,
      available: true
    },
    {
      _id: '6',
      title: "Beef Suya",
      price: 22.99,
      description: "Tender beef skewers marinated in spicy suya spice blend, served with rice and fresh salad",
      category: "mains",
      image: five,
      available: true
    },
    {
      _id: '7',
      title: "Vegetarian Curry",
      price: 16.99,
      description: "Rich coconut curry with mixed vegetables, chickpeas, and aromatic African spices served with rice",
      category: "mains",
      image: "🍛",
      available: true
    },
    {
      _id: '8',
      title: "Hibiscus Tea",
      price: 4.99,
      description: "Refreshing herbal tea made from hibiscus flowers, naturally sweet with a tart finish",
      category: "beverages",
      image: "🍵",
      available: true
    },
    {
      _id: '9',
      title: "Palm Wine",
      price: 7.99,
      description: "Traditional fermented palm wine, naturally sweet with complex flavors",
      category: "beverages",
      image: "🍷",
      available: true
    },
    {
      _id: '10',
      title: "Fresh Coconut Water",
      price: 5.99,
      description: "Pure coconut water straight from young coconuts, naturally refreshing and hydrating",
      category: "beverages",
      image: "🥥",
      available: true
    },
    {
      _id: '11',
      title: "Apple Pie",
      price: 8.99,
      description: "Creamy ice cream infused with baobab fruit, offering a unique tangy and sweet flavor",
      category: "desserts",
      image: ten,
      available: true
    },
    {
      _id: '12',
      title: "Pistachio Cake",
      price: 6.99,
      description: "Traditional fried pastry bites, lightly sweetened and perfect for sharing",
      category: "desserts",
      image: nine,
      available: true
    },
    {
      _id: '13',
      title: "Lava Cake",
      price: 10.99,
      description: "Traditional fried pastry bites, lightly sweetened and perfect for sharing",
      category: "desserts",
      image: seven,
      available: true
    },
    {
      _id: '14',
      title: "Lemon Tarte",
      price: 8.99,
      description: "Traditional fried pastry bites, lightly sweetened and perfect for sharing",
      category: "desserts",
      image: two,
      available: true
    }
  ];

  // Fetch menu items from backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/menu');
        
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        
        const data = await response.json();
        setMenuItems(data);
        setError('');
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Using offline menu. Backend not connected.');
        // Use fallback menu items
        setMenuItems(fallbackMenuItems);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('restaurant-cart', JSON.stringify(cart));
  }, [cart]);

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'appetizers', name: 'Appetizers' },
    { id: 'mains', name: 'Main Courses' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'desserts', name: 'Desserts' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item, quantity) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item._id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item._id 
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevCart, { 
          id: item._id,
          title: item.title,
          price: item.price,
          quantity 
        }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="order-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          color: '#fff',
          fontSize: '18px'
        }}>
          Loading menu items...
        </div>
      </div>
    );
  }

  return (
    <div className="order-container">
      {/* Header */}
      <header>
        <div className="top-title">
          <a href="/">Savanna Table Restaurant</a>
        </div>
        <nav>
          <ul className="top-title">
            <li><a href="/orderOnline">Order Online</a></li>
            <li><a href="/reservation">Reservation</a></li>
            <li><a href="/contactUs">Contact Us</a></li>
            {localStorage.getItem('userToken') && (
              <li><a href="/profile" style={{ color: '#00ff88' }}>My Profile</a></li>
            )}
            <li><a href="/admin" style={{ color: '#ffd700' }}>Admin</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <div className="order-content">
        <div className="order-header">
          <h1 className="order-title">Order Online</h1>
          <p className="order-subtitle">
            Enjoy our authentic African cuisine from the comfort of your home
          </p>
          {error && (
            <div style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '10px',
              borderRadius: '5px',
              margin: '10px 0',
              textAlign: 'center',
              border: '1px solid #ffeaa7'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Cart Button */}
        <button
          onClick={() => setShowCart(!showCart)}
          className="cart-button"
        >
          🛒 Cart ({getTotalItems()})
        </button>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="menu-grid">
          {filteredItems.map(item => (
            <MenuItem key={item._id} item={item} onAddToCart={addToCart} />
          ))}
        </div>

        {/* Cart Overlay */}
        {showCart && (
          <div 
            className={`cart-overlay ${showCart ? 'active' : ''}`} 
            onClick={() => setShowCart(false)} 
          />
        )}

        {/* Cart Sidebar */}
        <div className={`cart-sidebar ${showCart ? 'active' : ''}`}>
          <div className="cart-header">
            <h2 className="cart-title">Your Cart</h2>
            <button
              onClick={() => setShowCart(false)}
              className="cart-close"
            >
              ×
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="cart-empty">Your cart is empty</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <h4 className="cart-item-title">{item.title}</h4>
                  <p className="cart-item-price">${item.price.toFixed(2)} each</p>
                  <div className="cart-item-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="cart-quantity-button"
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="cart-quantity-button"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="cart-remove-button"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="cart-item-subtotal">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="cart-total">
                <h3 className="cart-total-price">
                  Total: ${getTotalPrice().toFixed(2)}
                </h3>
                <button
                  className="checkout-button"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Updated MenuItem Component
const MenuItem = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    setQuantity(1);
  };

  return (
    <div className="menu-item">
      <div className="menu-item-image">
        {item.image && (item.image.includes('.png') || item.image.includes('.jpg') || item.image.startsWith('/uploads')) ? (
          <img 
            src={item.image.startsWith('/uploads') ? `http://localhost:5000${item.image}` : item.image} 
            alt={item.title} 
            className="menu-item-img" 
            onError={(e) => {
              // Fallback to emoji if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback emoji or placeholder */}
        <div style={{ 
          fontSize: '3rem', 
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: item.image && !item.image.startsWith('/uploads') && (item.image.includes('🍽️') || item.image.includes('🍛') || item.image.includes('🍵') || item.image.includes('🍷') || item.image.includes('🥥')) ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto'
        }}>
          {item.image && (item.image.includes('🍽️') || item.image.includes('🍛') || item.image.includes('🍵') || item.image.includes('🍷') || item.image.includes('🥥')) ? item.image : '🍽️'}
        </div>
      </div>

      <h3 className="menu-item-title">
        {item.title}
      </h3>
      <p className="menu-item-description">
        {item.description}
      </p>
      <div className="menu-item-footer">
        <span className="menu-item-price">
          ${item.price.toFixed(2)}
        </span>
        <div className="quantity-controls">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="quantity-button"
          >
            -
          </button>
          <span className="quantity-display">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="quantity-button"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={handleAddToCart}
        className="add-to-cart-button"
        disabled={!item.available}
      >
        {item.available ? 'Add to Cart' : 'Unavailable'}
      </button>
    </div>
  );
};

export default OrderOnline;