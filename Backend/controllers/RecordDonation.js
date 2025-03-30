const recordDonation = async (req, res, next) => {
    try {
        const { ngoId, campaignId, amount, donorId } = req.body;

        if (!ngoId || !campaignId || !amount) {
            res.status(400);
            return next(new Error("NGO ID, campaign ID and amount are required"));
        }

        // Record the donation
        const newDonation = await Donation.create({
            ngo: ngoId,
            campaign: campaignId,
            donor: donorId || null, // Allow anonymous donations
            amount: Number(amount),
            status: "completed"
        });

        // Update campaign raised amount
        await Campaign.findByIdAndUpdate(
            campaignId,
            { $inc: { raisedAmount: amount } }
        );

        // Update monthly donation record
        const date = new Date();
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()];
        const year = date.getFullYear();

        // Check if entry exists for this month/year
        const result = await NGO.updateOne(
            {
                _id: ngoId,
                "monthlyDonations.month": month,
                "monthlyDonations.year": year
            },
            { $inc: { "monthlyDonations.$.amount": amount } }
        );

        // If no document was updated, create a new monthly record
        if (result.matchedCount === 0) {
            await NGO.updateOne(
                { _id: ngoId },
                {
                    $push: {
                        monthlyDonations: {
                            month,
                            year,
                            amount
                        }
                    }
                }
            );
        }

        // Update NGO stats
        await updateNGOStats(ngoId);

        res.status(201).json({
            success: true,
            message: "Donation recorded successfully",
            donationId: newDonation._id
        });
    } catch (error) {
        next(error);
    }
};

const updateNGOStats = async (ngoId) => {
    try {
        // Get all campaigns for this NGO
        const campaignStats = await Campaign.aggregate([
            { $match: { ngo: mongoose.Types.ObjectId(ngoId) } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalRaised: { $sum: "$raisedAmount" }
                }
            }
        ]);

        // Get unique donor count
        const donorCount = await Donation.aggregate([
            { $match: { ngo: mongoose.Types.ObjectId(ngoId) } },
            { $group: { _id: "$donor" } },
            { $count: "uniqueDonors" }
        ]);

        // Calculate stats
        const totalCampaigns = campaignStats.reduce((sum, stat) => sum + stat.count, 0);
        const activeCampaigns = campaignStats.find(stat => stat._id === "active")?.count || 0;
        const totalDonations = campaignStats.reduce((sum, stat) => sum + stat.totalRaised, 0);
        const donorsCount = donorCount[0]?.uniqueDonors || 0;

        // Update NGO stats
        await NGO.findByIdAndUpdate(ngoId, {
            $set: {
                "stats.totalDonations": totalDonations,
                "stats.totalCampaigns": totalCampaigns,
                "stats.activeCampaigns": activeCampaigns,
                "stats.donorsCount": donorsCount
            }
        });

        return true;
    } catch (error) {
        console.error("Error updating NGO stats:", error);
        return false;
    }
};

module.exports = { recordDonation }