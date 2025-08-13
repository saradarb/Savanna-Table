import React, { useState, useMemo, useEffect } from 'react';
import './Checkout.css';

const Checkout = ({ cart, onBack }) => {
  const [currentStep, setCurrentStep] = useState('auth'); // 'auth', 'delivery', 'payment', 'confirmation'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [useNewAddress, setUseNewAddress] = useState(false);

  // Form states
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const [deliveryForm, setDeliveryForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryInstructions: ''
  });

  const [selectedAddressId, setSelectedAddressId] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  // Check if user is already logged in when component mounts
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsLoggedIn(true);
        setCurrentStep('delivery');
        setSavedAddresses(userData.addresses || []);

        // Pre-fill delivery form with user data
        setDeliveryForm({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone || '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          deliveryInstructions: ''
        });

        // If user has addresses, pre-select the default one
        if (userData.addresses && userData.addresses.length > 0) {
          const defaultAddress = userData.addresses.find(addr => addr.isDefault) || userData.addresses[0];
          setSelectedAddressId(defaultAddress._id);
          setDeliveryForm(prev => ({
            ...prev,
            address: defaultAddress.street,
            city: defaultAddress.city,
            state: defaultAddress.state,
            zipCode: defaultAddress.zipCode
          }));
        } else {
          setUseNewAddress(true);
        }
      } else {
        // Token might be invalid, clear it
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = 4.99;
    const tax = subtotal * 0.08; // 8% tax
    return {
      subtotal: subtotal.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      tax: tax.toFixed(2),
      total: (subtotal + deliveryFee + tax).toFixed(2)
    };
  };

  const totals = calculateTotal();

  // Handle authentication
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = authMode === 'login' ? 'login' : 'register';
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(authForm)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Fetch full user profile after login
        await fetchUserProfile();
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Network error. Please check if the backend is running.');
    }
    
    setLoading(false);
  };

  // Handle address selection
  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setUseNewAddress(false);
    
    if (addressId === 'new') {
      setUseNewAddress(true);
      setDeliveryForm(prev => ({
        ...prev,
        address: '',
        city: '',
        state: '',
        zipCode: ''
      }));
    } else {
      const selectedAddress = savedAddresses.find(addr => addr._id === addressId);
      if (selectedAddress) {
        setDeliveryForm(prev => ({
          ...prev,
          address: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode
        }));
      }
    }
  };

  // Handle delivery form submission
  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  // Handle payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('userToken');
      
      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          menuItemId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        deliveryInfo: deliveryForm,
        paymentMethod: paymentMethod,
        subtotal: parseFloat(totals.subtotal),
        deliveryFee: parseFloat(totals.deliveryFee),
        tax: parseFloat(totals.tax),
        total: parseFloat(totals.total)
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        // Clear cart after successful order
        localStorage.removeItem('restaurant-cart');
        setCurrentStep('confirmation');
      } else {
        alert(data.message || 'Order failed');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
    }
    
    setLoading(false);
  };

  // Handle auth form field changes
  const handleAuthFormChange = (field, value) => {
    setAuthForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle delivery form field changes
  const handleDeliveryFormChange = (field, value) => {
    setDeliveryForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle payment form field changes
  const handlePaymentFormChange = (field, value) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Memoized Auth Form Component
  const AuthFormComponent = useMemo(() => (
    <div className="checkout-section">
      <div className="checkout-header">
        <h2>{authMode === 'login' ? 'Login to Continue' : 'Create Account'}</h2>
        <p>Please {authMode === 'login' ? 'login' : 'sign up'} to proceed with your order</p>
      </div>

      <form onSubmit={handleAuth} className="auth-form">
        {authMode === 'signup' && (
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={authForm.firstName}
                onChange={(e) => handleAuthFormChange('firstName', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={authForm.lastName}
                onChange={(e) => handleAuthFormChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={authForm.email}
            onChange={(e) => handleAuthFormChange('email', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={authForm.password}
            onChange={(e) => handleAuthFormChange('password', e.target.value)}
            required
          />
        </div>

        {authMode === 'signup' && (
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={authForm.confirmPassword}
              onChange={(e) => handleAuthFormChange('confirmPassword', e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" className="checkout-btn primary" disabled={loading}>
          {loading ? 'Processing...' : authMode === 'login' ? 'Login' : 'Create Account'}
        </button>

        <div className="auth-switch">
          {authMode === 'login' ? (
            <p>Don't have an account? 
              <button type="button" onClick={() => setAuthMode('signup')} className="link-btn">
                Sign up here
              </button>
            </p>
          ) : (
            <p>Already have an account? 
              <button type="button" onClick={() => setAuthMode('login')} className="link-btn">
                Login here
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  ), [authMode, authForm, loading]);

  // Memoized Delivery Form Component
  const DeliveryFormComponent = useMemo(() => (
    <div className="checkout-section">
      <div className="checkout-header">
        <h2>Delivery Information</h2>
        <p>Please confirm or update your delivery details</p>
      </div>

      {/* User Welcome Message */}
      {user && (
        <div className="user-welcome">
          <h3>Welcome back, {user.firstName}!</h3>
          <p>We've pre-filled your information to make checkout faster.</p>
        </div>
      )}

      <form onSubmit={handleDeliverySubmit} className="delivery-form">
        {/* Personal Information */}
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={deliveryForm.firstName}
                onChange={(e) => handleDeliveryFormChange('firstName', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={deliveryForm.lastName}
                onChange={(e) => handleDeliveryFormChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={deliveryForm.email}
                onChange={(e) => handleDeliveryFormChange('email', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={deliveryForm.phone}
                onChange={(e) => handleDeliveryFormChange('phone', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Address Selection */}
        <div className="form-section">
          <h3>Delivery Address</h3>
          
          {savedAddresses.length > 0 && (
            <div className="address-selection">
              <h4>Choose from saved addresses:</h4>
              <div className="saved-addresses">
                {savedAddresses.map(address => (
                  <label key={address._id} className={`address-option ${selectedAddressId === address._id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="address"
                      value={address._id}
                      checked={selectedAddressId === address._id}
                      onChange={() => handleAddressSelect(address._id)}
                    />
                    <div className="address-content">
                      <div className="address-text">
                        <div>{address.street}</div>
                        <div>{address.city}, {address.state} {address.zipCode}</div>
                      </div>
                      {address.isDefault && <span className="default-badge">Default</span>}
                    </div>
                  </label>
                ))}
                
                <label className={`address-option new-address ${useNewAddress ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="address"
                    value="new"
                    checked={useNewAddress}
                    onChange={() => handleAddressSelect('new')}
                  />
                  <div className="address-content">
                    <div className="address-text">
                      <div>📍 Deliver to a new address</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Address Form (shown when using new address or no saved addresses) */}
          {(useNewAddress || savedAddresses.length === 0) && (
            <div className="address-form-section">
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  value={deliveryForm.address}
                  onChange={(e) => handleDeliveryFormChange('address', e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={deliveryForm.city}
                    onChange={(e) => handleDeliveryFormChange('city', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={deliveryForm.state}
                    onChange={(e) => handleDeliveryFormChange('state', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    value={deliveryForm.zipCode}
                    onChange={(e) => handleDeliveryFormChange('zipCode', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Instructions */}
        <div className="form-section">
          <div className="form-group">
            <label>Delivery Instructions (Optional)</label>
            <textarea
              value={deliveryForm.deliveryInstructions}
              onChange={(e) => handleDeliveryFormChange('deliveryInstructions', e.target.value)}
              placeholder="Any special instructions for delivery..."
              rows="3"
            />
          </div>
        </div>

        <button type="submit" className="checkout-btn primary">
          Continue to Payment
        </button>
      </form>
    </div>
  ), [deliveryForm, savedAddresses, selectedAddressId, useNewAddress, user]);

  // Memoized Payment Form Component
  const PaymentFormComponent = useMemo(() => (
    <div className="checkout-section">
      <div className="checkout-header">
        <h2>Payment Method</h2>
        <p>Choose your preferred payment method</p>
      </div>

      <div className="payment-methods">
        <div className="payment-option">
          <label className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="payment"
              value="card"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="payment-icon">💳</span>
            <span>Credit/Debit Card</span>
          </label>
        </div>

        <div className="payment-option">
          <label className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="payment"
              value="paypal"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="payment-icon">💰</span>
            <span>PayPal</span>
          </label>
        </div>

        <div className="payment-option">
          <label className={`payment-method ${paymentMethod === 'apple' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="payment"
              value="apple"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="payment-icon">📱</span>
            <span>Apple Pay</span>
          </label>
        </div>

        <div className="payment-option">
          <label className={`payment-method ${paymentMethod === 'google' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="payment"
              value="google"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="payment-icon">🏦</span>
            <span>Google Pay</span>
          </label>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <form onSubmit={handlePaymentSubmit} className="card-form">
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              value={paymentForm.cardNumber}
              onChange={(e) => handlePaymentFormChange('cardNumber', e.target.value)}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div className="form-group">
            <label>Cardholder Name</label>
            <input
              type="text"
              value={paymentForm.cardName}
              onChange={(e) => handlePaymentFormChange('cardName', e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                value={paymentForm.expiryDate}
                onChange={(e) => handlePaymentFormChange('expiryDate', e.target.value)}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                value={paymentForm.cvv}
                onChange={(e) => handlePaymentFormChange('cvv', e.target.value)}
                placeholder="123"
                required
              />
            </div>
          </div>

          <button type="submit" className="checkout-btn primary" disabled={loading}>
            {loading ? 'Processing Payment...' : `Pay $${totals.total}`}
          </button>
        </form>
      )}

      {paymentMethod && paymentMethod !== 'card' && (
        <button
          onClick={handlePaymentSubmit}
          className="checkout-btn primary"
          disabled={loading}
        >
          {loading ? 'Processing Payment...' : `Pay with ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} - $${totals.total}`}
        </button>
      )}
    </div>
  ), [paymentMethod, paymentForm, loading, totals.total]);

  // Confirmation Component
  const ConfirmationComponent = useMemo(() => (
    <div className="checkout-section">
      <div className="confirmation-content">
        <div className="success-icon">✅</div>
        <h2>Order Confirmed!</h2>
        <p>Thank you for your order. We'll send you a confirmation email shortly.</p>
        
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-details">
            <p><strong>Order #:</strong> SAV-{Date.now()}</p>
            <p><strong>Total:</strong> ${totals.total}</p>
            <p><strong>Estimated Delivery:</strong> 30-45 minutes</p>
          </div>
        </div>

        <button onClick={() => window.location.href = '/'} className="checkout-btn primary">
          Return to Home
        </button>
      </div>
    </div>
  ), [totals.total]);

  return (
    <div className="checkout-container">
      <header className="checkout-nav">
        <div className="checkout-brand">
          <a href="/">Savanna Table Restaurant</a>
        </div>
        <button onClick={onBack} className="back-btn">
          ← Back to Cart
        </button>
      </header>

      <div className="checkout-content">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className={`step ${isLoggedIn ? 'completed' : currentStep === 'auth' ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">{isLoggedIn ? 'Logged In' : 'Login'}</span>
          </div>
          <div className={`step ${currentStep === 'delivery' ? 'active' : ['payment', 'confirmation'].includes(currentStep) ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Delivery</span>
          </div>
          <div className={`step ${currentStep === 'payment' ? 'active' : currentStep === 'confirmation' ? 'completed' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Payment</span>
          </div>
          <div className={`step ${currentStep === 'confirmation' ? 'active completed' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Confirmation</span>
          </div>
        </div>

        <div className="checkout-main">
          <div className="checkout-form">
            {!isLoggedIn && currentStep === 'auth' && AuthFormComponent}
            {isLoggedIn && currentStep === 'delivery' && DeliveryFormComponent}
            {currentStep === 'payment' && PaymentFormComponent}
            {currentStep === 'confirmation' && ConfirmationComponent}
          </div>

          {/* Order Summary Sidebar */}
          {currentStep !== 'confirmation' && (
            <div className="order-summary-sidebar">
              <h3>Order Summary</h3>
              
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="summary-item">
                    <span className="item-name">{item.title}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${totals.subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee:</span>
                  <span>${totals.deliveryFee}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${totals.tax}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${totals.total}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;