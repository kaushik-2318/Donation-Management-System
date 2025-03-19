const express = require("express");
const { register,login,logout, verifyOtp,resendOtp } = require("../controllers/authController");

const router = express.Router();

// 📌 REGISTER USER - POST /api/auth/register
router.post("/register", register);
router.post("/login", login)
router.post("/logout", logout);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

module.exports = router;
