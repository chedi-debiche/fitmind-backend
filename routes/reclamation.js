const express = require('express');
const router = express.Router();
const {Reclamation,validate} = require('../models/reclamation');
const {Evaluation} = require('../models/evaluation');



// Add a new reclamation
router.post('/add/:userId', async (req, res) => {
  try {
    const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });
    // user_id: req.params.userId;
    const reclamation = new Reclamation({
      description: req.body.description,
      user_id:req.params.userId,
      comments:req.body.comments,
      type:req.body.type

    });
    await reclamation.save();
    res.status(201).send("Your reclamation will be treated as soon as possible !");
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Get all reclamations
router.get('/getAll', async (req, res) => {
  try {
    const reclamations = await Reclamation.find();
    res.json(reclamations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a reclamation by id
router.get('/getById/:id', async (req, res) => {
  try {
    const reclamation = await Reclamation.findById(req.params.id);
    if (!reclamation) {
      return res.status(404).json({ message: 'Reclamation not found' });
    }
    res.json(reclamation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a reclamation by id
router.delete('/delete/:id', async (req, res) => {
  try {
    const reclamation = await Reclamation.findById(req.params.id);
    if (!reclamation) {
      return res.status(404).json({ message: 'Reclamation not found' });
    }
    await reclamation.remove();
    res.json({ message: 'Reclamation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a reclamation by id
// router.patch('/update/:id', async (req, res) => {
//   try {
//     const { error } = validate(req.body);
// 		if (error)
// 			return res.status(400).send({ message: error.details[0].message });
//     const reclamation = await Reclamation.findById(req.params.id);
//     if (!reclamation) {
//       return res.status(404).json({ message: 'Reclamation not found' });
//     }
//     Object.assign(reclamation, req.body);
//     await reclamation.save();
//     res.json(reclamation);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// }); 




router.post('/rating/:idu', async (req, res) => {
	try {
	  const { rating } = req.body;
	  const userId=req.params.idu;

	 
	 const evaluation = new Evaluation ({
    ratedBy: userId,
    rating:req.body.rating,
    
   });
  
	  await evaluation.save();
  
	  res.send("Thank you for evaluating our website");
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: 'Server Error' });
	}
  });


  router.patch('/update/:id', async (req, res) => {
    try {
      const newData = {
        description: req.body.description,
        type:req.body.type,
        comments:req.body.comments
      }

      const { error } = validate(newData);
      if (error)
        return res.status(400).send({ message: error.details[0].message });
      const reclamation = await Reclamation.findById(req.params.id);
      if (!reclamation) {
        return res.status(404).json({ message: 'Reclamation not found' });
      }
      Object.assign(reclamation, req.body);
      await reclamation.save();
      res.json(reclamation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });








module.exports = router;
