const bcrypt = require("bcrypt");
const Donor = require("../models/Donor");
const IndividualReceiver = require("../models/IndividualReceiver");
const NGO = require("../models/Ngo");
const { Verification_Email_Template } = require("../utils/emailTemplates");
const transporter = require("../config/nodemailer");


const getSettings = async (req, res, next) => {
    const { id } = req.user;
    const role = req.user.role;

    let user;
    if (role === "donor") {
        user = await Donor.findById(id);
    } else if (role === "receiver") {
        user = await IndividualReceiver.findById(id);
    } else if (role === "ngo") {
        user = await NGO.findById(id);
    } else {
        return next(new Error("User not found"));
    }

    const settings = {
        email: user.email,
        notifications: {
            emailNotifications: true,
            smsNotifications: false,
            campaignUpdates: true,
            donationReceipts: true,
            marketingEmails: false,
        },
        privacy: {
            profileVisibility: "public",
            showDonationAmount: true,
            showInLeaderboard: true,
        }
    };

    res.status(200).json(settings);
};


const requestEmailChange = async (req, res, next) => {
    try {
        const { newEmail, currentPassword } = req.body;
        const { id, role } = req.user;

        if (!currentPassword) {
            return res.status(400).json({ message: "Current password is required" });
        }

        if (!newEmail) {
            return res.status(400).json({ message: "New email is required" });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const UserModel = getUserModel(role);

        if (!UserModel) {
            return res.status(400).json({ message: "Invalid user role" });
        }

        const existingUser = await UserModel.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }


        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date();
        otpExpires.setMinutes(otpExpires.getMinutes() + 15);
        const hashedOtp = await bcrypt.hash(otp, 10);


        if (role === "ngo") {
            user.newEmailRequest = true;
            user.newEmail = newEmail;
            user.otp = hashedOtp;
            user.otpExpires = otpExpires;
        } else {
            user.otp = hashedOtp;
            user.otpExpires = otpExpires;
            user.newEmail = newEmail;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: newEmail,
            subject: "Verify Your Email Change Request",
            text: `Your verification code is ${otp}`,
            html: Verification_Email_Template.replace("{verificationCode}", otp),
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Verification code sent to your new email" });
    } catch (error) {
        console.log(error);
        next(error);
    }
};


const changeEmail = async (req, res, next) => {
    try {
        const { otp, email } = req.body;
        const { id, role } = req.user;

        if (!otp) {
            return res.status(400).json({ message: "Verification code is required" });
        }

        if (!email) {
            return res.status(400).json({ message: "New email is required" });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        let user;
        if (role === "donor") {
            user = await Donor.findById(id);
        } else if (role === "receiver") {
            user = await IndividualReceiver.findById(id);
        } else if (role === "ngo") {
            user = await NGO.findById(id);
        } else {
            return next(new Error("User not found"));
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.newEmailRequest) {
            return res.status(400).json({ message: "No email change request found" });
        }

        const isPasswordValid = await bcrypt.compare(otp, user.newEmailOTP);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid verification code" });
        }


        if (role === "ngo") {
            user.email = email;
            user.newEmail = '';
            user.newEmailRequest = false;
            user.otp = '';
            user.otpExpires = '';
        } else {
            user.email = email;
            user.otp = '';
            user.otpExpires = '';
        }
        await user.save();

        res.status(200).json({ message: "Email changed successfully", email: user.email });
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const { id, role } = req.user;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current password and new password are required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "New password must be at least 8 characters long" });
        }

        let user;
        if (role === "donor") {
            user = await Donor.findById(id);
        } else if (role === "receiver") {
            user = await IndividualReceiver.findById(id);
        } else if (role === "ngo") {
            user = await NGO.findById(id);
        } else {
            return next(new Error("User not found"));
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        next(error);
    }
};

const updateSettings = async (req, res, next) => {
    try {
        const { notifications, privacy } = req.body;
        const { id, role } = req.user;

        const UserModel = getUserModel(role);
        if (!UserModel) {
            return res.status(400).json({ message: "Invalid user role" });
        }

        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.settings) {
            user.settings = {};
        }

        if (notifications) {
            user.settings.notifications = {
                emailNotifications: notifications.emailNotifications ?? true,
                smsNotifications: notifications.smsNotifications ?? false,
                campaignUpdates: notifications.campaignUpdates ?? true,
                donationReceipts: notifications.donationReceipts ?? true,
                marketingEmails: notifications.marketingEmails ?? false,
            };
        }

        if (privacy) {
            user.settings.privacy = {
                profileVisibility: privacy.profileVisibility ?? "public",
                showDonationAmount: privacy.showDonationAmount ?? true,
                showInLeaderboard: privacy.showInLeaderboard ?? true,
            };
        }

        await user.save();

        res.status(200).json({
            message: "Settings updated successfully",
            settings: {
                notifications: user.settings.notifications,
                privacy: user.settings.privacy
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSettings,
    changePassword,
    requestEmailChange,
    changeEmail,
    updateSettings
};