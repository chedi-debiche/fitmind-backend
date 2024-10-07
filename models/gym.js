const mongoose = require('mongoose');
const Joi = require("joi");
const { number } = require('joi');


const GymSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  services: {
    type: String,
    required: true
  },
  photo: {
    type: [String],
    required: false
  },
  participant: {
    type: Number,
    default: 0,
    min: 0,

  },
  user :{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : true
    
  },
 
  localisation: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratings: [{
    type: Number,
    min: 0,
    max: 5
  }],
  ratedBy:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  offers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer'
  }],

  performance: { 
    type: String, 
    enum: ['bad', 'normal', 'good'], 
    default: 'normal' 
    },
    days: {
      type: Number,
      default: 0,
      
  
    },
    date: {
      type: Date,
      default: Date.now 
      },
 
});

const Gym = mongoose.model("Gym", GymSchema);

const validate = (data) => {
	const schema = Joi.object({
	
	  name: Joi.string()
		.empty()
		.required()
		.messages({
		  'any.required': 'Name of gym is required',
		  'string.empty': 'Name of gym could not be empty',
		}),
	  description: Joi.string().required().messages({
		'any.required': 'description is required',
	  }),
    services: Joi.string().required().messages({
      'any.required': 'services is required',
    }),

    localisation: Joi.string().required().messages({
      'any.required': 'localisation is required',
    }),
	 
		
		
	});
  
  
	return schema.validate(data, { abortEarly: false });
  };

  module.exports = { Gym, validate};

