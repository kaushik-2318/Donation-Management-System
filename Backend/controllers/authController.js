const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Donor = require("../models/Donor");
const IndividualReceiver = require("../models/IndividualReceiver");
const NGO = require("../models/Ngo");

const transporter = require("../config/nodemailer");
const { Verification_Email_Template } = require("../utils/emailTemplates");
const { Welcome_Email_Template } = require("../utils/emailTemplates");

//Register Controller
const { donorRegister } = require("./auth/donor/register.controller");
const { ngoRegister } = require("./auth/ngo/register.controller");
const { individualRegister } = require("./auth/individualReceiver/register.controller");

const register = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) {
      return next(new Error("Role is required."));
    }
    if (role === "donor") {
      return donorRegister(req, res, next);
    }
    else if (role === "ngo") {
      return ngoRegister(req, res, next);
    }
    else if (role === "receiver") {
      return individualRegister(req, res, next);
    }
  } catch (error) {
    next(error);
  }
}

//Login Controller
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return next(new Error("All Field Required."));
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedRole = role.toLowerCase();

    let user;

    if (normalizedRole === "donor") {
      user = await Donor.findOne({ email: normalizedEmail });
    }
    else if (normalizedRole === "ngo") {
      user = await NGO.findOne({ email: normalizedEmail });
    }
    else if (normalizedRole === "receiver") {
      user = await IndividualReceiver.findOne({ email: normalizedEmail });
    }

    if (!user) {
      return next(new Error("Invalid credentials."));
    }

    if (!user.isVerified) {
      return next(new Error("Please verify your email before logging in."));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new Error("Invalid credentials."));
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRETKEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: normalizedRole,
      },
    });
  } catch (error) {
    next(error);
  }
}

//Verify OTP Controller
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, role } = req.body;

    if (!email || !otp || !role) {
      return next(new Error("All fields are required."));
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user;

    if (role === "donor") {
      user = await Donor.findOne({ email: normalizedEmail });
    }
    else if (role === "ngo") {
      user = await NGO.findOne({ email: normalizedEmail });
    }
    else if (role === "receiver") {
      user = await IndividualReceiver.findOne({ email: normalizedEmail });
    }

    if (!user) return next(new Error("User not found."));

    if (!user.otp || user.otpExpires < Date.now()) {
      return next(new Error("OTP expired or invalid."));
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) return next(new Error("Invalid OTP."));

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRETKEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "Welcome to Our Community!",
      html: Welcome_Email_Template.replace("{name}", user.name),
    });

    res.json({ message: "Email verified successfully!", token });
  } catch (error) {
    next(error);
  }
};

//Resend OTP Controller
const resendOtp = async (req, res, next) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return next(new Error("Email is required."));
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user;
    if (role === "donor") {
      user = await Donor.findOne({ email: normalizedEmail });
    }
    else if (role === "ngo") {
      user = await NGO.findOne({ email: normalizedEmail });
    }
    else if (role === "receiver") {
      user = await IndividualReceiver.findOne({ email: normalizedEmail });
    }

    if (!user) {
      return next(new Error("User not found."));
    }

    if (user.isVerified) {
      return next(new Error("User is already verified."));
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(newOtp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "Resend OTP - Verify Your Email",
      html: Verification_Email_Template.replace("{verificationCode}", newOtp),
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "New OTP sent! Please check your email." });
  } catch (error) {
    next(error);
  }
};

//Logout Controller
const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      expires: new Date(0),
    });

    res.json({ message: "Logout successful!" });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, verifyOtp, resendOtp };
