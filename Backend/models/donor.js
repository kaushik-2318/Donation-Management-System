const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, // Ensures no duplicate emails
    lowercase: true, // Converts email to lowercase
    trim: true, // Removes extra spaces
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Regex for email validation
  },
  password: { type: String, required: true },
});

const Donor = mongoose.model('Donor', DonorSchema);

module.exports = Donor;
