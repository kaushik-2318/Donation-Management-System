const bcrypt = require("bcrypt");
const Donor = require("../../../models/Donor");
const transporter = require("../../../config/nodemailer"); // Import email service
const { Verification_Email_Template } = require("../../../utils/emailTemplates");

const donorRegister = async (req, res, next) => {
  try {
    const { name, email, confirmPassword, phone, address } = req.body;
    
    if (!name || !email || !confirmPassword || !phone || !address) {
      res.status(400);
      return next(new Error("All fields are required."));
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await Donor.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(400);
      return next(new Error("Email already in use."));
    }

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(confirmPassword, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await Donor.create({
      full_name:name,
      email: normalizedEmail,
      password: confirmPassword,
      phone_number:phone,
      address,
      otp: hashedOtp,
      otpExpires,
      isVerified: false,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "Verify Your Email",
      html: Verification_Email_Template.replace("{verificationCode}", otp),
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "OTP sent! Please verify your email." });
  } catch (error) {
    next(error);
  }
};

module.exports = { donorRegister };
