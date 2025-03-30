const express = require("express");
const { createIndividualDonation, createNGODonation } = require('../controllers/donationController')
const { authMiddleware } = require('../middlewares/authMiddleware')
const router = express.Router();

router.post("/individual", authMiddleware, createIndividualDonation);
router.post("/ngo", authMiddleware, createNGODonation);

module.exports = router;
