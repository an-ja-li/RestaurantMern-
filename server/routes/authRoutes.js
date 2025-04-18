const express = require('express');
const router = express.Router();
const {
  register,
  login,
  forgotStep1,
  forgotStep2,
  resetPassword
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password-step1', forgotStep1);
router.post('/forgot-password-step2', forgotStep2);
router.post('/reset-password', resetPassword);

module.exports = router;
