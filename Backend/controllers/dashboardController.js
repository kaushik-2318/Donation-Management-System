// const individualRequest = require("../models/IndividualRequest");
const individualReceiver = require("../models/IndividualReceiver");
const individualDonation = require("../models/IndividualDonation");
const IndividualDonation = require("../models/IndividualDonation");
const IndividualRequest = require("../models/IndividualRequest");
const Donor = require("../models/Donor");
const mongoose = require("mongoose");
const Ngo = require("../models/Ngo");
const Campaign = require("../models/Campaign");

// const getDataReceiver = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const userType = req.user.role;

//         if (userType === "receiver") {
//             const user = await individualReceiver.findById(userId).populate("requests");

//             if (!user) {
//                 return res.status(404).json({ message: "Receiver not found" });
//             }

//             const totalReceived = user.totalReceived;
//             const activeRequests = user.requests.filter(req => req.isActive).length;
//             const completedRequests = user.requests.filter(req => req.status === "completed").length;


//             // const donorsCount = await individualReceiver.distinct("user", { _id: userId }).countDocuments();

//             const donorsCount = user.requests.map(req => req.donor).length;



//             const fundsData = await individualReceiver.aggregate([
//                 { $match: { user: userId } },
//                 {
//                     $group: {
//                         _id: { $month: "$createdAt" },
//                         amount: { $sum: "$currentAmount" },
//                     },
//                 },
//                 { $sort: { "_id": 1 } },
//             ]);

//             console.log(fundsData)

//             const formattedFundsData = fundsData.map(f => ({
//                 month: new Date(f._id, 0, 1).toLocaleString('en', { month: 'short' }),
//                 amount: f.amount
//             }));

//             // const formattedFundsData = Array.from({ length: 12 }, (_, i) => {
//             //     const monthData = fundsData.find(f => f._id === i + 1);
//             //     return { month: new Date(2022, i, 1).toLocaleString('en', { month: 'short' }), amount: monthData ? monthData.amount : 0 };
//             // });


//             // const formattedFundsData = fundsData.map(f => ({
//             //     month: new Date(f._id, 0, 1).toLocaleString('en', { month: 'short' }),
//             //     amount: f.amount
//             // }));

//             // console.log(formattedFundsData)

//             const requests = user.requests.map(req => ({
//                 id: req._id,
//                 title: req.title,
//                 description: req.description,
//                 raised: req.currentAmount,
//                 goal: req.amountNeeded,
//                 status: req.status,
//                 daysLeft: Math.max(0, Math.ceil((new Date(req.endDate) - new Date()) / (1000 * 60 * 60 * 24))),
//             }));

//             return res.json({
//                 stats: { totalReceived, activeRequests, completedRequests, donorsCount },
//                 fundsData: formattedFundsData,
//                 requests,
//             });
//         }

//         return res.status(400).json({ message: "Invalid user type" });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };



// const getDataReceiver = async (req, res) => {
//     try {
//         // Fetch total received donations
//         const totalReceivedResult = await IndividualDonation.aggregate([
//             { $match: { status: "completed" } },
//             { $group: { _id: null, totalReceived: { $sum: "$amount" } } }
//         ]);
//         const totalReceived = totalReceivedResult.length ? totalReceivedResult[0].totalReceived : 0;

//         // Fetch active and completed requests
//         const activeRequests = await IndividualRequest.countDocuments({ status: "active" });
//         const completedRequests = await IndividualRequest.countDocuments({ status: "completed" });

//         // Fetch total donors count
//         const donorsCount = await Donor.countDocuments();

//         // Fetch funds data by month
//         const monthlyFunds = await IndividualDonation.aggregate([
//             { $match: { status: "completed" } },
//             {
//                 $group: {
//                     _id: { $month: "$createdAt" },
//                     amount: { $sum: "$amount" }
//                 }
//             }
//         ]);

//         const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//         const fundsData = months.map((month, index) => {
//             const fund = monthlyFunds.find(f => f._id === index + 1);
//             return { month, amount: fund ? fund.amount : 0 };
//         });

//         // Fetch recent requests
//         const requests = await IndividualRequest.find()
//             .sort({ createdAt: -1 })
//             .limit(5)
//             .select("_id title description currentAmount amountNeeded status endDate")
//             .lean();

//         const formattedRequests = requests.map(req => ({
//             id: req._id,
//             title: req.title,
//             description: req.description,
//             raised: req.currentAmount,
//             goal: req.amountNeeded,
//             status: req.status,
//             daysLeft: Math.max(0, Math.ceil((new Date(req.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
//         }));

//         res.json({
//             stats: {
//                 totalReceived,
//                 activeRequests,
//                 completedRequests,
//                 donorsCount
//             },
//             fundsData,
//             requests: formattedRequests
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };
// const IndividualDonation = require("../models/IndividualDonation");
// const IndividualRequest = require("../models/IndividualRequest");
// const Donor = require("../models/donor");

const getDataReceiver = async (req, res) => {
    try {
        // Calculate statistics in parallel
        const [totalReceivedResult, activeRequests, completedRequests, donorsCount] = await Promise.all([
            IndividualDonation.aggregate([
                { $match: { status: "completed" } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            IndividualRequest.countDocuments({ status: "active" }),
            IndividualRequest.countDocuments({ status: "completed" }),
            Donor.countDocuments()
        ]);

        // Calculate funds data by month
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

        // Format funds data for all months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const fundsData = months.map((month, index) => {
            const monthData = fundsDataAggregate.find(item => item._id === index + 1);
            return { month, amount: monthData ? monthData.total : 0 };
        });

        // Get recent requests with days left calculation
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

        // Prepare final response
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
        console.log(dashboardData)
        res.status(200).json(dashboardData);
    } catch (error) {
        console.error("Dashboard error:", error);
        next(error);
    }
};

const getDataDonor = async (req, res) => { };

module.exports = { getDataReceiver, getDataDonor, getDataNgo }