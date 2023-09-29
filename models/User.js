const mongoose = require("mongoose");
const { isEmail } = require('validator'); 

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmail,
      message: "Invalid email address",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: String,
  role: {
    type: String,
    enum: ["student", "dean"],
    required: true,
  },
  studentSessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
  ],
  bookedSessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
  ],
  deanSessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
  ],
},{timestamps:true});

const User = mongoose.model("User", userSchema);

module.exports = User;
