
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },


  image: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
     ref: 'User'
},
  
});

blogSchema.pre('save', function(next) {
  if (!this.isModified('user')) {
    return next();
  }
  if (!this.user) {
    this.user = this._id;
  }
  next();
});


const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;




// const mongoose = require('mongoose');

// const blogSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   content: {
//     type: String,
//     required: true
//   },
//   author: {
//     type: String,
//     required: true
//   },
//   image: {
//     type: String,
//     required: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     required: false
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: false,
//     ref: 'User'
//   },
//   comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
// });

// blogSchema.pre('save', function(next) {
//   if (!this.isModified('user')) {
//     return next();
//   }
//   if (!this.user) {
//     this.user = this._id;
//   }
//   next();
// });

// const Blog = mongoose.model('Blog', blogSchema);

// module.exports = Blog;










