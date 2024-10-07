const express = require('express');
const router = express.Router();
const multer = require('multer');
const sendEmail = require("../utils/sendEmail");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const Reservation = require('../models/ReservationC');
const User = require('../models/user');
const Coaching = require('../models/coachings');

// Create a new reservation
router.post('/:coachingId', async (req, res) => {
  try {
    const coachingId = req.params.coachingId;
    const coaching = await Coaching.findById(coachingId);
    const existingReservation = await Reservation.findOne({ user: req.body.user, coaching: coachingId });
    if (existingReservation) {
      return res.status(400).json({ error: 'User already has a reservation for this coaching.' });
    }
    const reservation = new Reservation({
      username: req.body.username,
      age: req.body.age,
      reservationdate: req.body.reservationdate,
      user: req.body.user,
      emailuser: req.body.emailuser,
       phoneuser: req.body.phoneuser,
       coachingName : req.body.coachingName,
       coachName : req.body.coachName,
      coaching: coachingId
      
    });
    await reservation.save();
    
    const message = `Your reservation for ${reservation.coachingName} on ${reservation.reservationdate} has been confirmed.`;
    await sendEmail(reservation.emailuser, "Reservation confirmation", message);
    
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});






// Get all reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reservations for a specific user
router.get('/spesific', async (req, res) => {
  try {
    const user = req.query.user;
    const reservations = await Reservation.find({ user: user });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Get reservations for a specific user
router.get('/spesificc', async (req, res) => {
  try {
    const user = req.query.user;
    const coachingId = req.query.coaching;
    const reservations = await Reservation.find({ user: user, coaching: coachingId });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.get('/spesificc/:coachingId', async (req, res) => {
//   try {
//     const user = req.query.user;
//     const coachingId = req.params.coachingId;
//     const reservations = await Reservation.find({ user: user, coaching: coachingId });
//     res.json(reservations);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.get('/stats', async (req, res) => {
  try {
    const stats = await Reservation.aggregate([
      { $group: { _id: '$coachName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques de réservation.' });
  }
});


router.get('/chart', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    const labels = reservations.map(reservation => new Date(reservation.reservationdate).toLocaleDateString());
    const data = reservations.map(reservation => reservation.count);
    res.json({ labels, data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
router.get('/statsByDate', async (req, res) => {
  try {
    const statsByDate = await Reservation.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$reservationdate' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(statsByDate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});




// Get all reservations related to a coaching
router.get('/coaching/:coachingId', async (req, res) => {
  try {
    const reservations = await Reservation.find({ coaching: req.params.coachingId });
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get a single reservation
router.get('/:id', getReservation, (req, res) => {
  res.json(res.reservation);
});

// Update a reservation
router.patch('/:id', getReservation, async (req, res) => {
    if (req.body.username != null) {
      res.reservation.username = req.body.username;
    }
    if (req.body.age != null) {
      res.reservation.age = req.body.age;
    }
    if (req.body.reservationdate != null) {
      res.reservation.reservationdate = req.body.reservationdate;
    }
    try {
      const updatedReservation = await res.reservation.save();
      res.json(updatedReservation);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

// Delete a reservation
router.delete('/:id', getReservation, async (req, res) => {
  try {
    await res.reservation.remove();
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware function to get a reservation by ID
async function getReservation(req, res, next) {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (reservation == null) {
      return res.status(404).json({ message: 'Cannot find reservation' });
    }
    res.reservation = reservation;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = router;
