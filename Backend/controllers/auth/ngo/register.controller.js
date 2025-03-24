const bcrypt = require("bcrypt");
const NGO = require("../../../models/Ngo"); // Import NGO model
const transporter = require("../../../config/nodemailer"); // Import email service
const { Verification_Email_Template } = require("../../../utils/emailTemplates");

const ngoRegister = async (req, res, next) => {
  try {
    const { name, email, confirmPassword, phone, address, ngoDetails } = req.body;

    if (!name || !email || !confirmPassword || !phone || !address || !ngoDetails.organizationName || !ngoDetails.registrationNumber || !ngoDetails.foundedYear || !ngoDetails.description) {
      res.status(400);
      return next(new Error("All required fields must be filled."));
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingNGO = await NGO.findOne({ email: normalizedEmail });

    if (existingNGO) {
      res.status(400);
      return next(new Error("Email already in use."));
    }

    const existingRegistration = await NGO.findOne({ "ngoDetails.registrationNumber": ngoDetails.registrationNumber });
    if (existingRegistration) {
      res.status(400);
      return next(new Error("Registration number already in use."));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(confirmPassword, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await NGO.create({
      full_name: name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "ngo",
      phone_number: phone,
      address,
      organization_name: ngoDetails.organizationName,
      registration_number: ngoDetails.registrationNumber,
      founded_year: ngoDetails.foundedYear,
      organization_description: ngoDetails.description,
      website: ngoDetails.website,
      social_media_links: ngoDetails.socialMedia,
      otp: hashedOtp,
      otpExpires,
      isVerified: false,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "Verify Your NGO Registration",
      html: Verification_Email_Template.replace("{verificationCode}", otp),
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "OTP sent! Please verify your email." });
  } catch (error) {
    next(error);
  }
};

module.exports = { ngoRegister };
