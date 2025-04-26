import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti'; // 🎉 Import confetti
import './LoginRegister.css';

const LoginModal = ({ show, onClose }) => {
  const [formType, setFormType] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    securityQuestion: '',
    securityAnswer: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [forgotStep, setForgotStep] = useState(1);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showSnap, setShowSnap] = useState(false); // Add state for finger-snap animation

  if (!show) return null;

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setShowSnap(true); // Trigger snap animation
    setTimeout(() => setShowSnap(false), 500); // Hide the snap animation after it runs
  };

  const switchForm = (type) => {
    setFormType(type);
    setFormData({ name: '', email: '', password: '', securityQuestion: '', securityAnswer: '' });
    setSecurityQuestion('');
    setSecurityAnswer('');
    setNewPassword('');
    setForgotStep(1);
    setMessage('');
    setIsError(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      if (forgotStep === 1) {
        const res = await axios.post('http://localhost:5000/api/auth/forgot-password-step1', {
          email: formData.email.trim(),
        });
        setSecurityQuestion(res.data.securityQuestion);
        setForgotStep(2);
      } else if (forgotStep === 2) {
        const res = await axios.post('http://localhost:5000/api/auth/forgot-password-step2', {
          email: formData.email.trim(),
          securityQuestion,
          securityAnswer,
        });
        if (res.data.success) setForgotStep(3);
        setMessage(res.data.message);
        setIsError(!res.data.success);
      } else if (forgotStep === 3) {
        const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
          email: formData.email.trim(),
          newPassword,
        });
        setMessage(res.data.message);
        setIsError(false);

        // 🎉 Confetti on success
        launchConfetti();

        setTimeout(() => {
          onClose();
          switchForm('login');
        }, 1000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Something went wrong';
      setMessage(errorMsg);
      setIsError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setLoading(true);

    try {
      let res;
      if (formType === 'login') {
        res = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email.trim(),
          password: formData.password,
        });
      } else if (formType === 'register') {
        res = await axios.post('http://localhost:5000/api/auth/register', {
          name: formData.name,
          email: formData.email.trim(),
          password: formData.password,
          securityQuestion: formData.securityQuestion,
          securityAnswer: formData.securityAnswer,
        });
      }

      setMessage(res.data.message);
      setIsError(false);

      // 🎉 Confetti on success
      launchConfetti();

      setTimeout(() => {
        onClose();
        switchForm('login');
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Something went wrong';
      setMessage(errorMsg);
      setIsError(true);
    } finally {
      setLoading(false);
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
          {formType !== 'forgot' ? (
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

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              {formType === 'register' && (
                <>
                  <select
                    name="securityQuestion"
                    value={formData.securityQuestion}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a Security Question</option>
                    <option value="What is your pet's name?">What is your pet's name?</option>
                    <option value="What is your mother's name?">What is your mother's name?</option>
                    <option value="What was the name of your first school?">What was the name of your first school?</option>
                  </select>
                  <input
                    type="text"
                    name="securityAnswer"
                    placeholder="Your Answer"
                    value={formData.securityAnswer}
                    onChange={handleChange}
                    required
                  />
                </>
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
                disabled={loading}
              >
                {loading ? 'Processing...' : formType === 'login' ? 'Login' : 'Register'}
              </motion.button>
            </motion.form>
          ) : (
            <motion.form
              key="forgot"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="form-fields"
              onSubmit={handleForgotSubmit}
            >
              {forgotStep === 1 && (
                <>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your registered email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="form-button"
                    disabled={loading}
                  >
                    Next
                  </motion.button>
                </>
              )}

              {forgotStep === 2 && (
                <>
                  <select
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    required
                  >
                    <option value="">Select Your Security Question</option>
                    <option value="What is your pet's name?">What is your pet's name?</option>
                    <option value="What is your mother's name?">What is your mother's name?</option>
                    <option value="What was the name of your first school?">What was the name of your first school?</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Your Answer"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="form-button"
                    disabled={loading}
                  >
                    Verify Answer
                  </motion.button>
                </>
              )}

              {forgotStep === 3 && (
                <>
                  <input
                    type="password"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="form-button"
                    disabled={loading}
                  >
                    Set New Password
                  </motion.button>
                </>
              )}
            </motion.form>
          )}
        </AnimatePresence>

        {message && (
          <p className="form-message" style={{ color: isError ? 'red' : 'green' }}>
            {message}
          </p>
        )}

        {/* Finger-snap animation */}
        {showSnap && (
          <motion.div
            className="finger-snap"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            👌
          </motion.div>
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

        <p className="toggle-text" onClick={onClose}>Close</p>
      </motion.div>
    </div>
  );
};

export default LoginModal;
