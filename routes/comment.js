const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const BlogPost = require('../models/blog')


// Create a new comment
// router.post('/', async (req, res) => {
//   try {
//     const { content, userId, blogId } = req.body;
//     const comment = new Comment({ content, userId, blogId });
//     const savedComment = await comment.save();
//     res.status(201).json(savedComment);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

router.post('/', async (req, res) => {
    try {
      const newComment = new Comment({
        comment: req.body.comment,
        user: req.body.user,
        blogpost: req.body.blogpost,
      });
      const savedComment = await newComment.save();
  
      res.status(201).json(savedComment);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

// Get all comments 

  router.get('/', async (req, res) => {
    try {
      const comments = await Comment.find();
      res.json(comments);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// // Get all comments for a blog post
router.get('/:id/', async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.id });
    res.json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//delete a comment
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    try {
      await comment.delete();
      res.status(200).json("comment deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//display all the comments



// Get comments for a specific blog post
// router.get('/blog/:blogId/comments', async (req, res) => {
//   try {
//     const comments = await Comment.find({ blogId: req.params.blogId });
//     res.json(comments);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const blogPost = await BlogPost.findById(req.params.id).populate('comments');
//     res.json(blogPost.comments);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });



// router.get('/recent-items', async (req, res) => {
//   try {
//     const recentItems = await fetchRecentItemsFromDatabase(); // Fetch recent items from a database
//     res.status(200).json(recentItems); // Send the recent items as a JSON response
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// });




module.exports = router;