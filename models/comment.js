

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
     ref: 'User'
},
  blogpost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  }
});

commentSchema.pre('save', function(next) {
    if (!this.isModified('user')) {
      return next();
    }
    if (!this.user) {
      this.user = this._id;
    }
    next();
  });
  

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;














// const mongoose = require('mongoose');

// const commentSchema = new mongoose.Schema({
//   comment: {
//     type: String,
//     required: true
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User'
//   },
//   blog: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Blog',
//     required: false
//   }
// });

// commentSchema.pre('save', function(next) {
//   if (!this.isModified('user')) {
//     return next();
//   }
//   if (!this.user) {
//     this.user = this._id;
//   }
//   next();
// });

// const Comment = mongoose.model('Comment', commentSchema);

// module.exports = Comment;











