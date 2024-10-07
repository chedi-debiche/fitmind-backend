const express = require('express');
const router = express.Router();
const multer = require('multer');
const BlogPost = require('../models/blog');



// Define a storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create a multer middleware
const upload = multer({ storage: storage });



// Create a new coaching with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const newBlogPost = new BlogPost({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      image: req.file.filename, // store the filename in the database
       user: req.body.user // add the user ID of the creator
    });
    const savedBlogPost = await newBlogPost.save();

    res.status(201).json(savedBlogPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Update an existing blog post
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    let image;
    if (req.file) {
      image = req.file.filename;
    }
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(req.params.id, { title, content, author, image }, { new: true });
    res.json(updatedBlogPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Delete an existing blog post
router.delete('/:id', async (req, res) => {
  try {
    const deletedBlogPost = await BlogPost.findByIdAndDelete(req.params.id);
    res.json(deletedBlogPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (blogPost) {
      res.json(blogPost);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all blog posts by a specific user
router.get('/user/:id', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find({ user: req.params.id });
    res.json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().sort({ date: -1 }).limit(5);
    res.json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});








module.exports = router;
