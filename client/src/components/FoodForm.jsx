import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodForm = ({ onSuccess, editingFood }) => {
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
        image: null // Don't pre-fill image
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
        // 👇 Update existing item
        await axios.put(`http://localhost:5000/foods/${editingFood._id}`, data);
      } else {
        // 👇 Create new item
        await axios.post('http://localhost:5000/foods', data);
      }
  
      // ✅ Reset form and refresh list
      setFormData({ name: '', price: '', category: 'Starter', type: 'Veg', image: null });
      onSuccess();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="text" name="name" placeholder="Food Name" value={formData.name} onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />

      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="Starter">Starter</option>
        <option value="Main Course">Main Course</option>
        <option value="Dessert">Dessert</option>
        <option value="Drinks">Drinks</option>
        <option value="Beverage">Beverage</option>
      </select>

      <select name="type" value={formData.type} onChange={handleChange}>
        <option value="Veg">Veg</option>
        <option value="Non-Veg">Non-Veg</option>
      </select>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      <button type="submit">{editingFood ? 'Update' : 'Add'} submit</button>
    </form>
  );
};

export default FoodForm;
