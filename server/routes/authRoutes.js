const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body; // ✅ this was missing!

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("📥 Login attempt:", email);
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log("❌ User not found");
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("❌ Incorrect password");
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      console.log("✅ Login successful");
      res.status(200).json({ message: 'Login successful' });
    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;
