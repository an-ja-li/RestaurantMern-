import React from 'react';
import './button.css';

const Button = ({ children = "Login", onClick, type = "button", className = "" }) => {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`login-btn ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
