const individualReceiver = require("../models/IndividualReceiver");
const individualDonation = require("../models/IndividualDonation");
const IndividualDonation = require("../models/IndividualDonation");
const IndividualRequest = require("../models/IndividualRequest");
const Donor = require("../models/Donor");
const mongoose = require("mongoose");
const Ngo = require("../models/Ngo");
const Campaign = require("../models/Campaign");

const getDataReceiver = async (req, res) => {
    try {
        const [totalReceivedResult, activeRequests, completedRequests, donorsCount] = await Promise.all([
            IndividualDonation.aggregate([
                { $match: { status: "completed" } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            IndividualRequest.countDocuments({ status: "active" }),
            IndividualRequest.countDocuments({ status: "completed" }),
            Donor.countDocuments()
        ]);

        const currentYear = new Date().getFullYear();
        const fundsDataAggregate = await IndividualDonation.aggregate([
            {
                $match: {
                    status: "completed",
                    createdAt: {
                        $gte: new Date(currentYear, 0, 1),
                        $lt: new Date(currentYear + 1, 0, 1)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const fundsData = months.map((month, index) => {
            const monthData = fundsDataAggregate.find(item => item._id === index + 1);
            return { month, amount: monthData ? monthData.total : 0 };
        });

        const requestsData = await IndividualRequest.find({
            status: { $in: ["active", "completed"] }
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const formattedRequests = requestsData.map(request => {
            const endDate = new Date(request.endDate);
            const today = new Date();
            const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

            return {
                id: request._id,
                title: request.title,
                description: request.description,
                raised: request.currentAmount,
                goal: request.amountNeeded,
                status: request.status,
                daysLeft: daysLeft > 0 ? daysLeft : 0
            };
        });

        const dashboardData = {
            stats: {
                totalReceived: totalReceivedResult[0]?.total || 0,
                activeRequests,
                completedRequests,
                donorsCount,
            },
            fundsData,
            requests: formattedRequests,
        };

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
};

const getDataNgo = async (req, res) => {
    try {
        const ngoId = req.user.id;

        const ngo = await Ngo.findById(ngoId)

        if (!ngo) {
            res.status(404);
            return next(new Error("NGO not found"));
        }

        const campaigns = await Campaign.find({ ngo: ngoId })
            .select("title goal raised status")
            .sort({ createdAt: -1 })
            .lean();


        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();

        let donationsData = monthNames.map(month => ({ month, amount: 0 }));

        if (ngo.monthlyDonations && ngo.monthlyDonations.length > 0) {
            const thisYearDonations = ngo.monthlyDonations.filter(item => item.year === currentYear);

            thisYearDonations.forEach(item => {
                const monthIndex = monthNames.indexOf(item.month);
                if (monthIndex >= 0) {
                    donationsData[monthIndex].amount = item.amount;
                }
            });
        }

        const processedCampaigns = campaigns.map((campaign, index) => {
            const today = new Date();
            const endDate = new Date(campaign.endDate);
            const daysLeft = campaign.status === "active"
                ? Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)))
                : 0;

            return {
                id: campaign._id,
                title: campaign.title,
                raised: campaign.raised,
                goal: campaign.goal,
                status: campaign.status,
                daysLeft
            };
        });

        const dashboardData = {
            stats: {
                totalDonations: ngo.stats.totalDonations,
                totalCampaigns: ngo.stats.totalCampaigns,
                activeCampaigns: ngo.stats.activeCampaigns,
                donorsCount: ngo.stats.donorsCount
            },
            donationsData,
            campaigns: processedCampaigns
        };
        res.status(200).json(dashboardData);
    } catch (error) {
        console.error("Dashboard error:", error);
        next(error);
    }
};

const getDataDonor = async (req, res, next) => {
    try {
        const donorId = req.user.id;

        const donor = await Donor.findById(donorId)
            .populate("compaignDonations")
            .populate("individualDonations")
            .lean();

        if (!donor) {
            res.status(404);
            return next(new Error("Donor not found"));
        }

        // Fetch campaigns created by the donor (if applicable)
        const campaigns = await Campaign.find({ donor: donorId })
            .select("title goal raised status endDate")
            .sort({ createdAt: -1 })
            .lean();

        const processedCampaigns = campaigns.map((campaign) => {
            const today = new Date();
            const endDate = new Date(campaign.endDate);
            const daysLeft =
                campaign.status === "active"
                    ? Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)))
                    : 0;

            return {
                id: campaign._id,
                title: campaign.title,
                raised: campaign.raised,
                goal: campaign.goal,
                status: campaign.status,
                daysLeft,
            };
        });

        // Build donations data by month (dummy data since schema doesn't store monthly data)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const donationsData = monthNames.map((month) => ({
            month,
            amount: 0,
        }));

        const dashboardData = {
            stats: {
                totalDonations: donor.totalDonations,
                totalDonationsAmount: donor.totalDonationsAmount,
                totalCampaignDonations: donor.totalCampaignDonations,
                totalCampaignDonationsAmount: donor.totalCampaignDonationsAmount,
                totalIndividualDonations: donor.totalIndividualDonations,
                totalIndividualDonationsAmount: donor.totalIndividualDonationsAmount,
            },
            donationsData,
            campaigns: processedCampaigns,
        };

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error("Dashboard error:", error);
        next(error);
    }
};

module.exports = { getDataReceiver, getDataDonor, getDataNgo }