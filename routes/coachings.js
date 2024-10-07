const express = require('express');
const router = express.Router();
const multer = require('multer');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // use the original filename
  }
});

const upload = multer({ storage: storage });

const Coaching = require('../models/coachings');
const User = require('../models/user');
//const Reservation = require('../models/ReservationC');

// Get all coachings for a specific user

// router.get('/:coachingId', async (req, res) => {
//   try {
//     const coaching = await Coaching.findById(req.params.coachingId);
//     if (!coaching) {
//       return res.status(404).json({ message: 'Coaching not found' });
//     }
//     res.json(coaching);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



//Create a new coaching with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
   // const user = await User.findById(req.body.user);
   // const user = await User.findById(user_id);
    const coaching = new Coaching({
      nameCoaching: req.body.nameCoaching,
      nameCoach: req.body.nameCoach,
      description: req.body.description,
      image: req.file.filename, // store the filename in the database
      rating: req.body.rating ,// add rating as an optional field
      category : req.body.category,
      user: req.body.user,
      start : req.body.start,
      end : req.body.end,
     // availability: req.body.availability
     // user: req.auth.user_id // use the authenticated user ID instead of req.user._id
     // user: req.user._id
     // createdBy: req.user._id // add the user ID of the creator
    });
    await coaching.save();
    res.status(201).json(coaching);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Get all coachings
router.get('/', async (req, res) => {
  try {
    const coachings = await Coaching.find();
    res.json(coachings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const user = req.query.user; // retrieve the user id from the query parameter
    const coachings = await Coaching.find({ user: user }); // filter coachings by user id
    res.json(coachings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/spesific', async (req, res) => {
  try {
    const user = req.query.user; // retrieve the user id from the query parameter
    const coachings = await Coaching.find({ user: user }); // filter coachings by user id
    res.json(coachings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Get a single coaching
router.get('/:id', getCoaching, (req, res) => {
  res.json(res.coaching);
});

// Update a coaching with image upload
router.patch('/:id', getCoaching, upload.single('image'), async (req, res) => {
    if (req.body.nameCoaching != null) {
      res.coaching.nameCoaching = req.body.nameCoaching;
    }
    if (req.body.nameCoach != null) {
      res.coaching.nameCoach = req.body.nameCoach;
    }
    if (req.body.description != null) {
      res.coaching.description = req.body.description;
    }
    if (req.file != null) { // check if file was uploaded
      res.coaching.image = req.file.filename; // store the new filename
    }
    if (req.body.rating != null) { // add rating as an optional field
      res.coaching.rating = req.body.rating;
    }
    if (req.body.category != null) { // add rating as an optional field
      res.coaching.category = req.body.category;
    }
    if (req.body.start != null) { // add rating as an optional field
      res.coaching.start = req.body.start;
    }
    if (req.body.end != null) { // add rating as an optional field
      res.coaching.end = req.body.end;
    }
    // if (req.body.availability != null) { // add rating as an optional field
    //   res.coaching.availability = req.body.availability;
    // }
    try {
      const updatedCoaching = await res.coaching.save();
      res.json(updatedCoaching);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

// Delete a coaching
router.delete('/:id', getCoaching, async (req, res) => {
  try {
    await res.coaching.remove();
    res.json({ message: 'Coaching deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware function to get a coaching by ID
async function getCoaching(req, res, next) {
  try {
    const coaching = await Coaching.findById(req.params.id);
    if (coaching == null) {
      return res.status(404).json({ message: 'Cannot find coaching' });
    }
    res.coaching = coaching;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update the rating of a coaching
router.put('/:id/rating', getCoaching, async (req, res) => {
  const { rating } = req.body;
  if (rating === undefined || rating === null) {
    return res.status(400).json({ error: 'Rating is required' });
  }
  try {
    res.coaching.rating = rating;
    const updatedCoaching = await res.coaching.save();
    res.json(updatedCoaching);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



module.exports = router;