const express = require('express');
const router = express.Router();
const multer = require('multer');
const {Gym,validate} = require('../models/gym');
const Subscription = require('../models/subscription');
const Offer = require('../models/offer');
const upload = require('../config/multerConfig');
const path = require('path');
const { default: Stripe } = require('stripe');
const Joi = require("joi");


const twilio = require('twilio');






const stripe = require('stripe')('sk_test_51MqwXKLtZDUJknUFE722lacEc8I0b1kyH9OJyfQOIqDbnlX143oZCABQXWMheTwAaKptkpaXOxyTWzJzXAN72EHj00B8ej4W5b');




router.post("/stripe/:idg/:idu/:ido",async(req,res)=>{
	const {idg,idu,ido}=req.params;
	let {amount , id}=req.body;
	try{
		const Payment=await stripe.paymentIntents.create({
			amount:amount,
			currency: 'EUR',
			description: 'Monthly subscription for access to our gym facilities',
			payment_method:id,
			confirm:true,
		});

		// Find the user's active subscriptions for that gym in order to avoid a double subscription
		const activeSubscriptions = await Subscription.find({
			user: idu,
			gym: idg,
			status: "active"
		});
		if (activeSubscriptions.length > 0) {
			return res.status(400).json({ message: "You already have an active subscription for this gym" });
		}

		const startDate=new Date();
		const endDate = new Date();
		endDate.setMonth(endDate.getMonth() + 1);
		const newSubscription = new Subscription({
			user:idu, // Assuming you are using passport and req.user contains the user object
			gym: idg,
			offer:ido,
			startDate: startDate,
			endDate: endDate,
			// stripeSubscriptionId: subscription.id,
		  });


		  const gyms1 = await Gym.findById(idg);
		  gyms1.participant = await gyms1.participant + 1;
		  gyms1.save();
		  console.log(gyms1.participant);

		await newSubscription.save();

		
		const phoneNumber = '+21628499722';
	
		const accountSid = 'AC9b7d1f01a2a2393e47097587ca0a19e7';
		const authToken = 'b4e950019e5d1ef9a0d6a17cf85798a6';
		const client = new twilio(accountSid, authToken);
		const message = `Thank you for subscribing to our gym. Your subscription is now active`;
    	await client.messages.create({ body: message, from: '+16232788531', to: phoneNumber });


		res.json({
			message:"Payment success ",
			success:true,
		})
	}catch(error){
		console.log("error...",error);
		res.json({
			message:"Payment failed ",
			success:false,
		})
	}
});



// Initialize Multer with desired configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname)
//     }
//   });
  
//   const upload = multer({ storage: storage }).array('photo',5);

  // Handle file upload request
// router.post('/upload',upload.array('photo', 5), function(req, res) {
//     res.send('File uploaded successfully');
// });
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));


//add new gym
router.post("/add/:idu", upload.array('photo', 5), async (req, res) => {
	try {
		const {idu} = req.params ;
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let gymExist = await Gym.findOne({ name: req.body.name });
		if (gymExist)
			return res
				.status(409)
				.send({ message: "Gym already Exist!" });
        const gym=new Gym({
            name: req.body.name,
            description: req.body.description,
            services: req.body.services,
            photo: req.files.map(file =>file.filename),
            localisation: req.body.localisation,
			user : idu

        });

		await gym.save();
		res.status(201)
			.send({ message: "Gym added successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});


//getAll
router.get("/getAll", async (req, res) => {
    try {
      const gyms = await Gym.find();
      res.status(200).send(gyms);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});


//getById
router.get("/:id",async (req, res) => {
	try {
		const data=await Gym.findById(req.params.id);
		res.json(data);
		//res.status(200).send(data);
	} catch (err) {
		res.send(err)
	}
});


//find by localisation

  router.get("/findbyloc/:localisation", async (req, res) => {
	const localisation = req.params.localisation;
	const filteredGyms = await Gym.find({ localisation: localisation }).exec();
	res.json(filteredGyms);
  });

  


/*find by name
 router.get("/findbyName/:name", async (req, res) => {
	const name = req.params.name;
	const filteredGyms = await Gym.find({ name: name }).exec();
	res.json(filteredGyms);
  });*/

 /* //find by service
  router.get("/findbyService/:services", async (req, res) => {
	const services = req.params.services;
	const filteredGyms = await Gym.find({ services: services }).exec();
	res.json(filteredGyms);
  });*/

//delete

router.delete("/:id", async (req, res) => {
	try {
	  const gym = await Gym.findById(req.params.id);
	  if (!gym)
		return res.status(404).send({ message: "Gym not found" });
  
	  await gym.remove();
  
	  res.status(200).send({ message: "Gym deleted successfully" });
	} catch (error) {
	  console.log(error);
	  res.status(500).send({ message: "Internal Server Error" });
	}
  }); 




  
// update
router.put("/update/:id", upload.array('photo', 5),async (req,res)=>{
	
	try{
		const { error } = validate(req.body);
	
		if (error)
			return res.status(400).send({ message: error.details[0].message });
			
		const updatedFields = {
			name: req.body.name,
			description: req.body.description,
			services: req.body.services,
			photo: req.files.map(file =>file.filename),
			localisation: req.body.localisation,
		};	
		await Gym.findByIdAndUpdate(req.params.id,updatedFields,{new:true});
		res.status(201).send("updated successfully");

	}catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});



// Route to update gym rating
// router.put('/rating/:id', async (req, res) => {
// 	try {
//         const {rating}=req.body;
// 		await Gym.findByIdAndUpdate(req.params.id,{rating},{new:true});
// 	  // Return the updated gym object
// 	    res.status(201).send("rated successfully");

// 	} catch (err) {
// 	  console.error(err.message);
// 	  res.status(500).send('Server Error');
// 	}
// });

router.put('/rating/:id/:idu', async (req, res) => {
	try {
	  const { rating } = req.body;
	  const userId=req.params.idu;

	 

	  const gym = await Gym.findById(req.params.id);
	  if (gym.ratedBy.includes(userId)) {
		// The user has already rated this gym
		return res.status(400).json({ message: 'You have already rated this gym' });
	  }
  
	  const updatedGym = await Gym.findByIdAndUpdate(req.params.id,{$push:{ ratings:req.body.rating },$addToSet: { ratedBy: userId}}, { new: true });
  
	  // Calculate the average rating
	  const ratings = updatedGym.ratings;
	  const avgRating = Math.round((ratings.reduce((acc, cur) => acc + cur, 0) + rating) / (ratings.length + 1));
  
	  // Update the average rating of the gym
	  updatedGym.rating = avgRating;
	  await updatedGym.save();
  
	  res.send("rated successfully");
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: 'Server Error' });
	}
  });





//add an offer and associate it to a gym
router.post('/:gymId/offers', async (req, res) => {
	const { name, type, price } = req.body;
	const gymId = req.params.gymId;
  
	try {
	  // Validate offer details
	  if (!name || !type || !price) {
		return res.status(400).json({ error: 'Please provide name, type, and price for the offer' });
	  }
	  const createdAt=new Date();
	  const updatedAt = new Date();
  
	  // Create new offer object
	  const offer = new Offer({
		name:name,
		type:type,
		price:price,
		gym:gymId,
		createdAt:createdAt,
		updatedAt:updatedAt,

	  });
  
	  // Associate the offer with the gym
	  const updatedGym = await Gym.findByIdAndUpdate(gymId, { $push: { offers: offer } }, { new: true });
  
	  if (!updatedGym) {
		return res.status(404).json({ error: 'Gym not found' });
	  }
  
	  offer.save();
	  res.json({ offer });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
});


// GET gym offer by ID
router.get('/:gymId/offer/:offerId', async (req, res) => {
	try {
	  const { gymId, offerId } = req.params;
	  const gym = await Gym.findById(gymId);
	  if (!gym) {
		return res.status(404).json({ error: 'Gym not found' });
	  }
	  const offer = gym.offers.find(offer => offer._id.toString() === offerId);
	  if (!offer) {
		return res.status(404).json({ error: 'Offer not found' });
	  }
	  res.json(offer);
	} catch (error) {
	  console.error(error);
	  res.status(500).send('Server error');
	}
  });

  //get offer by its id
  router.get('/offers/:id', async (req, res) => {
	try {
	  const offer = await Offer.findById(req.params.id);
	  if (!offer) {
		return res.status(404).json({ message: 'Offer not found' });
	  }
	  res.json(offer);
	} catch (err) {
	  console.error(err);
	  res.status(500).send('Server Error');
	}
});


//get offer by id Gym
router.get('/getOffersByGym/:id', async (req, res) => {
	try {
	  const offer = await Offer.find({gym:req.params.id});
	  if (!offer) {
		return res.status(404).json({ message: 'There is no offer' });
	  }
	  res.json(offer);
	} catch (err) {
	  console.error(err);
	  res.status(500).send('Server Error');
	}
});



  
router.get('/rating/r',async (req,res) => {
	try{
	const gym = await Gym.findOne().sort('-rating').limit(1); 
	res.json(gym) ;

	}
	catch(err){
console.error(err) ;
res.status(500).send('Server Error');
	}
  } 
) ;



router.get('/getGymsByManager/:id', async (req, res) => {
    try {
      const gym = await Gym.find({user:req.params.id});
      res.status(200).send(gym);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});



router.get('/subscription/getByUser/:id', async (req, res) => {
    try {
      const subscriptions = await Subscription.find({user:req.params.id}).populate('gym').populate('offer');
      res.status(200).send(subscriptions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});





router.get('/sort/:sortOrder', async (req, res) => {
	const sortOrder = req.params.sortOrder;
	const gyms = await Gym.find();
	let sortedGyms;
  
	switch (sortOrder) {
	  case 'highest-rated':
		sortedGyms = gyms.sort((a, b) => b.rating - a.rating);
		break;
	  case 'lowest-rated':
		sortedGyms = gyms.sort((a, b) => a.rating - b.rating);
		break;
	  default:
		sortedGyms = gyms;
		break;
	}
  
	res.json(sortedGyms);
  });


  // Filter gyms by rating
router.get('/filter/:rating', async (req, res) => {
	const rating = req.params.rating;
	const gyms = await Gym.find({ rating: { $gte: rating } });
	res.json(gyms);
  });




router.get('/search/:name', async (req, res) => {
	const { name } = req.params;
  
	try {
	  const gyms = await Gym.find({ name: { $regex: new RegExp(name, 'i') } });
	  res.json(gyms);
	} catch (error) {
	  console.error(error);
	  res.status(500).send('Server error');
	}
});




router.get('/searchBy/:searchBy/:term', async (req, res) => {
	const { searchBy,term } = req.params;
  
	try {
		if (searchBy === 'name') {
			const gyms = await Gym.find({ name: { $regex: new RegExp(term, 'i') } });
			res.json(gyms);

		}
		if (searchBy === 'localisation') {
			const gyms = await Gym.find({ localisation: { $regex: new RegExp(term, 'i') } });
			res.json(gyms);

		}
	 
	} catch (error) {
	  console.error(error);
	  res.status(500).send('Server error');
	}
});

router.get('/gym-performance/:id',async (req, res) => {

	const gym = await Gym.findById(req.params.id);

  const creationDate = await gym.date ; 
  const today = await new Date();

  const numberOfParticipants = await gym.participant; 
  
  const daysSinceCreation = await Math.round((today - creationDate) / (1000 * 60 * 60 * 24)); 

  //let performance;
  if ( daysSinceCreation > numberOfParticipants ) {
    gym.performance = 'bad';
	gym.days = daysSinceCreation;
	gym.save();
  } else if ( daysSinceCreation === numberOfParticipants ) {
    gym.performance = 'normal';
	gym.days = daysSinceCreation;
	gym.save();
  } else {
    gym.performance = 'good'; 
	gym.days = daysSinceCreation;
	gym.save();
  }


  console.log(creationDate)
  console.log(gym.performance)
  res.json({
    performance,
    creationDate,
    today,
    numberOfParticipants,
	daysSinceCreation,
	
  });
});

  
  
  
  
    


module.exports = router;