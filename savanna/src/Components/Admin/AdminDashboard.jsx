// src/Components/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get token from localStorage
  const getToken = () => localStorage.getItem('adminToken');

  // API calls
  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/menu', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchOrders(); // Refresh orders
        alert('Order status updated successfully!');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') fetchDashboardData();
    else if (activeTab === 'orders') fetchOrders();
    else if (activeTab === 'menu') fetchMenuItems();
    else if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="dashboard-overview">
      <h2 className="section-title">Dashboard Overview</h2>
      
      {dashboardData && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{dashboardData.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{dashboardData.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>${dashboardData.totalRevenue.toFixed(2)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{dashboardData.pendingOrders}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
        </div>
      )}

      {dashboardData?.recentOrders && (
        <div className="recent-orders">
          <h3>Recent Orders</h3>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.userId.firstName} {order.userId.lastName}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // Orders Management Component
  const OrdersManagement = () => (
    <div className="orders-management">
      <h2 className="section-title">Orders Management</h2>
      
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>
                  {order.userId.firstName} {order.userId.lastName}
                  <br />
                  <small>{order.userId.email}</small>
                </td>
                <td>
                  {order.items.map((item, index) => (
                    <div key={index}>
                      {item.quantity}x {item.title}
                    </div>
                  ))}
                </td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className={`status-select ${order.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="out-for-delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn-view"
                    onClick={() => alert(`Order Details:\nCustomer: ${order.userId.firstName} ${order.userId.lastName}\nPhone: ${order.deliveryInfo.phone}\nAddress: ${order.deliveryInfo.address}, ${order.deliveryInfo.city}, ${order.deliveryInfo.state} ${order.deliveryInfo.zipCode}\nItems: ${order.items.map(item => `${item.quantity}x ${item.title}`).join(', ')}\nTotal: $${order.total.toFixed(2)}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Menu Management Component  
  const MenuManagement = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      price: '',
      category: 'appetizers',
      available: true
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const fileInput = document.getElementById('image');
      if (fileInput.files[0]) {
        formDataToSend.append('image', fileInput.files[0]);
      }

      try {
        const url = editingItem 
          ? `http://localhost:5000/api/admin/menu/${editingItem._id}`
          : 'http://localhost:5000/api/admin/menu';
        
        const response = await fetch(url, {
          method: editingItem ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${getToken()}`
          },
          body: formDataToSend
        });

        if (response.ok) {
          alert(editingItem ? 'Menu item updated!' : 'Menu item added!');
          setShowAddForm(false);
          setEditingItem(null);
          setFormData({
            title: '',
            description: '',
            price: '',
            category: 'appetizers',
            available: true
          });
          fetchMenuItems();
        }
      } catch (error) {
        console.error('Error saving menu item:', error);
        alert('Error saving menu item');
      }
      setLoading(false);
    };

    const handleEdit = (item) => {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        available: item.available
      });
      setShowAddForm(true);
    };

    const handleDelete = async (itemId) => {
      if (window.confirm('Are you sure you want to delete this menu item?')) {
        try {
          const response = await fetch(`http://localhost:5000/api/admin/menu/${itemId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${getToken()}`
            }
          });

          if (response.ok) {
            alert('Menu item deleted!');
            fetchMenuItems();
          }
        } catch (error) {
          console.error('Error deleting menu item:', error);
          alert('Error deleting menu item');
        }
      }
    };

    return (
      <div className="menu-management">
        <div className="section-header">
          <h2 className="section-title">Menu Management</h2>
          <button 
            className="btn-add"
            onClick={() => {
              setShowAddForm(true);
              setEditingItem(null);
              setFormData({
                title: '',
                description: '',
                price: '',
                category: 'appetizers',
                available: true
              });
            }}
          >
            Add New Item
          </button>
        </div>

        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowAddForm(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="menu-form">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="appetizers">Appetizers</option>
                      <option value="mains">Main Courses</option>
                      <option value="beverages">Beverages</option>
                      <option value="desserts">Desserts</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Image</label>
                  <input type="file" id="image" accept="image/*" />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData({...formData, available: e.target.checked})}
                    />
                    Available
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : editingItem ? 'Update' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="menu-grid">
          {menuItems.map(item => (
            <div key={item._id} className={`menu-card ${!item.available ? 'unavailable' : ''}`}>
              {item.image && (
                <img src={`http://localhost:5000${item.image}`} alt={item.title} />
              )}
              <div className="menu-card-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="menu-card-footer">
                  <span className="price">${item.price.toFixed(2)}</span>
                  <span className="category">{item.category}</span>
                </div>
                <div className="menu-card-actions">
                  <button onClick={() => handleEdit(item)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Users Management Component
  const UsersManagement = () => (
    <div className="users-management">
      <h2 className="section-title">Users Management</h2>
      
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Join Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Savanna Table Admin</h2>
          <p>Welcome, {admin.name}</p>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Orders
          </button>
          <button 
            className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            🍽️ Menu
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
        </nav>

        <div className="sidebar-footer">
          <button 
            className="logout-btn"
            onClick={onLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'dashboard' && <DashboardOverview />}
        {activeTab === 'orders' && <OrdersManagement />}
        {activeTab === 'menu' && <MenuManagement />}
        {activeTab === 'users' && <UsersManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;