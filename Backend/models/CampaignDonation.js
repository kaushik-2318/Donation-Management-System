const mongoose = require("mongoose");

const campaignDonationSchema = new mongoose.Schema(
    {
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Donor",
            required: true,
        },

        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: true
        },

        amount: { type: Number, required: true },
        paymentId: { type: String },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CampaignDonation", campaignDonationSchema);
