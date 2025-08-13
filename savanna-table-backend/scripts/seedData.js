const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Admin = require('../models/Admin');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/savanna-table', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Admin.deleteMany({});
    await MenuItem.deleteMany({});
    await User.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    
    const admin = new Admin({
      name: 'Admin User',
      email: 'admin@savannable.com',
      password: hashedAdminPassword,
      role: 'super-admin',
      permissions: ['manage-menu', 'manage-orders', 'manage-users', 'view-analytics', 'manage-admins']
    });

    await admin.save();
    console.log('👤 Created admin user');

    // Create sample menu items
    const menuItems = [
      {
        title: "Cream Ling Shrimp",
        description: "Crispy spring rolls filled with traditional African vegetables and served with spicy peanut dipping sauce",
        price: 12.99,
        category: "appetizers",
        available: true,
        ingredients: ["shrimp", "cream", "ling", "spices"],
        preparationTime: 15,
        isPopular: true
      },
      {
        title: "Mozzarella Tomato Salad",
        description: "Golden fried plantain chips seasoned with African spices, served with tangy tamarind sauce",
        price: 8.99,
        category: "appetizers",
        available: true,
        ingredients: ["mozzarella", "tomatoes", "basil", "olive oil"],
        preparationTime: 10
      },
      {
        title: "Beetroot Shrimp",
        description: "Traditional pastry triangles filled with spiced vegetables or meat, served with mint chutney",
        price: 10.99,
        category: "appetizers",
        available: true,
        ingredients: ["beetroot", "shrimp", "herbs", "spices"],
        preparationTime: 20
      },
      {
        title: "Wagyu Steak",
        description: "Aromatic rice cooked in tomato sauce with African spices, served with grilled chicken and vegetables",
        price: 18.99,
        category: "mains",
        available: true,
        ingredients: ["wagyu beef", "herbs", "garlic", "butter"],
        preparationTime: 25,
        isPopular: true
      },
      {
        title: "Club Sandwich",
        description: "Fresh tilapia marinated in African herbs and spices, grilled to perfection with seasonal vegetables",
        price: 24.99,
        category: "mains",
        available: true,
        ingredients: ["bread", "turkey", "bacon", "lettuce", "tomato"],
        preparationTime: 15
      },
      {
        title: "Beef Suya",
        description: "Tender beef skewers marinated in spicy suya spice blend, served with rice and fresh salad",
        price: 22.99,
        category: "mains",
        available: true,
        ingredients: ["beef", "suya spices", "rice", "vegetables"],
        preparationTime: 30,
        isPopular: true
      },
      {
        title: "Vegetarian Curry",
        description: "Rich coconut curry with mixed vegetables, chickpeas, and aromatic African spices served with rice",
        price: 16.99,
        category: "mains",
        available: true,
        ingredients: ["mixed vegetables", "coconut milk", "curry spices", "rice"],
        preparationTime: 20
      },
      {
        title: "Hibiscus Tea",
        description: "Refreshing herbal tea made from hibiscus flowers, naturally sweet with a tart finish",
        price: 4.99,
        category: "beverages",
        available: true,
        ingredients: ["hibiscus flowers", "honey", "lemon"],
        preparationTime: 5
      },
      {
        title: "Palm Wine",
        description: "Traditional fermented palm wine, naturally sweet with complex flavors",
        price: 7.99,
        category: "beverages",
        available: true,
        ingredients: ["palm wine", "natural fermentation"],
        preparationTime: 2
      },
      {
        title: "Fresh Coconut Water",
        description: "Pure coconut water straight from young coconuts, naturally refreshing and hydrating",
        price: 5.99,
        category: "beverages",
        available: true,
        ingredients: ["fresh coconut water"],
        preparationTime: 2
      },
      {
        title: "Apple Pie",
        description: "Creamy ice cream infused with baobab fruit, offering a unique tangy and sweet flavor",
        price: 8.99,
        category: "desserts",
        available: true,
        ingredients: ["apples", "pastry", "cinnamon", "sugar"],
        preparationTime: 15
      },
      {
        title: "Pistachio Cake",
        description: "Traditional fried pastry bites, lightly sweetened and perfect for sharing",
        price: 6.99,
        category: "desserts",
        available: true,
        ingredients: ["pistachios", "flour", "sugar", "eggs"],
        preparationTime: 20
      },
      {
        title: "Lava Cake",
        description: "Warm chocolate cake with a molten chocolate center, served with vanilla ice cream",
        price: 10.99,
        category: "desserts",
        available: true,
        ingredients: ["chocolate", "flour", "eggs", "butter", "vanilla ice cream"],
        preparationTime: 18,
        isPopular: true
      },
      {
        title: "Lemon Tarte",
        description: "Tangy lemon tart with a buttery crust, topped with fresh whipped cream",
        price: 8.99,
        category: "desserts",
        available: true,
        ingredients: ["lemons", "pastry", "cream", "sugar"],
        preparationTime: 25
      }
    ];

    await MenuItem.insertMany(menuItems);
    console.log('🍽️  Created menu items');

    // Create sample users
    const hashedUserPassword = await bcrypt.hash('user123', 10);
    
    const sampleUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: hashedUserPassword,
        phone: '(555) 123-4567',
        addresses: [{
          street: '123 Main St',
          city: 'Alexandria',
          state: 'VA',
          zipCode: '22314',
          isDefault: true
        }]
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: hashedUserPassword,
        phone: '(555) 987-6543',
        addresses: [{
          street: '456 Oak Ave',
          city: 'Alexandria',
          state: 'VA',
          zipCode: '22315',
          isDefault: true
        }]
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com',
        password: hashedUserPassword,
        phone: '(555) 555-0123',
        addresses: [{
          street: '789 Pine Rd',
          city: 'Alexandria',
          state: 'VA',
          zipCode: '22316',
          isDefault: true
        }]
      }
    ];

    await User.insertMany(sampleUsers);
    console.log('👥 Created sample users');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin Panel:');
    console.log('  Email: admin@savannable.com');
    console.log('  Password: admin123');
    console.log('\nSample User Accounts:');
    console.log('  Email: john.doe@example.com');
    console.log('  Email: jane.smith@example.com');
    console.log('  Email: mike.johnson@example.com');
    console.log('  Password for all users: user123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the seed function
seedData();