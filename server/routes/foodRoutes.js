const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Middleware to validate food input
function validateFoodInput(req, res, next) {
  const { name, price, category, type } = req.body;
  if (!name || !price || !category || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (isNaN(price)) {
    return res.status(400).json({ error: 'Price must be a number' });
  }
  next();
}

router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    console.error('GET /foods error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', upload.single('image'), validateFoodInput, async (req, res) => {
  try {
    const { name, price, category, type } = req.body;
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';

    const food = new Food({ name, price, category, type, imageUrl });
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    console.error('POST /foods error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// PUT with image upload support
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const updated = await Food.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    console.error('PUT /foods error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    console.error('DELETE /foods error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;