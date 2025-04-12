const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: String,
  role: String,
  age: Number,
  salary: Number,
  paymentStatus: {
    type: String,
    enum: ["Paid", "Non-Paid"],
    default: "Non-Paid",
  },
});

module.exports = mongoose.model("Staff", staffSchema);
