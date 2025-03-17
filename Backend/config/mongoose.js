const mongoose = require('mongoose');

const mongoUrl = `${process.env.MONGO_ATLAS_URL}/donation_management`;

const options = {
  tls: true, // Enable TLS for both environments
  tlsAllowInvalidCertificates: process.env.NODE_ENV !== 'production', // Allow invalid certificates in development for testing (e.g., self-signed certs)
};

mongoose.connect(mongoUrl, options)
  .then(() => console.log("✅ Database connected successfully!"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const db = mongoose.connection;
module.exports = db;
