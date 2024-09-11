const mongoose = require('mongoose');
const Joi = require("joi");
const { Schema } = mongoose;
const reviewSchema = new Schema({
  comment: {
    type: String,
    required: true, 
    minlength: 10,  
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  author:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});



module.exports = mongoose.model('review', reviewSchema);
