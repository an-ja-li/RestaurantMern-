// models/Bill.js
const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  customer: {
    name: { type: String, required: true },
    contact: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI'], // you said you wanted UPI option ✨
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Bill', billSchema);
