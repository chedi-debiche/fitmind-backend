const router = require("express").Router();
const { User, validate ,validateUpdate} = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const authent = require('../middilware/authent')
const Joi = require("joi");


//const SECRET = '6LfG7dckAAAAAKQsntuGV7TrjHfeFUCVlRyNWbAH';

// router.post("/", async (req, res) => {
// 	try {
// 		const { error } = validate(req.body);
// 		if (error)
// 			return res.status(400).send({ message: error.details[0].message });

// 		let user = await User.findOne({ email: req.body.email });
// 		if (user)
// 			return res
// 				.status(409)
// 				.send({ message: "User with given email already Exist!" });

// 		const salt = await bcrypt.genSalt(Number(process.env.SALT));
// 		const hashPassword = await bcrypt.hash(req.body.password, salt);

// 		user = await new User({ ...req.body, password: hashPassword }).save();

// 		const token = await new Token({
// 			userId: user._id,
// 			token: crypto.randomBytes(32).toString("hex"),
// 		}).save();
// 		const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
// 		await sendEmail(user.email, "Email verification ", url);

// 		res
// 			.status(201)
// 			.send({ message: "An Email sent to your account please verify" });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).send({ message: "Internal Server Error" });
// 	}
// });

// router.get("/getById/:userId",authent,async (req, res) => {
// 	try {
// 		const data=await User.findById(req.params.userId);
// 		res.json(data);
	
// 	} catch (err) {
// 		res.send(err)
// 	}
// });

router.get("/getById/:id",authent,async (req, res) => {
	try {
		const data=await User.findById(req.params.id);
		res.json(data);
	
	} catch (err) {
		res.send(err)
	}
});

router.get('/:id', async (req, res) => {
	try {
	  const user = await User.findById(req.params.id);
	  res.json(user);
	} catch (err) {
	  console.error(err.message);
	  res.status(500).send('Server Error');
	}
  });
  

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		user = await new User({ ...req.body, password: hashPassword }).save();

		const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();
		
		const message = "Thank you for registering! Please verify your email address by clicking the link below.";
		 const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
		await sendEmail(user.email, "Email verification", url, message);

		res
			.status(201)
			.send({ message: "An Email sent to your account please verify" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});


router.get("/:id/verify/:token/", async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		await User.updateOne({ _id: user._id, verified: true });
		await token.remove();

		res.status(200).send({ message: "Email verified successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

 router.get("/", async (req, res) => {
 	try {
 	  const users = await User.find();
 	  res.status(200).send(users);
 	} catch (error) {
 	  console.log(error);
 	  res.status(500).send({ message: "Internal Server Error" });
 	}
   });


  //delete function

  router.delete("/:id", async (req, res) => {
	try {
	  const user = await User.findById(req.params.id);
	  if (!user)
		return res.status(404).send({ message: "User not found" });
  
	  await user.remove();
  
	  res.status(200).send({ message: "User deleted successfully" });
	} catch (error) {
	  console.log(error);
	  res.status(500).send({ message: "Internal Server Error" });
	}
  });


  // Block a user account


  router.put("/block/:id", async (req, res) => {
	try {

		const banned = { block: true };
		const Unbanned = { block: false };

		 us = await User.findById(req.params.id) ;
		if (us.block==false){
	  await  us.updateOne( banned, { new: true });
	  res.status(201).send("blocked");
		}
		else {
		await us.updateOne(Unbanned,{new: true}) ;
		res.status(201).send("unbanned");
		}


	} catch (error) {
	  console.log(error);
	  res.status(500).send({ message: "Internal Server Error" });
	}
  });




  router.put("/update/:id",authent,async (req,res)=>{
	
	try{
		const { error } = validateUpdate(req.body);
	
		if (error)
			return res.status(400).send({ message: error.details[0].message });  
		await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
		res.status(201).send("updated successfully");

	}catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});


router.get('/userRole/:id', async (req, res) => {
    try {
      const user= await User.findById(req.params.id);
	  
      res.status(200).send(user.userType);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});


  
// router.get('/:id', async (req, res) => {
// 	try {
// 	  const user = await User.findById(req.params.id);
// 	  res.json(user);
// 	} catch (err) {
// 	  console.error(err.message);
// 	  res.status(500).send('Server Error');
// 	}
//   });
  
  

module.exports = router;

