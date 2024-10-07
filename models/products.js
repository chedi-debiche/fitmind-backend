const mongoose = require('mongoose');




const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false,
    min: 0,
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Le prix doit être un nombre positif'
    }
  },
  
  image: {
    type: String,
    required: false
  },
  quantity: {
    type: Number,
    required: false,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'La quantité doit être un nombre entier'
    }
  },
  

  promotion: {
    type: Number,
    required: false,
    default: 0,
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'La promotion doit être un nombre positif'
    }
  },

  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
      },
      rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
      },
      review: {
        type: String,
        required : true,
        maxlength: 500
      }
    }
  ]




});
  

module.exports = mongoose.model('Product', ProductSchema);
