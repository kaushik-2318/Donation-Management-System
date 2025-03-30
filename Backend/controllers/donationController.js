const individualReceiver = require("../models/IndividualReceiver");
const individualDonation = require("../models/IndividualDonation");
const Campaign = require("../models/Campaign");
const Donor = require("../models/Donor");
const Ngo = require("../models/Ngo");

const createIndividualDonation = async (req, res) => {
    try {
        const { receiverId, requestId, amount } = req.body;

        const userId = req.user.id;

        const receiverExists = await individualReceiver.findById(receiverId);

        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        const donation = await individualDonation.create({
            donor: userId,
            receiver: receiverId,
            request: requestId,
            amount: amount
        });

        const donor = await Donor.findById(userId);
        if(!donor) {
            return res.status(404).json({ message: "Donor not found" });
        }

        donor.totalIndividualDonations++;
        donor.totalIndividualDonationsAmount += amount;
        donor.totalDonations++;
        donor.totalDonationsAmount += amount;

        donor.individualDonations.push();


        await donor.save();
        res.status(201).json({ message: "Donation created successfully", donation });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating donation", error: error.message });
    }
};

const createNGODonation = async (req, res) => {
    try {
        const { campaignId, amount } = req.body;

        if (!campaignId || !amount) {
            return res.status(400).json({ message: "Campaign ID and amount are required" });
        }

        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }

        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const donor = await Donor.findById(userId);
        if (!donor) {
            return res.status(404).json({ message: "Donor not found" });
        }

        const ngo = await Ngo.findById(campaign.ngo);
        if (!ngo) {
            return res.status(404).json({ message: "NGO not found" });
        }

        const donation = await CampaignDonation.create({
            donor: userId,
            campaign: campaignId,
            amount: amount,
        });

        campaign.donors.push(userId);
        campaign.donorsCount++;
        await campaign.save();
      
        ngo.stats.totalDonations += amount;
        ngo.stats.totalCampaigns += amount;
        ngo.stats.donorsCount++;
        ngo.campaigns.push(campaignId);
        await ngo.save();

        donor.compaignDonations.push(campaignId);
        donor.totalDonations++;
        donor.totalDonationsAmount += amount;
        donor.totalCampaignDonations++;
        donor.totalCampaignDonationsAmount += amount;

        await donor.save();

        res.status(201).json({ message: "Donation created successfully", donation });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating donation", error: error.message });
    }
}

module.exports = { createIndividualDonation, createNGODonation };
