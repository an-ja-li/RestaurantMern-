import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../pages/Food/Food.css';


const FoodForm = ({ onSuccess, editingFood, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Starter',
    type: 'Veg',
    imageUrl: '',
  });

  useEffect(() => {
    if (editingFood) {
      setFormData({
        ...editingFood,
        image: null
      });
    }
  }, [editingFood]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('type', formData.type);
    if (formData.image) data.append('image', formData.image);

    try {
      if (editingFood && editingFood._id) {
        await axios.put(`http://localhost:5000/foods/${editingFood._id}`, data);
      } else {
        await axios.post('http://localhost:5000/foods', data);
      }

      setFormData({ name: '', price: '', category: 'Starter', type: 'Veg', image: null });
      onSuccess();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>×</button>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="modal-form">
        <h2>{editingFood ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>

  <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />

  <div className="row">
    <select name="category" value={formData.category} onChange={handleChange}>
      <option value="Starter">Starter</option>
      <option value="Main Course">Main Course</option>
      <option value="Dessert">Dessert</option>
      <option value="Drinks">Drinks</option>
      <option value="Beverage">Beverage</option>
    </select>
    <input type="number" name="price" placeholder="Price (₹)" value={formData.price} onChange={handleChange} required />
  </div>

  <select name="type" value={formData.type} onChange={handleChange}>
    <option value="Veg">Vegetarian</option>
    <option value="Non-Veg">Non-Vegetarian</option>
  </select>

  <input type="file" accept="image/*" onChange={handleImageChange} />

  <div className="row">
    <button type="button" onClick={onClose}>Cancel</button>
    <button type="submit">{editingFood ? 'Update' : 'Save'}</button>
  </div>
</form>

      </div>
    </div>
  );
};

export default FoodForm;
