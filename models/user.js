const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const { string } = require("joi");
const { type } = require("os");
require('dotenv').config();
const secretKey = 'my-secret-key';



const userSchema = new mongoose.Schema({
	profile: { type: String },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	verified: { type: Boolean, default: true },
	block :{type : Boolean,default : false},
	phone : {type : String , required : true},
	userType :{
		type :String,
		enum : ['User', 'Coach', 'GymManager','Admin'],
		default : 'User'
	},
	experience :{
		type : Number,
		required: function() {
			return this.userType === 'Coach';
		},
	},
	gender: {
		type: String,
		enum: ['man', 'woman'],
		required: function() {
			return this.userType === 'Coach';
		},
	},
	certificate: {
		title: {
			type: String,
			required: function() {
				return this.userType === 'Coach';
			},
		},
		date: {
			type: Date,
			required: function() {
				return this.userType === 'Coach';
			},
		},
		file: {
			type: String,
			required: function() {
				return this.userType === 'Coach';
			},
		},
	},
	location :{
		type : String,
		required: function() {
			return this.userType === 'GymManager';
		},
	},

	
	token:String


	
});


// userSchema.methods.generateAuthToken = function () {
// 	const token = jwt.sign({sub:this._id}, secretKey, {
// 		expiresIn: "7d",
// 	});
// 	return token;
// };

const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({

		
		// profile: Joi.string()
		//  .empty()
		//  .required()
		//  .messages({
		//   'any.required': 'votre image est requis',
		//    'string.empty': 'votre image ne doit pas être vide',
		//  }),
	
	  firstName: Joi.string()
		.empty()
		.required()
		.messages({
		  'any.required': 'Le prénom est requis',
		  'string.empty': 'Le prénom ne doit pas être vide',
		}),
	  lastName: Joi.string().required().messages({
		'any.required': 'Le nom est requis',
	  }),
	  email: Joi.string()
		.email()
		.required()
		.messages({
		  'any.required': 'L\'adresse email est requise',
		  'string.email': 'Veuillez entrer une adresse email valide',
		}),
	  password: passwordComplexity().required().messages({
		'any.required': 'Le mot de passe est requis',
		'passwordComplexity.tooShort': 'Le mot de passe doit avoir au moins 6 caractères',
		'passwordComplexity.tooWeak': 'Le mot de passe doit être plus complexe',
	  }),
	//   address: Joi.string().required().messages({
	// 	'any.required': 'L\'adresse est requise',
	//   }),
	  phone: Joi.string()
		.trim()
		.required()
		.pattern(/^\d{8}$/)
		.messages({
		  'any.required': 'Le numéro de téléphone est requis',
		  'string.pattern.base': 'Le numéro de téléphone doit être composé de 8 chiffres',
		}),
		userType: Joi.string().required().valid('User', 'Coach','GymManager','Admin').messages({
			'any.required': 'Le type d\'utilisateur est requis',
			'any.only': 'Le type d\'utilisateur doit être "User" ou "Coach" ou "GymManager',
		}),
		experience: Joi.when('userType', {
			is: 'Coach',
			then: Joi.number().required(),
			otherwise: Joi.number().optional()
		  }),
		  gender: Joi.when('userType', {
			is: 'Coach',
			then: Joi.string().valid('man', 'woman').required(),
			otherwise: Joi.optional()
		  }),
		  certificate: Joi.when('userType', {
			is: 'Coach',
			then: Joi.object({
			  title: Joi.string().required(),
			  date: Joi.date().required(),
			  file: Joi.string()
			  .pattern(/\.pdf$/)
			  .messages({
				  'string.pattern.base': 'Le fichier doit être un PDF',
			  }),
			}).required(),
			otherwise: Joi.optional(),
		  }),
		  location: Joi.when('userType', {
			is: 'GymManager',
			then: Joi.string().required(),
			otherwise: Joi.string().optional()
		  }),
		
	});
  
	return schema.validate(data, { abortEarly: false });
  };

  const validateUpdate = (data) => {
	const schema = Joi.object({
	  firstName: Joi.string()
		.empty()
		.required()
		.messages({
		  'any.required': 'Le prénom est requis',
		  'string.empty': 'Le prénom ne doit pas être vide',
		}),
	  lastName: Joi.string().required().messages({
		'any.required': 'Le nom est requis',
	  }),
	  email: Joi.string()
		.email()
		.required()
		.messages({
		  'any.required': "L'adresse email est requise",
		  'string.email': 'Veuillez entrer une adresse email valide',
		}),
	  phone: Joi.string()
		.trim()
		.required()
		.pattern(/^\d{8}$/)
		.messages({
		  'any.required': 'Le numéro de téléphone est requis',
		  'string.pattern.base': 'Le numéro de téléphone doit être composé de 8 chiffres',
		}),

		experience: Joi.when('userType', {
			is: 'Coach',
			then: Joi.number().required(),
			otherwise: Joi.number().optional()
		  }),
		  gender: Joi.when('userType', {
			is: 'Coach',
			then: Joi.string().valid('man', 'woman').required(),
			otherwise: Joi.optional()
		  }),
		  certificate: Joi.when('userType', {
			is: 'Coach',
			then: Joi.object({
			  title: Joi.string().required(),
			  date: Joi.date().required(),
			  file: Joi.string()
			  .pattern(/\.pdf$/)
			  .messages({
				  'string.pattern.base': 'Le fichier doit être un PDF',
			  }),
			}).required(),
			otherwise: Joi.optional(),
		  }),
		  location: Joi.when('userType', {
			is: 'GymManager',
			then: Joi.string().required(),
			otherwise: Joi.string().optional()
		  }),

	});
  
	return schema.validate(data, { abortEarly: false });
  };
  
  
  
module.exports = { User, validate ,validateUpdate};
