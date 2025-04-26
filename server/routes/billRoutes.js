// routes/billRoutes.js
const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');


// Create a new bill
router.post('/createBill', async (req, res) => {
  try {
    const { cartItems, totalAmount, userInfo, paymentMethod } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const newBill = new Bill({
      items: cartItems,
      totalAmount,
      customer: {
        name: userInfo.name,
        contact: userInfo.contact,
      },
      paymentMethod,
    });

    await newBill.save();

    res.status(201).json({ message: 'Bill created successfully', bill: newBill });
  } catch (error) {
    console.error('Error creating bill:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all bills with optional filters for search and date range (GET)
router.get('/all', async (req, res) => {
    try {
      const { searchTerm, selectedDate } = req.query;
  
      let filter = {};
  
      if (searchTerm) {
        filter['customer.name'] = { $regex: searchTerm, $options: 'i' }; // Case insensitive search
      }
  
      if (selectedDate) {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
  
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
  
        filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
      }
  
      const bills = await Bill.find(filter).sort({ createdAt: -1 });
      res.status(200).json(bills);
    } catch (error) {
      console.error('Error fetching bills:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

// Delete a bill by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const bill = await Bill.findById(id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    await bill.deleteOne();
    res.status(200).json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error.message);
    res.status(500).json({ message: 'Failed to delete bill' });
  }
});

module.exports = router;
