// models/FoodItem.js
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Starter', 'Main Course', 'Dessert', 'Drinks', 'Beverage'],
    required: true
  },
  type: {
    type: String,
    enum: ['Veg', 'Non-Veg'],
    required: true
  },
  imageUrl: String,
});

module.exports = mongoose.model('Food', foodSchema);
