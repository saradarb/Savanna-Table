# Savanna Table Restaurant

<div align="center">

![Restaurant Magic](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzEwMnljemx4eHh0MWlxZWR6emk1OXQwcGk2MmhxZmxyMWI0cnJjZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7JzHsh3UTip20/giphy.gif)

*A React-based restaurant management system featuring online ordering, reservations, and comprehensive admin dashboard.*

[![React](https://img.shields.io/badge/React-19.1.1-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.0-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7.8.1-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)

</div>

---

## Technical Implementation

### **Core Framework & Architecture**
```jsx
// Modern React with sophisticated routing
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="/orderOnline" element={<OrderOnline />} />
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  </Router>
);
```
- **React 19.1.1** with latest functional components and hooks
- **React Router DOM** for sophisticated client-side routing and navigation
- **Component-based modular architecture** with clean separation of concerns
- **State management** using localStorage integration for cart persistence

<div align="center">

![Cooking Time](https://media.giphy.com/media/l378khQxt68syiWJy/giphy.gif)

</div>

### **E-Commerce & Restaurant Features**
```jsx
// Smart cart management with persistence
const CheckoutWrapper = () => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('restaurant-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
};
```
- **Complete online ordering system** with cart functionality
- **Reservation management** with date/time validation and form handling
- **User authentication** with login/registration flows
- **Order tracking** and status management
- **Multi-step checkout process** with delivery information and payment

<div align="center">

![Pizza Chef](https://media.giphy.com/media/4ayiIWaq2VULC/giphy.gif)

</div>

### **Build System & Development Tools**
```bash
# Lightning-fast development with modern tooling
npm run dev    # Hot reload magic with Vite
npm run build  # Optimized production builds
npm run lint   # Code quality with ESLint 9.33.0
```
- **Vite 7.1.0** for ultra-fast development server and build optimization
- **ESLint 9.33.0** with React-specific plugins and modern configuration
- **Modern ES modules** with tree-shaking and code splitting
- **Hot Module Replacement** for instant development feedback

<div align="center">

![Happy Meal](https://media.giphy.com/media/12P6AnN6DcQj1S/giphy.gif)

</div>

### **Advanced UI/UX & Styling**
```css
/* Sophisticated animations and responsive design */
.reservation-container {
  background-color: #17232A;
  min-height: 100vh;
  animation: fadeInUp 0.8s ease-out;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(204, 138, 16, 0.3);
}
```
- **Custom CSS architecture** with advanced styling and animations
- **Responsive design patterns** with mobile-first approach
- **Interactive form validation** with real-time error handling
- **Modern UI components** with hover effects and transitions
- **Professional color schemes** and typography systems

<div align="center">

![Gordon Ramsay Cooking](https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif)

</div>

### **Admin Dashboard & Management**
```jsx
// Comprehensive admin system with multiple management panels
const AdminDashboard = ({ admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
};
```
- **Complete admin authentication system** with JWT token management
- **Multi-panel dashboard** with orders, menu, and user management
- **Real-time order status updates** with dynamic status management
- **Menu item CRUD operations** with image upload capabilities
- **User management** and analytics dashboard

<div align="center">

![Restaurant Rush](https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif)

</div>

### **State Management & Data Flow**
```jsx
// Sophisticated state management with hooks
const [formData, setFormData] = useState({
  firstName: '', lastName: '', email: '', phone: '',
  date: '', time: '', guests: '2', occasion: ''
});

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```
- **Complex form state management** with validation and error handling
- **Local storage integration** for persistent cart and user data
- **Multi-step form workflows** with progress tracking
- **Dynamic address management** with saved addresses functionality

<div align="center">

![Satisfied Customer](https://media.giphy.com/media/3o7qDSOvfaCO9b3MlO/giphy.gif)

</div>

### **Performance & Optimization**
```jsx
// Smart component optimization and memoization
const AuthFormComponent = useMemo(() => (
  <div className="checkout-section">
    {/* Complex form logic */}
  </div>
), [authMode, authForm, loading]);
```
- **React.useMemo** for expensive component memoization
- **Code splitting** and lazy loading for optimal bundle sizes
- **Efficient re-rendering** with optimized state updates
- **Asset optimization** and image handling

<div align="center">

![Success](https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif)

**This project demonstrates expertise in modern React development, e-commerce functionality, admin dashboard creation, form handling, and contemporary restaurant management systems while maintaining high code quality and user experience standards.**

</div>

---

<div align="center">

### **Built with passion for great food and clean code**

![Chef's Kiss](https://media.giphy.com/media/3o8doT9BL7dgtolp7O/giphy.gif)

</div>
