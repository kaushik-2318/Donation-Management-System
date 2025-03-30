const mongoose = require("mongoose");

const individualDonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },

    receiver:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "IndividualReceiver",
      required: true
    },

    request:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "IndividualRequest",
      required: true
    },

    amount: { type: Number, required: true },
    
    paymentId: { type: String, required: true }, 
    
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IndividualDonation", individualDonationSchema);
