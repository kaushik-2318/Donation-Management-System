const express = require("express");

const { getUserProfile, updateUserProfile, deleteUserAccount } = require("../controllers/userController");

const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:id", authMiddleware, getUserProfile);
router.put("/:id", authMiddleware, updateUserProfile);
router.delete("/:id", authMiddleware, deleteUserAccount);

module.exports = router;
