const bcrypt = require("bcrypt");
const NGO = require("../../../models/Ngo");
const transporter = require("../../../config/nodemailer");
const { Verification_Email_Template } = require("../../../utils/emailTemplates");

const ngoRegister = async (req, res, next) => {
  try {
    const { full_name, email, password, phone_number, address, organization_name, registration_number, founded_year, organization_description, website, social_media_links } = req.body;

    if (!full_name || !email || !password || !phone_number || !address || !organization_name || !registration_number || !founded_year || !organization_description) {
      res.status(400);
      return next(new Error("All required fields must be filled."));
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingNGO = await NGO.findOne({ email: normalizedEmail });

    if (existingNGO) {
      res.status(400);
      return next(new Error("Email already in use."));
    }
    
    const existingRegistration = await NGO.findOne({
      "registration_number": registration_number
    });
    if (existingRegistration) {
      res.status(400);
      return next(new Error("Registration number already in use."));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await NGO.create({
      full_name: full_name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "ngo",
      phone_number: phone_number,
      address: address,
      organization_name: organization_name,
      registration_number: registration_number,
      founded_year: founded_year,
      organization_description: organization_description,
      website: website || "",
      social_media_links: social_media_links || "",
      otp: hashedOtp,
      otpExpires,
      isVerified: false,
      stats: {
        totalDonations: 0,
        totalCampaigns: 0,
        activeCampaigns: 0,
        donorsCount: 0
      },
      monthlyDonations: []
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

// const verifyNGO = async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       res.status(400);
//       return next(new Error("Email and OTP are required."));
//     }

//     // Find NGO by email
//     const ngo = await NGO.findOne({ email: email.trim().toLowerCase() });
//     if (!ngo) {
//       res.status(404);
//       return next(new Error("NGO not found."));
//     }

//     // Check if OTP is expired
//     if (ngo.otpExpires < Date.now()) {
//       res.status(400);
//       return next(new Error("OTP has expired. Please request a new one."));
//     }

//     // Verify OTP
//     const isValidOtp = await bcrypt.compare(otp, ngo.otp);
//     if (!isValidOtp) {
//       res.status(400);
//       return next(new Error("Invalid OTP."));
//     }

//     // Update verification status
//     ngo.isVerified = true;
//     ngo.otp = undefined;
//     ngo.otpExpires = undefined;
//     await ngo.save();

//     res.status(200).json({
//       message: "Email verified successfully.",
//       ngo: {
//         id: ngo._id,
//         name: ngo.full_name,
//         organization: ngo.organization_name,
//         email: ngo.email
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const resendOTP = async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       res.status(400);
//       return next(new Error("Email is required."));
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     // Find NGO by email
//     const ngo = await NGO.findOne({ email: normalizedEmail });
//     if (!ngo) {
//       res.status(404);
//       return next(new Error("NGO not found."));
//     }

//     if (ngo.isVerified) {
//       res.status(400);
//       return next(new Error("This account is already verified."));
//     }

//     // Generate new OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const hashedOtp = await bcrypt.hash(otp, 10);
//     const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

//     // Update NGO with new OTP
//     ngo.otp = hashedOtp;
//     ngo.otpExpires = otpExpires;
//     await ngo.save();

//     // Send verification email
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: normalizedEmail,
//       subject: "Verify Your NGO Registration",
//       html: Verification_Email_Template.replace("{verificationCode}", otp),
//     };

//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: "New OTP sent! Please check your email." });
//   } catch (error) {
//     next(error);
//   }
// };
