const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  date: String,
  time: String,
  dean: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  students: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['Booked', 'Finished','Canceled',"Pending"],
    default: 'Pending',
  },
},{timestamps:true});

module.exports = mongoose.model('Session', sessionSchema);
