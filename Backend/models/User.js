const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Converts email to lowercase
      trim: true, // Removes extra spaces
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "ngo", "donor", "receiver"],
      required: true,
    },
    phone_number: {
      type: String,
      trim: true,
      unique: function () {
        return this.role === "receiver";
      }, // Only required for receivers
      match: /^\+?[1-9]\d{1,3}\d{10}$/, // Ensures valid phone number format
    },
    isVerified: { type: Boolean, default: false }, // For NGO verification / receiver verification
    totalDonations: { type: Number, default: 0 }, // Only for donors
    totalReceived: { type: Number, default: 0 }, // Only for receivers
    otp: { type: String }, // Store OTP
    otpExpires: { type: Date }, // OTP expiration time
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
