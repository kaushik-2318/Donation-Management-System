const mongoose = require("mongoose");

const IndividualReceiverSchema = new mongoose.Schema(
    {
        full_name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
        password: { type: String, required: true },
        phone_number: {
            type: String,
            trim: true,
            required: function () {
                return this.role === "receiver";
            },
            match: /^\+?[0-9]{10,15}$/,
        },
        address: { type: String, required: true },
        id_proof: { type: String, required: true },
        bank_details: { type: String, required: true },
        reason_for_registration: { type: String, required: true },
        role: { type: String, default: "receiver", enum: ["receiver"] },
        isVerified: { type: Boolean, default: false },
        otp: { type: String },
        otpExpires: { type: Date },
        totalReceived: { type: Number, default: 0 },
        
        requests: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "IndividualRequest"
        }],
        donations: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Donation",
        }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("individualReceiver", IndividualReceiverSchema);
