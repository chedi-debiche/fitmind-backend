const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Add a product to the cart
router.post('/add', async (req, res) => {
  try {
    const { user, product, quantity } = req.body;

    const existingCartItem = await Cart.findOne({ user, product });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      res.status(200).json(existingCartItem);
    } else {
      const newCartItem = await Cart.create({ user, product, quantity });
      res.status(201).json(newCartItem);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Display all items in the cart
router.get('/cart', async (req, res) => {
  try {
    const cartItems = await Cart.find().populate('user product');
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a product in the cart
router.put('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a product from the cart
router.delete('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.remove();

    res.status(204).json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
