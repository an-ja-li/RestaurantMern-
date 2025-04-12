import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FoodCard from '../components/FoodCard';
import FoodForm from '../components/FoodForm';
import './Food.css';

const App = () => {
  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const addOrUpdateFood = async (foodData) => {
    try {
      if (foodData._id) {
        await axios.put(`http://localhost:5000/foods/${foodData._id}`, foodData);
      } else {
        await axios.post('http://localhost:5000/foods', foodData);
      }
      
      setEditingFood(null);
    } catch (err) {
      console.error('Save error:', err.message);
    }
  };

  const deleteFood = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/foods/${id}`);
      fetchFoods();
    } catch (err) {
      console.error('Delete error:', err.message);
    }
  };

  return (
    <div className="app">
      <h1>🍔 Restaurant Menu</h1>
      <FoodForm onSuccess={fetchFoods} editingFood={editingFood} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid">
          {foods.map(food => (
            <FoodCard
              key={food._id}
              food={food}
              onEdit={setEditingFood}
              onDelete={deleteFood}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
