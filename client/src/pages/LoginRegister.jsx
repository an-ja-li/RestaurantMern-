import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoginRegister.css';

const LoginModal = ({ show, onClose }) => {
  const [formType, setFormType] = useState('login'); // 'login' | 'register' | 'forgot'

  if (!show) return null;

  const switchForm = (type) => setFormType(type);

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
          >
            {formType === 'register' && (
              <input type="text" placeholder="Full Name" required />
            )}

            <input
              type="email"
              placeholder="Email"
              required
            />

            {formType !== 'forgot' && (
              <input
                type="password"
                placeholder="Password"
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

        <p className="toggle-text">
          {formType === 'login' && <>Don’t have an account? <span className="toggle-link" onClick={() => switchForm('register')}>Register here</span></>}
          {formType === 'register' && <>Already have an account? <span className="toggle-link" onClick={() => switchForm('login')}>Login here</span></>}
          {formType === 'forgot' && <>Remember your password? <span className="toggle-link" onClick={() => switchForm('login')}>Back to Login</span></>}
        </p>

        <p className="toggle-text" onClick={onClose}>Close</p>
      </motion.div>
    </div>
  );
};

export default LoginModal;
