// src/Components/UserProfile/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/orderOnline');
      return;
    }
    fetchUserData();
  }, [navigate]);

  const getToken = () => localStorage.getItem('userToken');

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setAddresses(userData.addresses || []);
        setProfileForm({
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone || ''
        });
      } else {
        // Token might be invalid
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        navigate('/orderOnline');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/orders', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });

      if (response.ok) {
        const orderData = await response.json();
        setOrders(orderData);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(profileForm)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setEditingProfile(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(addressForm)
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses);
        setShowAddAddress(false);
        setAddressForm({
          street: '',
          city: '',
          state: '',
          zipCode: '',
          isDefault: false
        });
        alert('Address added successfully!');
      } else {
        alert('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Error adding address');
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/user/addresses/${editingAddress._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(addressForm)
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses);
        setEditingAddress(null);
        setAddressForm({
          street: '',
          city: '',
          state: '',
          zipCode: '',
          isDefault: false
        });
        alert('Address updated successfully!');
      } else {
        alert('Failed to update address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Error updating address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/user/addresses/${addressId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        if (response.ok) {
          const data = await response.json();
          setAddresses(data.addresses);
          alert('Address deleted successfully!');
        } else {
          alert('Failed to delete address');
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Error deleting address');
      }
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isDefault: address.isDefault
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/orderOnline');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading your profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error">Please log in to view your profile</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <div className="profile-brand">
          <a href="/">Savanna Table Restaurant</a>
        </div>
        <nav className="profile-nav">
          <a href="/orderOnline">Order Online</a>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
      </header>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-user-info">
            <div className="profile-avatar">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <h3>{user.firstName} {user.lastName}</h3>
            <p>{user.email}</p>
          </div>

          <nav className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
            <button 
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📦 Order History
            </button>
            <button 
              className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              📍 Addresses
            </button>
          </nav>
        </div>

        <div className="profile-main">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Profile Information</h2>
                {!editingProfile && (
                  <button 
                    className="edit-btn"
                    onClick={() => setEditingProfile(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {editingProfile ? (
                <form onSubmit={handleProfileUpdate} className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="disabled-input"
                    />
                    <small>Email cannot be changed</small>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={() => setEditingProfile(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="save-btn">
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-display">
                  <div className="profile-info">
                    <div className="info-item">
                      <label>First Name</label>
                      <span>{user.firstName}</span>
                    </div>
                    <div className="info-item">
                      <label>Last Name</label>
                      <span>{user.lastName}</span>
                    </div>
                    <div className="info-item">
                      <label>Email</label>
                      <span>{user.email}</span>
                    </div>
                    <div className="info-item">
                      <label>Phone</label>
                      <span>{user.phone || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <label>Member Since</label>
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="orders-section">
              <h2>Order History</h2>
              
              {orders.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't placed any orders yet.</p>
                  <a href="/orderOnline" className="order-now-btn">
                    Order Now
                  </a>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div className="order-number">
                          Order #{order.orderNumber}
                        </div>
                        <div className="order-date">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="order-status">
                        <span className={`status-badge ${order.status}`}>
                          {order.status.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <span>{item.quantity}x {item.title}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="order-footer">
                        <div className="order-total">
                          Total: ${order.total.toFixed(2)}
                        </div>
                        <div className="order-actions">
                          {order.status === 'delivered' && (
                            <button className="reorder-btn">
                              Reorder
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="addresses-section">
              <div className="section-header">
                <h2>Delivery Addresses</h2>
                <button 
                  className="add-btn"
                  onClick={() => setShowAddAddress(true)}
                >
                  Add New Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="empty-state">
                  <p>No addresses saved yet.</p>
                </div>
              ) : (
                <div className="addresses-list">
                  {addresses.map(address => (
                    <div key={address._id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                      <div className="address-content">
                        <div className="address-text">
                          <div className="address-line">
                            {address.street}
                          </div>
                          <div className="address-line">
                            {address.city}, {address.state} {address.zipCode}
                          </div>
                        </div>
                        {address.isDefault && (
                          <div className="default-badge">Default</div>
                        )}
                      </div>
                      <div className="address-actions">
                        <button 
                          className="edit-address-btn"
                          onClick={() => handleEditAddress(address)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-address-btn"
                          onClick={() => handleDeleteAddress(address._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Address Modal */}
              {(showAddAddress || editingAddress) && (
                <div className="modal-overlay">
                  <div className="modal">
                    <div className="modal-header">
                      <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                      <button 
                        className="modal-close"
                        onClick={() => {
                          setShowAddAddress(false);
                          setEditingAddress(null);
                          setAddressForm({
                            street: '',
                            city: '',
                            state: '',
                            zipCode: '',
                            isDefault: false
                          });
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <form onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress} className="address-form">
                      <div className="form-group">
                        <label>Street Address</label>
                        <input
                          type="text"
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>City</label>
                          <input
                            type="text"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>State</label>
                          <input
                            type="text"
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>ZIP Code</label>
                          <input
                            type="text"
                            value={addressForm.zipCode}
                            onChange={(e) => setAddressForm({...addressForm, zipCode: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                          />
                          Set as default address
                        </label>
                      </div>

                      <div className="form-actions">
                        <button 
                          type="button" 
                          onClick={() => {
                            setShowAddAddress(false);
                            setEditingAddress(null);
                          }}
                        >
                          Cancel
                        </button>
                        <button type="submit">
                          {editingAddress ? 'Update Address' : 'Add Address'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;