const mongoose = require("mongoose");

const ReceiverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  },
  password: { type: String, required: true },
  phone_number: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    match: /^\+?[1-9]\d{1,3}\d{10}$/ // Ensures 10 digits after country code
  },
  verified: { type: Boolean, default: false }
});

const Receiver = mongoose.model("Receiver", ReceiverSchema);

module.exports = Receiver;
