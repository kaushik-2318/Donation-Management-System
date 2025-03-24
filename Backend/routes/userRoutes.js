const express = require("express");

const { getUserProfile, updateUserProfile, deleteUserAccount } = require("../controllers/userController");

const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Fetch user profile (User can only view their own profile)
router.get("/:id", authMiddleware, getUserProfile);

// 📌 Update user profile (User can update their own profile, Admins can update any profile)
router.put("/:id", authMiddleware, updateUserProfile);

//TODO: Delete Account
// 📌 Delete user account (User can delete their own account, Admins can delete any account)
// router.delete("/:id", authMiddleware, deleteUserAccount);

module.exports = router;
