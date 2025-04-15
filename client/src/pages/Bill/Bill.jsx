import React from 'react';
import './Bill.css'; // Custom styles

const BillingPage = ({ location }) => {
  const orderDetails = location?.state?.order || null;

  if (!orderDetails) {
    return <div className="billing-container">No billing info available.</div>;
  }

  const { cartItems, totalAmount } = orderDetails;

  return (
    <div className="billing-container">
      <h2 className="billing-title">Thank you for your order! 🎉</h2>
      <div className="billing-summary">
        <ul className="billing-items">
          {cartItems.map(item => (
            <li key={item._id} className="billing-item">
              <img src={item.imageUrl} alt={item.name} className="billing-image" />
              <div className="billing-info">
                <span className="billing-name">{item.name}</span>
                <span className="billing-quantity">x {item.quantity}</span>
                <span className="billing-price">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="billing-total">
          <strong>Total:</strong> ₹{totalAmount}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
