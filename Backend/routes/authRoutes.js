const express = require("express");
const { register,login, verifyOtp } = require("../controllers/authController");

const router = express.Router();

// 📌 REGISTER USER - POST /api/auth/register
router.post("/register", register);
router.post("/login",login)
router.post("/verify-otp", verifyOtp);

module.exports = router;
