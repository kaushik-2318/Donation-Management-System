const express = require("express");

const { getSettings, changeEmail, changePassword, requestEmailChange, updateSettings } = require("../controllers/settingsController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getSettings);
router.put("/password", authMiddleware, changePassword);
router.put("/email", authMiddleware, changeEmail);
router.put("/request-email-change", authMiddleware, requestEmailChange);
router.put("/", authMiddleware, updateSettings);



module.exports = router;
