const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { getNotifications, updateNotification, deleteNotification } = require("../controllers/notificationController");

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.put("/:id", authMiddleware, updateNotification);
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;