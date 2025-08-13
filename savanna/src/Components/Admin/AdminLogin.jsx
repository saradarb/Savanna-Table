// src/Components/Admin/AdminLogin.jsx
import React, { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        onLogin(data.admin);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please check if the backend is running.');
      console.error('Login error:', error);
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '40px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2c3e50', margin: '0 0 10px 0', fontSize: '2rem' }}>
            Savanna Table
          </h1>
          <h2 style={{ color: '#7f8c8d', margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: 'normal' }}>
            Admin Panel
          </h2>
          <p style={{ color: '#95a5a6', margin: 0, fontSize: '14px' }}>
            Please sign in to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #f5c6cb',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#2c3e50', fontWeight: '600', fontSize: '14px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter your admin email"
              required
              style={{
                padding: '15px',
                border: '2px solid #ecf0f1',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.3s ease'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#2c3e50', fontWeight: '600', fontSize: '14px' }}>
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                padding: '15px',
                border: '2px solid #ecf0f1',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.3s ease'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '15px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '10px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #ecf0f1',
          textAlign: 'center'
        }}>
          <p style={{ margin: '5px 0', fontSize: '12px', color: '#2c3e50', fontWeight: '600' }}>
            Default Admin Credentials:
          </p>
          <p style={{ margin: '5px 0', fontSize: '12px', color: '#7f8c8d' }}>
            Email: admin@savannable.com
          </p>
          <p style={{ margin: '5px 0', fontSize: '12px', color: '#7f8c8d' }}>
            Password: admin123
          </p>
          <small style={{ color: '#95a5a6', fontStyle: 'italic' }}>
            For demo purposes only
          </small>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;