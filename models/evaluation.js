const mongoose = require('mongoose');


const EvaluationSchema = new mongoose.Schema({
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
    //   ratings: [{
    //     type: Number,
    //     min: 0,
    //     max: 5
    //   }],
      ratedBy:
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
      
  
});
const Evaluation = mongoose.model("Evaluation", EvaluationSchema);


module.exports = {Evaluation};
