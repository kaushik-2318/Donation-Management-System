const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const transporter = require("../config/nodemailer");
const { Verification_Email_Template } = require("../utils/emailTemplates");
const { Welcome_Email_Template } = require("../utils/emailTemplates");

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone_number } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !password || !role) {
      res.status(400);
      return next(new Error("All fields are required."));
    }

    // ✅ Validate role
    const validRoles = ["admin", "ngo", "donor", "receiver"];
    if (!validRoles.includes(role)) {
      res.status(400);
      return next(new Error("Invalid role provided."));
    }

    normalizedEmail = email.trim().toLowerCase();

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ normalizedEmail });
    if (existingUser) {
      res.status(400);
      return next(new Error("Email already in use."));
    }

    // ✅ Validate phone number if role is "receiver"
    if (role === "receiver" && !phone_number) {
      res.status(400);
      return next(new Error("Phone number is required for receivers."));
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Generate & Hash OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // ✅ Create new user (not verified yet)
    await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      phone_number,
      otp: hashedOtp,
      otpExpires,
      isVerified: false, // Default verification status
    });

    // ✅ Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "Verify Your Email",
      html: Verification_Email_Template.replace("{verificationCode}", otp),
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "OTP sent! Please verify your email." });
  } catch (error) {
    next(error); // ✅ Pass unexpected errors to global error handler
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new Error("Email and password are required."));
    }

    // ✅ Normalize email before querying
    const normalizedEmail = email.trim().toLowerCase();

    // ✅ Find user in the database
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return next(new Error("Invalid credentials."));
    }

    // ✅ Check if the user is verified
    if (!user.isVerified) {
      return next(new Error("Please verify your email before logging in."));
    }

    // ✅ Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new Error("Invalid credentials."));
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRETKEY,
      { expiresIn: "7d" }
    );

    // ✅ Set token in a secure HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful!",
      token, // ✅ Return token if needed for frontend usage
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      expires: new Date(0), // Expire the cookie immediately
    });

    res.json({ message: "Logout successful!" });
  } catch (error) {
    next(error);
  }
};



const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new Error("Email and OTP are required."));
    }

    // Trim and normalize email before querying
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

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

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRETKEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ Use Secure=true in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // ✅ Use None only in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Send Welcome Email
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

const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new Error("Email is required."));
    }

    // ✅ Normalize email before querying
    const normalizedEmail = email.trim().toLowerCase();

    // ✅ Find user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return next(new Error("User not found."));
    }

    if (user.isVerified) {
      return next(new Error("User is already verified."));
    }

    // ✅ Generate & Hash New OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(newOtp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10-minute expiry

    // ✅ Update OTP & Expiry Time in Database
    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    // ✅ Send New OTP via Email
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


module.exports = { register, login, logout, verifyOtp, resendOtp };
