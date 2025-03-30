const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true },
    phone_number: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      match: /^\d{10}$/,
    },
    address: { type: String, required: true },
    role: { type: String, default: "donor", enum: ["donor"] },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },

   
    compaignDonations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    }],

    individualDonations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "IndividualDonation",
    }],

    totalDonations: { type: Number, default: 0 },
    totalDonationsAmount: { type: Number, default: 0 },

    totalCampaignDonations: { type: Number, default: 0 },
    totalCampaignDonationsAmount: { type: Number, default: 0 },
    
    totalIndividualDonations: { type: Number, default: 0 },
    totalIndividualDonationsAmount: { type: Number, default: 0 },

  },
  { timestamps: true }
);

module.exports = mongoose.model("donor", donorSchema);
