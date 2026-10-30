const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");
const User = require("../models/userModel");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided."
      });
    }

    const token = authHeader.split(" ")[1];

    // Check if token is blacklisted
    const blacklistedToken = await Token.findOne({ token });

    if (blacklistedToken) {
      return res.status(401).json({
        message: "Token has been invalidated. Please log in again."
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get the user's latest role from the database
    const user = await User.findById(decoded.id).select("_id role");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists."
      });
    }

    req.user = {
      id: user._id,
      role: user.role
    };

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
};

module.exports = verifyToken;