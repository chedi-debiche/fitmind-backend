const express = require('express');
const router = express.Router();
const multer = require('multer'); // Add this line
 const Stripe = require('stripe')(process.env.SECRET_KEY);
 const bodyParser = require('body-parser');
 const { User, validate ,validateUpdate} = require("../models/user");
 const Product = require('../models/products');

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // use the original filename
  }
});

const upload = multer({ storage: storage }); // create the Multer object


const accountSid = 'AC18ec9aedcf2464e929af3bb49ee96111';
const authToken = '65e89533cfd3ec18860c7295a8ed4f42';
const client = require('twilio')(accountSid, authToken);



// Create a new product with image upload
router.post('/', upload.single('image'), async (req, res) => {
    try {
      const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.file.filename, // store the filename in the database
        quantity: req.body.quantity,
        promotion: req.body.promotion


      });
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });


  router.get('/statsp', async (req, res) => {
    try {
      const stats = await Product.aggregate([
        { $group: { _id: '$name', count: { $sum: '$quantity' } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, name: '$_id', count: 1 } },
      ]);
      res.json(stats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques de achat de produits.' });
    }
  });
  
  

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// Get a single product
router.get('/:id', getProduct, (req, res) => {
  res.json(res.product);
});

// Update a product with image upload
router.patch('/:id', getProduct, upload.single('image'), async (req, res) => {
    if (req.body.name != null) {
      res.product.name = req.body.name;
    }
    if (req.body.description != null) {
      res.product.description = req.body.description;
    }
    if (req.body.price != null) {
      res.product.price = req.body.price;
    }
    if (req.file != null) { // check if file was uploaded
      res.product.image = req.file.filename; // store the new filename
    }
    if (req.body.quantity != null) {
      res.product.quantity = req.body.quantity;
    }
    if (req.body.promotion != null) {
      res.product.promotion = req.body.promotion;
    }
    try {
      const updatedProduct = await res.product.save();
      res.json(updatedProduct);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
// Delete a product
router.delete('/:id', getProduct, async (req, res) => {
  try {
    await res.product.remove();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware function to get a product by ID
async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: 'Cannot find product' });
    }
    res.product = product;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

router.post('/payment', async (req, res) => {
  let status, error;
  const { token, amount } = req.body;
  try {
    await Stripe.charges.create({
      source: token.id,
      amount,
      currency: 'usd',
    });
    status = 'success';
  } catch (error) {
    console.log(error);
    status = 'Failure';
  }
  res.json({ error, status });
});


router.post('/send-sms', (req, res) => {
  const { message, to } = req.body;
  
  client.messages
    .create({
      body: message,
      from: '+15856202425',
      to: to
    })
    .then(() => {
      res.send('SMS sent!');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Failed to send SMS');
    });
});



// define a route for auto-suggest search
router.get('/search', (req, res) => {
  const term = req.query.term.toLowerCase();
  const suggestions = Product.filter((product) => product.name.toLowerCase().startsWith(term));
  res.json(suggestions);
});


router.post('/:productId/promotions', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    product.promotion = req.body.promotion;
    await product.save();
    res.status(200).send({ message: 'Promotion added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
});





router.post('/:productId/reviews', async (req, res) => {
  try {
    const { userId , rating, review } = req.body;
    // const userId = await User.findOne({ _id: req.params.id });
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.reviews.push({ userId, rating, review });
    await product.save();

    const totalRating = calculateTotalRating(product.reviews);

    res.json({ message: 'Review added successfully', totalRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

function calculateTotalRating(reviews) {
  let total = 0;
  for (let review of reviews) {
    total += review.rating;
  }
  return total;
}






module.exports = router;
