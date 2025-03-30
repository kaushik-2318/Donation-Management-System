const mongoose = require("mongoose");

const IndividualRequestSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "individualReceiver",
            required: true
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters long"],
            maxlength: [100, "Title cannot exceed 100 characters"]
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            minlength: [10, "Description must be at least 10 characters long"],
            maxlength: [1000, "Description cannot exceed 1000 characters"]
        },
        amountNeeded: {
            type: Number,
            required: [true, "Amount is required"],
            min: [1, "Amount must be greater than 0"],
            validate: {
                validator: Number.isFinite,
                message: "Amount must be a valid number"
            }
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"],
            validate: {
                validator: function (value) {
                    return value > new Date();
                },
                message: "End date must be in the future"
            }
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true
        },
        image: {
            type: String,

        },
        proofDocuments: [{
            type: String,
            validate: {
                validator: function (value) {
                    const urlPattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
                    return urlPattern.test(value);
                },
                message: "Please provide valid document URLs"
            },
            required: true
        }],
        currentAmount: {
            type: Number,
            default: 0,
            min: [0, "Current amount cannot be negative"]
        },
        isActive: {
            type: Boolean,
            default: true
        },
        status: {
            type: String,
            default: "active"
        },
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Donor",
            required: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("IndividualRequest", IndividualRequestSchema);