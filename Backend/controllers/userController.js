const Donor = require("../models/Donor");
const IndividualReceiver = require("../models/Receiver");
const NGO = require("../models/Ngo");

const getUserProfile = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return next(
        new Error("Access denied. You can only view your own profile.")
      );
    }

    const role = req.role;

    let user;
    if (role === "donor") {
      user = await Donor.findById(req.params.id).select("-password");
    }
    else if (role === "ngo") {
      user = await NGO.findById(req.params.id).select("-password");
    }
    else if (role === "receiver") {
      user = await IndividualReceiver.findById(req.params.id).select("-password");
    }

    if (!user) {
      return next(new Error("User not found."));
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { name, phone_number, address, bio, avatar, organizationName, registrationNumber, website, bankDetails, reason_for_registration, id_proof } = req.body;

    console.log(req.body);

    if (req.user.id !== req.params.id) {
      return next(new Error("Access denied. You can only update your own profile."));
    }

    const role = req.role;
    let user;

    if (role === "donor") {
      user = await Donor.findById(req.params.id).select("-password");
    } else if (role === "ngo") {
      user = await NGO.findById(req.params.id).select("-password");
    } else if (role === "receiver") {
      user = await IndividualReceiver.findById(req.params.id).select("-password");
    }

    if (!user) {
      return next(new Error("User not found."));
    }

    if (name) user.full_name = name.trim();
    if (phone_number) user.phone_number = phone_number.trim();
    if (address) user.address = address.trim();

    if (role === "ngo") {
      if (organizationName) user.organizationName = organizationName.trim();
      if (registrationNumber) user.registrationNumber = registrationNumber.trim();
      if (website) user.website = website.trim();
    } else if (role === "receiver") {
      if (bankDetails) user.bank_details = bankDetails;
      if (reason_for_registration) user.reason_for_registration = reason_for_registration.trim();
      if (id_proof) user.id_proof = id_proof;
    }

    await user.save();

    res.json({ message: "Profile updated successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = updateUserProfile;


const deleteUserAccount = async (req, res, next) => {
  try {
    // ✅ Only allow users to delete their own account (unless admin)
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return next(
        new Error("Access denied. You can only delete your own account.")
      );
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new Error("User not found."));
    }

    await user.deleteOne();

    res.json({ message: "User account deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateUserProfile, deleteUserAccount };


