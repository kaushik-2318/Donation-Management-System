const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // ✅ Extract token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

    // ✅ Find user in database
    const user = await User.findById(decoded.id).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    req.user = user; // Attach user info to `req.user`
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token. Please log in again." });
  }
};

module.exports = {authMiddleware};
