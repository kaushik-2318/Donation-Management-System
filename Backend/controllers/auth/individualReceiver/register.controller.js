const bcrypt = require("bcrypt");
const User = require("../../../models/IndividualReceiver");
const transporter = require("../../../config/nodemailer");
const { Verification_Email_Template } = require("../../../utils/emailTemplates");

const individualRegister = async (req, res, next) => {
  const { name, email, confirmPassword, phone, receiverDetails, address } = req.body;

  try {
    if (!name || !email || !confirmPassword || !phone || !address || !receiverDetails.idProof || !receiverDetails.bankDetails || !receiverDetails.reason) {
      res.status(400);
      return next(new Error("All fields are required."));
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(400);
      return next(new Error("Email already in use."));
    }

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(confirmPassword, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await User.create({
      full_name: name,
      email: normalizedEmail,
      password: confirmPassword,
      phone_number: phone,
      address,
      id_proof: receiverDetails.idProof,
      bank_details: receiverDetails.bankDetails,
      reason_for_registration: receiverDetails.reason,
      role: "receiver",
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

module.exports = { individualRegister };
