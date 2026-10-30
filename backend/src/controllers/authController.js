const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    //* check required fields
    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    //* Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ userName, email, password: hashPassword });
    await newUser.save();
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

//! LOGIN FIELD

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!!" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await Token.create({
      token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    return res.status(200).json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
};
