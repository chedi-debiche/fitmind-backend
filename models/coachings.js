const mongoose = require('mongoose');

const CoachingSchema = new mongoose.Schema({
  nameCoaching: {
    type: String,
    required: true
  },
  nameCoach: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: false,
    min: 0,
    max: 5
  },
  category: {
    type: String,
    required: true,
    enum: ['sport', 'psychologist']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true
  },
  
   start: { type: Date, required: true },
   end: { type: Date, required: true },

      reservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReservationC'
      }

});

CoachingSchema.pre('save', function(next) {
  if (!this.isModified('user')) {
    return next();
  }
  if (!this.user) {
    this.user = this._id;
  }
  next();
});

// CoachingSchema.pre('validate', function(next) {
//   if (this.availability && this.availability.start && this.availability.end) {
//     if (this.availability.start >= this.availability.end) {
//       return next(new Error('End date must be after start date'));
//     }
//   }
//   next();
// });

module.exports = mongoose.model('Coaching', CoachingSchema);
