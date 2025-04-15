import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import FoodCard from '../../components/food/FoodCard';
import FoodForm from '../../components/food/FoodForm';
import Button from '../../components/button'; // Adjust the path if needed

import { Search, PlusCircle, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Food.css';

const App = () => {
  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [vegFilter, setVegFilter] = useState('All');
  const navigate = useNavigate();

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

  const handleAddOrUpdateFood = async (foodData) => {
    try {
      if (foodData._id) {
        await axios.put(`http://localhost:5000/foods/${foodData._id}`, foodData);
      } else {
        await axios.post('http://localhost:5000/foods', foodData);
      }
      fetchFoods();
      setShowForm(false);
      setEditingFood(null);
    } catch (err) {
      console.error('Save error:', err.message);
    }
  };

  const handleDeleteFood = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/foods/${id}`);
      fetchFoods();
    } catch (err) {
      console.error('Delete error:', err.message);
    }
  };

  const handleEditFood = (food) => {
    setEditingFood(food);
    setShowForm(true);
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

            <select value={vegFilter} className="DROPDOWN"onChange={(e) => setVegFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>

            <Button
            onClick={() => {
              setEditingFood(null);
              setShowForm(true);
            }}
            className="add-button"
          >
            Add Food
          </Button>

          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="no-foods-container">
            <UtensilsCrossed className="no-foods-icon" />
            <h3 className="no-foods-title">No Food Items Found</h3>
            <p className="no-foods-description">Start by adding your first food item or try a different search.</p>
          </div>
        ) : (
          <div className="food-grid">
            {filteredFoods.map(food => (
              <FoodCard
                key={food._id}
                food={food}
                onEdit={handleEditFood}
                onDelete={handleDeleteFood}
              />
            ))}
          </div>
        )}

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <FoodForm
                editingFood={editingFood}
                onSuccess={() => {
                  fetchFoods();
                  setShowForm(false);
                  setEditingFood(null);
                }}
                onClose={() => setShowForm(false)}
              />
              <button className="close-modal" onClick={() => setShowForm(false)}>X</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
