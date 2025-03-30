const Campaign = require("../models/Campaign");
const Ngo = require("../models/Ngo");
const mongoose = require("mongoose");

const createCampaign = async (req, res, next) => {
    try {
        const { title, description, longDescription, goal, duration, category, location, proofDocuments } = req.body;

        if (!title || !description || !longDescription || !goal || !duration || !category || !location || !proofDocuments) {
            return next(new Error("All fields are required."));
        }

        const ngoId = req.user._id;

        const ngo = await Ngo.findById(ngoId);
        if (!ngo) {
            return next(new Error("NGO not found."));
        }

        if (ngo.role !== "ngo") {
            return next(new Error("Only NGOs can create campaigns."));
        }
        const campaign = new Campaign({
            title,
            description,
            longDescription,
            goal,
            duration,
            category,
            location,
            proofDocuments,
            raised: 0,
            donorsCount: 0,
            ngo: ngoId,
        });

        await campaign.save();
        
        ngo.campaigns.push(campaign._id);
        ngo.stats.totalCampaigns++;
        ngo.stats.activeCampaigns++;
        await ngo.save();


        res.status(201).json({ message: "Campaign created successfully!", campaign });
    } catch (error) {
        next(error);
    }
};

const getAllCampaigns = async (req, res, next) => {
    try {
        const campaigns = await Campaign.find();
        res.json({ campaigns });
    } catch (error) {
        next(error);
    }
};

const getCampaignById = async (req, res, next) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return next(new Error("Campaign not found."));
        }

        res.json({ campaign });
    } catch (error) {
        next(error);
    }
};

const updateCampaign = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return next(new Error("Invalid campaign ID."));
        }

        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return next(new Error("Campaign not found."));
        }

        // ✅ Only author (NGO) or admin can update
        if (req.user.role !== "admin" && req.user.id !== campaign.author.toString()) {
            return next(new Error("Access denied. You can only edit your own campaign."));
        }

        // ✅ Validate request body (Partial update allowed)
        const { error } = campaignSchema.validate(req.body, { allowUnknown: true, stripUnknown: true });
        if (error) {
            return next(new Error(error.details.map((err) => err.message).join(", ")));
        }

        Object.assign(campaign, req.body);

        await campaign.save();

        res.json({ message: "Campaign updated successfully!", campaign });
    } catch (error) {
        next(error);
    }
};


const deleteCampaign = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return next(new Error("Invalid campaign ID."));
        }

        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return next(new Error("Campaign not found."));
        }

        // ✅ Only author (NGO) or admin can delete
        if (req.user.role !== "admin" && req.user.id !== campaign.author.toString()) {
            return next(new Error("Access denied. You can only delete your own campaign."));
        }

        await campaign.deleteOne();

        res.json({ message: "Campaign deleted successfully!" });
    } catch (error) {
        next(error);
    }
};

const manageCampaigns = async (req, res, next) => {
    try {
        const ngoId = req.user.id;

        const ngo = await Ngo.findById(ngoId)


        if (!ngo) {
            res.status(404);
            return next(new Error("NGO not found"));
        }
        const campaigns = await Campaign.find({ ngo: ngoId })
        
       
        res.status(200).json(campaigns);
    } catch (error) {
        console.error("Dashboard error:", error);
        next(error);
    }
};


module.exports = {
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    manageCampaigns,
};
