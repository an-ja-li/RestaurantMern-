const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");

// Create new staff
router.post("/", async (req, res) => {
  try {
    const staff = new Staff(req.body);
    const saved = await staff.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: "Error creating staff", details: error.message });
  }
});

// Get all staff
router.get("/", async (req, res) => {
  try {
    const staffList = await Staff.find();
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ error: "Error fetching staff", details: error.message });
  }
});

// Update staff by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Staff not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Error updating staff", details: error.message });
  }
});

// Delete staff by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Staff.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Staff not found" });
    res.json({ message: "Staff removed" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting staff", details: error.message });
  }
});

// Toggle payment status (optional PATCH route)
router.patch("/:id/payment", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ error: "Staff not found" });

    staff.paymentStatus = staff.paymentStatus === "Paid" ? "Non-Paid" : "Paid";
    const updated = await staff.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Error updating payment status", details: error.message });
  }
});

module.exports = router;
