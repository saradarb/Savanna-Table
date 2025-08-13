// App.jsx - Updated with admin and profile routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import Reservation from './Components/Reservation/Reservation';
import OrderOnline from './Components/OrderOnline/OrderOnline';
import ContactUs from './Components/ContactUs/ContactUs';
import Checkout from './Components/Checkout/Checkout';
import UserProfile from './Components/UserProfile/UserProfile';

// Import Admin Components
import AdminApp from './Components/Admin/AdminApp';

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/orderOnline" element={<OrderOnline />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/checkout" element={<CheckoutWrapper />} />
        <Route path="/profile" element={<UserProfile />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </Router>
  );
}

// CheckoutWrapper component to handle cart state
const CheckoutWrapper = () => {
  const [cart, setCart] = React.useState(() => {
    try {
      const savedCart = localStorage.getItem('restaurant-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  const handleBack = () => {
    window.history.back();
  };

  return <Checkout cart={cart} onBack={handleBack} />;
};

export default App;