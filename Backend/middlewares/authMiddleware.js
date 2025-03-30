const jwt = require("jsonwebtoken");
const Donor = require("../models/Donor");
const IndividualReceiver = require("../models/IndividualReceiver");
const NGO = require("../models/Ngo");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

    const id = decoded.id;
    const role = decoded.role;

    let user;
    if (role === "donor") {
      user = await Donor.findById(id).select("-password");
    }
    else if (role === "ngo") {
      user = await NGO.findById(id).select("-password");
    }
    else if (role === "receiver") {
      user = await IndividualReceiver.findById(id).select("-password");
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }
    req.user = user;
    req.role = role;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token. Please log in again." });
  }
};

module.exports = { authMiddleware };
