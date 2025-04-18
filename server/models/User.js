const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  securityQuestion: {
    type: String,
    required: true,
    enum: [
      "What is your mother's name?",
      "What is your pet's name?",
      "What was the name of your first school?",
    ],
  },
  securityAnswer: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
