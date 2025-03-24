const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema(
    {
        full_name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: { type: String, required: true },
        role: { type: String, enum: ["ngo"], default: "ngo" },
        phone_number: {
            type: String,
            trim: true,
            unique: true,
            match: /^\d{10}$/,
        },
        address: { type: String, required: true, trim: true },
        organization_name: { type: String, required: true, trim: true },
        registration_number: { type: String, required: true, unique: true, trim: true },
        founded_year: {
            type: Number,
            required: true,
            min: 1800,
            max: new Date().getFullYear(),
        },
        website: { type: String, trim: true, default: "" },
        organization_description: { type: String, required: true, trim: true },
        social_media_links: { type: [String], default: [] },
        isVerified: { type: Boolean, default: false }, 
        otp: { type: String },
        otpExpires: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model("NGO", ngoSchema);
