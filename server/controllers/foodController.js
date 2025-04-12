import FoodItem from '../models/Food.js';

export const getAllFoods = async (req, res) => {
  const items = await FoodItem.find({});
  res.json(items);
};

export const createFood = async (req, res) => {
  const item = new FoodItem(req.body);
  const saved = await item.save();
  res.status(201).json(saved);
};

export const updateFood = async (req, res) => {
  const updated = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteFood = async (req, res) => {
  await FoodItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
};