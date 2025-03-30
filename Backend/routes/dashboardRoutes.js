const express = require("express");
const { getDataReceiver, getDataDonor, getDataNgo } = require('../controllers/dashboardController')
const { authMiddleware } = require('../middlewares/authMiddleware')
const router = express.Router();

router.get("/receiver", authMiddleware, getDataReceiver);
router.get("/ngo", authMiddleware, getDataNgo);
router.get("/donor", authMiddleware, getDataDonor);

module.exports = router;
