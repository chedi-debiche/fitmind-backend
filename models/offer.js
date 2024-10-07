const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Monthly', 'Annual'],
    default: 'Monthly'
  },
  price: {
    type: Number,
    required: true
  },
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    
  },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active'
  }
});

module.exports = mongoose.model('Offer', offerSchema);
