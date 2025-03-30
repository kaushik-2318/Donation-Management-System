const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    title: {
        type: String, required: true
    },
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ngo",
        required: true
    },
    description: {
        type: String, required: true
    },
    longDescription: {
        type: String, required: true
    },
    image: {
        type: String
    },
    raised: {
        type: Number, default: 0
    },
    goal: {
        type: Number, required: true
    },
    duration: {
        type: Number, required: true
    },
    donorsCount: {
        type: Number, default: 0
    },
    category: {
        type: String, required: true
    },
    location: {
        type: String, required: true
    },
    proofDocuments: [{
        title: { type: String, required: true },
        link: { type: String, required: true }
    }],
    donors: [{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Donor",
        type: String,
    }],
    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active"
    }
}, { timestamps: true });

const Campaign = mongoose.model('Campaign', CampaignSchema);

module.exports = Campaign;
