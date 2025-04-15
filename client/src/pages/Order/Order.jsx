import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Button from '../../components/button'; // Adjust the path if needed
import { Search, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBox } from '@fortawesome/free-solid-svg-icons';
import '../Food/Food.css';
import'../Order/Order.css';


const App = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [vegFilter, setVegFilter] = useState('All');

  // Cart related
  const [cart, setCart] = useState([]);
  const [toastMsg, setToastMsg] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const MAX_QUANTITY = 10;

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/foods');
      setFoods(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const addToCart = (food) => {
    const parsedPrice = parseFloat(food.price);
    if (isNaN(parsedPrice)) {
      showToast(`Error: '${food.name}' has an invalid price`);
      return;
    }

    const foodWithParsedPrice = { ...food, price: parsedPrice };
    const existingItem = cart.find(item => item._id === food._id);

    if (existingItem) {
      if (existingItem.quantity >= MAX_QUANTITY) {
        showToast(`Maximum ${MAX_QUANTITY} units allowed for '${food.name}'`);
        return;
      }
      setCart(
        cart.map(item =>
          item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...foodWithParsedPrice, quantity: 1 }]);
    }

    showToast(`${food.name} has been added to your cart.`);
  };

  const removeFromCart = (id) => {
    const existingItem = cart.find(item => item._id === id);

    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map(item =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    } else {
      setCart(cart.filter(item => item._id !== id));
    }
  };

  const getTotal = () => {
    return cart
      .filter(item => typeof item.price === 'number' && !isNaN(item.price))
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    showToast(`Your order of ₹${getTotal()} has been placed successfully!`);
    setCart([]);
  };

  const filteredFoods = useMemo(() => {
    let filtered = [...foods];

    if (searchTerm.trim()) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(food => food.category === categoryFilter);
    }

    if (vegFilter !== 'All') {
      filtered = filtered.filter(food => food.type === vegFilter);
    }

    return filtered;
  }, [foods, searchTerm, categoryFilter, vegFilter]);

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
          className=" cart-button"
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
                <button
                  className="btn btn-close"
                  onClick={() => setIsCartOpen(false)}
                />
              </div>

              {cart.length === 0 ? (
                <p className="text-muted">Your cart is empty.</p>
              ) : (
                <>
                  <ul className="list-group mb-3">
                    {cart.map(item => (
                      <li key={item._id} className="list-group-item d-flex align-items-center">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="me-3 rounded"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-bold">{item.name}</div>
                          <div className="d-flex align-items-center justify-content-between mt-1">
                            <span className=" price-cart">₹{(item.price * item.quantity).toFixed(2)}</span>
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
                    <button className="checkout" onClick={handleCheckout}>
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
