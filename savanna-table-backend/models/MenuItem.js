const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizers', 'mains', 'beverages', 'desserts'],
    lowercase: true
  },
  image: {
    type: String,
    default: null
  },
  available: {
    type: Boolean,
    default: true
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    trim: true
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  preparationTime: {
    type: Number, // in minutes
    default: 15
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  orderCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
menuItemSchema.index({ category: 1, available: 1 });
menuItemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);