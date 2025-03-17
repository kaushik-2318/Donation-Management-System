const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // NGO or Receiver
    title: { type: String, required: true },
    description: { type: String, required: true },
    proofLink: { 
      type: String, 
      trim: true, 
      match: /^(https?:\/\/)?(www\.)?[\w\-]+(\.[a-z]{2,})(\/[\w\-]*)*$/i, // Regex for valid URLs
    },
    targetAmount: { type: Number, default: 0 }, // Fundraising goal (For NGOs)
    collectedAmount: { type: Number, default: 0 }, // Tracks donations received
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    isActive: { type: Boolean, default: true }, // Campaign/post is active or closed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
