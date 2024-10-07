const router = require("express").Router();
const { User } = require("../models/user");
//const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const secretKey = 'my-secret-key';
const session= require('express-session')


router.use(session({
    secret:'my-secret-key',
    resave:false,
    saveUninitialized:false,
}));

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Password" });

		if (!user.verified) {
			return res.status(401).send({ message: "User not verified yet" });
		}

		if (user.block) {
			return res.status(401).send({ message: "This account is blocked. Please contact our client service" })
		}

		// Retrieve userType from the user document
		const userType = user.userType;

		req.session.user = user.email;

		const token = await jwt.sign({ sub: user._id }, secretKey, { expiresIn: '7d' });
		return res.cookie({ "token": token }).send({ token: token, message: 'loggedIn successfully', userId: user._id, userType: userType });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});


router.post('/logout',function(req,res){
	req.session.destroy(function(err){
		if(err){
			console.log(err);
			res.status(500).send('Error logging out')
		}else{
			res.send("logged out successfully");
		}
	});
});

router.get('/protected',IsLoggedIn,function(req,res){
	
			res.send("authorized to access");
		});

function IsLoggedIn(req,res,next){
	if (req.session.user){
		next();
	}else{
		res.status(401).send('not authorized');
	}
}
	



const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;
