import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './LoginRegister.css';

const LoginModal = ({ show, onClose }) => {
  const [formType, setFormType] = useState('login'); // 'login' | 'register' | 'forgot'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  if (!show) return null;

  const switchForm = (type) => {
    setFormType(type);
    setFormData({ name: '', email: '', password: '' });
    setMessage('');
    setIsError(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
  
    try {
      let res;
  
      if (formType === 'login') {
        res = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email.trim(),
          password: formData.password,
        });
  
        console.log("✅ Login Response:", res.data);
  
      } else if (formType === 'register') {
        res = await axios.post('http://localhost:5000/api/auth/register', {
          name: formData.name,
          email: formData.email.trim(),
          password: formData.password,
        });
  
        console.log("✅ Registration Response:", res.data);
      } else {
        setMessage("Reset link sent (mock)");
        return;
      }
  
      setMessage(res.data.message);
      setIsError(false);
  
      // Optional: close modal after short delay
      setTimeout(() => {
        onClose();
        switchForm('login');
      }, 1000);
  
    } catch (err) {
      console.error("❌ Axios Error:", err.response || err.message || err);
      const errorMsg = err.response?.data?.message || 'Something went wrong';
      setMessage(errorMsg);
      setIsError(true);
    }
  };
  
    

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="form-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="form-title">
          {formType === 'login' && 'Login to Eat 🍔'}
          {formType === 'register' && 'Register to Feast 🍕'}
          {formType === 'forgot' && 'Recover Your Hunger 🔑'}
        </h2>

        <AnimatePresence mode="wait">
          <motion.form
            key={formType}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="form-fields"
            onSubmit={handleSubmit}
          >
            {formType === 'register' && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {formType !== 'forgot' && (
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            )}

            {formType === 'login' && (
              <p className="forgot-password">
                <span onClick={() => switchForm('forgot')}>Forgot Password?</span>
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="form-button"
            >
              {formType === 'login' && 'Login'}
              {formType === 'register' && 'Register'}
              {formType === 'forgot' && 'Send Reset Link'}
            </motion.button>
          </motion.form>
        </AnimatePresence>

        {message && (
          <p className="form-message" style={{ color: isError ? 'red' : 'green' }}>
            {message}
          </p>
        )}

        <p className="toggle-text">
          {formType === 'login' && (
            <>
              Don’t have an account?{' '}
              <span className="toggle-link" onClick={() => switchForm('register')}>
                Register here
              </span>
            </>
          )}
          {formType === 'register' && (
            <>
              Already have an account?{' '}
              <span className="toggle-link" onClick={() => switchForm('login')}>
                Login here
              </span>
            </>
          )}
          {formType === 'forgot' && (
            <>
              Remember your password?{' '}
              <span className="toggle-link" onClick={() => switchForm('login')}>
                Back to Login
              </span>
            </>
          )}
        </p>

        <p className="toggle-text" onClick={onClose}>
          Close
        </p>
      </motion.div>
    </div>
  );
};

export default LoginModal;
