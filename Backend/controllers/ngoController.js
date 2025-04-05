const Ngo = require("../models/Ngo");

const getNGOs = async (req, res) => {
    try {
        const ngos = await Ngo.find();
        res.status(200).json(ngos);
    } catch (error) {
        res.status(500).json({ message: "Error fetching NGOs", error: error.message });
    }
};

const getTrengingNGOs = async (req, res) => {
    try {
        const ngos = await Ngo.find().sort({ "stats.totalDonations": -1 }).limit(3);
        res.status(200).json(ngos);
    } catch (error) {
        res.status(500).json({ message: "Error fetching trending NGOs", error: error.message });
    }
};

const getNGOById = async (req, res) => {
    try {
        const ngo = await Ngo.findById(req.params.id);
        if (!ngo) {
            return res.status(404).json({ message: "NGO not found" });
        }
        res.status(200).json(ngo);
    } catch (error) {
        res.status(500).json({ message: "Error fetching NGO", error: error.message });
    }
};

module.exports = { getNGOs, getTrengingNGOs, getNGOById };
