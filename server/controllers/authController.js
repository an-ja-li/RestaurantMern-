const User = require('../models/User');
const bcrypt = require('bcrypt');
const validator = require('validator'); // for email validation

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, securityQuestion, securityAnswer } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered.' });

    // Password strength validation (minimum 8 characters, at least 1 number, 1 uppercase, 1 lowercase)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, and contain at least one number, one uppercase letter, and one lowercase letter.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase(), 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      securityQuestion,
      securityAnswer: hashedAnswer,
    });

    await newUser.save();
    res.status(201).json({ message: 'Registered successfully!' });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    res.json({ message: 'Login successful!', user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: 'Login failed.', error: err.message });
  }
};

// Forgot Password Step 1 - Check if email exists
exports.forgotStep1 = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found.' });

    res.json({ message: 'User found.', securityQuestion: user.securityQuestion });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: 'Error occurred.', error: err.message });
  }
};

// Forgot Password Step 2 - Validate security answer
exports.forgotStep2 = async (req, res) => {
  try {
    const { email, securityQuestion, securityAnswer } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    if (user.securityQuestion !== securityQuestion) {
      return res.status(400).json({ message: 'Security question mismatch.' });
    }

    const isAnswerCorrect = await bcrypt.compare(securityAnswer.toLowerCase(), user.securityAnswer);
    if (!isAnswerCorrect) return res.status(400).json({ message: 'Incorrect security answer.' });

    res.json({ message: 'Security answer verified.', success: true });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: 'Verification failed.', error: err.message });
  }
};

// Forgot Password Step 3 - Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Password strength validation (same as for registration)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters long, and contain at least one number, one uppercase letter, and one lowercase letter.',
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: 'Failed to reset password.', error: err.message });
  }
};
