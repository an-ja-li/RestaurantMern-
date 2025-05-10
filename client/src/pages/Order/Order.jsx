// src/pages/Order.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Button from '../../components/button';
import { Search, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBox } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../Food/Food.css';
import '../Order/Order.css';

const App = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [vegFilter, setVegFilter] = useState('All');
  const [cart, setCart] = useState([]);
  const [toastMsg, setToastMsg] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [userInfo, setUserInfo] = useState({ name: '', contact: '' });
  const MAX_QUANTITY = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/foods');
        setFoods(res.data);
      } catch (err) {
        console.error('Failed to fetch foods:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const addToCart = (food) => {
    const parsedPrice = parseFloat(food.price);
    if (isNaN(parsedPrice)) return;

    const existingItem = cart.find(item => item._id === food._id);
    if (existingItem) {
      if (existingItem.quantity >= MAX_QUANTITY) return;
      setCart(cart.map(item => item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...food, price: parsedPrice, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    const existingItem = cart.find(item => item._id === id);
    if (existingItem.quantity > 1) {
      setCart(cart.map(item => item._id === id ? { ...item, quantity: item.quantity - 1 } : item));
    } else {
      setCart(cart.filter(item => item._id !== id));
    }
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    // Phone number validation (for a 10-digit number)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(userInfo.contact)) {
      setToastMsg('Please enter a valid 10-digit phone number.');
      return;
    }

    const orderData = {
      cartItems: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount: getTotal(),
      userInfo,
      paymentMethod
    };

    try {
      const response = await axios.post('http://localhost:5000/api/bills/createBill', orderData);
      console.log('Bill created:', response.data);
      setToastMsg('Bill created successfully!');
      setCart([]);
      setShowPaymentModal(false);
      setIsCartOpen(false);
      setUserInfo({ name: '', contact: '' }); // address field gone
    } catch (error) {
      console.error('Error creating bill:', error.message);
      setToastMsg('Failed to create bill');
    }
  };

  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      return (
        (categoryFilter === 'All' || food.category === categoryFilter) &&
        (vegFilter === 'All' || food.type === vegFilter) &&
        (searchTerm.trim() === '' || food.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }, [foods, categoryFilter, vegFilter, searchTerm]);

  return (
    <div className="main-container">
      <div className="content-container">
        {toastMsg && (
          <div className="toast show position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
            <div className="toast-body bg-success text-white shadow">{toastMsg}</div>
          </div>
        )}

        <div className="search-bar">
          <div className="search-container" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-input-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search food items..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select value={categoryFilter} className="DROPDOWN" onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Starter">Starter</option>
              <option value="Dessert">Dessert</option>
              <option value="Drink">Drink</option>
              <option value="Beverage">Beverage</option>
            </select>

            <select value={vegFilter} className="DROPDOWN" onChange={(e) => setVegFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>

            <Button onClick={() => setIsCartOpen(!isCartOpen)} className="button">
              <ShoppingCart className="me-2" />
              View Cart
              {cart.length > 0 && (
                <span className="cart-badge">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="food-grid">
            {filteredFoods.map(food => (
              <div key={food._id} className="food-card">
                <img src={food.imageUrl} alt={food.name} className="food-image" />
                <h3 className="food-name">{food.name}</h3>
                <p className="food-price">₹{Number(food.price).toFixed(2)}</p>

                <button
                  className="cart-button"
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    btn.classList.add('clicked');
                    addToCart(food);
                    setTimeout(() => btn.classList.remove('clicked'), 1500);
                  }}
                >
                  <span className="add-to-cart">Add to cart</span>
                  <span className="added">Added</span>
                  <FontAwesomeIcon icon={faShoppingCart} className="fa-shopping-cart" />
                  <FontAwesomeIcon icon={faBox} className="fa-box" />
                </button>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {isCartOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "350px",
                height: "100vh",
                background: "#fff",
                boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
                zIndex: 1050,
                overflowY: "auto",
                padding: "1rem"
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold">Your Cart</h4>
                <button className="btn btn-close" onClick={() => setIsCartOpen(false)} />
              </div>

              {cart.length === 0 ? (
                <p className="text-muted">Your cart is empty.</p>
              ) : (
                <>
                  <ul className="list-group mb-3">
                    {cart.map(item => (
                      <li key={item._id} className="list-group-item d-flex align-items-center">
                        <img src={item.imageUrl} alt={item.name} className="me-3 rounded" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                        <div className="flex-grow-1">
                          <div className="fw-bold">{item.name}</div>
                          <div className="d-flex align-items-center justify-content-between mt-1">
                            <span className="price-cart">₹{(item.price * item.quantity).toFixed(2)}</span>
                            <div>
                              <button className="btn btn-sm btn-outline-dark me-1 fw-bold" onClick={() => removeFromCart(item._id)}>-</button>
                              <span className="quantity">{item.quantity}</span>
                              <button className="btn btn-sm btn-outline-dark ms-1 fw-bold" onClick={() => addToCart(item)}>+</button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold">Total:</span>
                      <span className="fw-bold">₹{getTotal()}</span>
                    </div>
                    <button onClick={() => setShowPaymentModal(true)}>Checkout</button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Complete Your Order</h2>
              <form onSubmit={handlePayment}>
                <input
                  type="text"
                  placeholder="Name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Contact"
                  value={userInfo.contact}
                  onChange={(e) => setUserInfo({ ...userInfo, contact: e.target.value })}
                  required
                  pattern="^[0-9]{10}$"
                  title="Please enter a valid 10-digit phone number"
                />
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="">select payment option </option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                </select>
                <div className="button-group">
                  <button type="submit">Confirm Payment</button>
                  <button type="button" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast Message */}
        {toastMsg && (
          <div className="toast">
            {toastMsg}
            <button onClick={() => setToastMsg('')}>X</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
