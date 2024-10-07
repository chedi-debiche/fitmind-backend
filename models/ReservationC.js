const mongoose = require('mongoose');

const ReservationcSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
   emailuser: { type: String, required: true },
   phoneuser : {type : String , required : true},
   coachingName : {type : String , required : true},
   coachName : {type : String , required : false},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coaching: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coaching',
    required: true
  },
  reservationdate: { type: Date, required: true },
});

ReservationcSchema.pre('save', function(next) {
  if (!this.isModified('user')) {
    return next();
  }
  if (!this.user) {
    this.user = this._id;
  }
  next();
});

module.exports = mongoose.model('Reservationc', ReservationcSchema);
