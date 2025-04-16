// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import DB config and routes
const connectDB = require("./config/db");
const staffRoutes = require("./routes/staffRoutes");
const foodRoutes = require("./routes/foodRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use("/api/staff", staffRoutes);
app.use("/api/foods", foodRoutes);        // changed to "/api/foods" for consistency
app.use("/api/auth", authRoutes);

// Root route (optional)
app.get("/", (req, res) => {
  res.send("🍽️ Welcome to the Restaurant API");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
