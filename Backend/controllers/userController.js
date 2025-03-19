const User = require("../models/User");
const bcrypt = require("bcrypt");

const getUserProfile = async (req, res, next) => {
  try {
    // ✅ Only allow users to fetch their own profile (unless admin)
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return next(
        new Error("Access denied. You can only view your own profile.")
      );
    }

    const user = await User.findById(req.params.id).select("-password"); // Exclude password

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
    const { name, phone_number, password } = req.body;

    // ✅ Only allow users to update their own profile (unless admin)
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return next(
        new Error("Access denied. You can only update your own profile.")
      );
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new Error("User not found."));
    }

    // ✅ Update fields
    if (name) user.name = name.trim();
    if (phone_number) user.phone_number = phone_number.trim();
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({ message: "Profile updated successfully!" });
  } catch (error) {
    next(error);
  }
};

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


