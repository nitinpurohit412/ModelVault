const User = require("../models/userModel");
const AccessPermission = require("../models/accessPermission");
const mongoose = require("mongoose");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ["user", "manager", "admin"];
    if (!allowedRoles) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User role updated Successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to update user role",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (id === req.user.id) {
      return res.status(403).json({
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await AccessPermission.deleteMany({
      $or: [{ user: id }, { grantedBy: id }],
    });

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to delete User",
    });
  }
};

const getUserModel = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const permissions = await AccessPermission.find({ user: id }).populate(
      "model",
    );

    const models = permissions
      .map((permission) => permission.model)
      .filter(Boolean);

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
      models,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser, getUserModel };
