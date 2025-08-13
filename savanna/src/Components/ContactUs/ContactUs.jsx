import './ContactUs.css';
import React from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';






const ContactUs = () => {
  return (
    <>
      <header>
        <div className="top-title">
          <a href="/">Savanna Table Restaurant</a>
        </div>
        <nav>
          <ul className="top-title">
            <li><a href="/OrderOnline">Order Online</a></li>
            <li><a href="/reservation">Reservation</a></li>
            <li><a href="/contactUs">Contact Us</a></li>
          </ul>
        </nav>
      </header>

      <div className="contact-container">
        <div className="container2">
          <div className="content2">
            <h1>Contact Us</h1>
            <p>We'd love to hear from you! Here's how you can reach us for any questions, reservations, or special requests.</p>
            
            <div className="additional-info">
              <div className="info-section">
                <h3>Private Events & Catering Services</h3>
                <p>At Savanna Table Restaurant, we specialize in crafting unforgettable experiences for your most important occasions. Whether you are hosting an intimate gathering, a corporate dinner, or a grand celebration, our elegant private dining spaces provide the perfect setting. Our dedicated events team will work closely with you to customize every detail—from bespoke menus curated by our award-winning chefs to impeccable wine pairings and flawless service. We also offer premium off-site catering, bringing the sophistication and flavors of our fine dining experience directly to your chosen venue. Let us make your event truly exceptional.</p>
              </div>
            </div>

            <div className="hours-section">
              <div className="info-item info-item1">
                <h3>🕒 Hours</h3>
                <p>Monday - Thursday: 11:00 AM - 10:00 PM<br />
                   Friday - Saturday: 11:00 AM - 11:00 PM<br />
                   Sunday: 12:00 PM - 9:00 PM</p>
              </div>
            </div>

            <div className="contact-info">
              <div className="info-item">
                <h3><LocationOnIcon /></h3>
                <p>123 Savanna Street<br />Wild Grove, SA 12345</p>
              </div>
              <div className="info-item">
                <h3><LocalPhoneIcon /></h3>
                <p>(555) 123-4567</p>
              </div>
              <div className="info-item">
                <h3><EmailIcon /></h3>
                <p>info@savannatable.com</p>
              </div>
            </div>

            <div className="contact-footer">
              <p>Follow us on social media for the latest updates and special offers!</p>
              <div className="social-links">
                <span><FacebookIcon /></span>
                <span><InstagramIcon /></span>
                <span><XIcon /></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;