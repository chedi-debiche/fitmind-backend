const mongoose = require('mongoose');
const Joi = require("joi");


const ReclamationSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
     },
  date: {
    type: Date,
    default: Date.now 
    },
  status: { 
    type: String, 
    enum: ['pending', 'resolved', 'rejected'], 
    default: 'pending' 
    },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
    required: true 
    },
  type: {
    type: String,
    enum: ['bug', 'feature request', 'complaint','information request', 'other'],
    default: 'other'
  },
  comments: {
    type: String,
    default: ''
    },
//   assigned_to: { type: String },
//   resolution_date: { type: Date },
//   resolution_details: { type: String },
});
const Reclamation = mongoose.model("Reclamation", ReclamationSchema);

const validate = (data) => {
	const schema = Joi.object({

	description: Joi.string().required().messages({
		'any.required': 'description is required',
	  }),

    comments: Joi.string().required().messages({
      'any.required': 'comments is required',
    }),

    type: Joi.string().required().messages({
      'any.required': 'type is required',
    }),
	 
	 
		
		
	});
  
	return schema.validate(data, { abortEarly: false });
  };
// module.exports = mongoose.model('Reclamation', ReclamationSchema);
module.exports = {Reclamation, validate};
