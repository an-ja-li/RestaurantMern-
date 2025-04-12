// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const staffRoutes = require("./routes/staffRoutes");
const foodRoutes = require("./routes/foodRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
// Serve images statically
app.use('/uploads', express.static('uploads'));


// Routes

app.use("/api/staff", staffRoutes);
app.use('/foods', foodRoutes);


// Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
