const AccessPermission = require("../models/accessPermission");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Model = require("../models/model");

const grantAccess = async (req, res) => {
  try {
    const { userId, modelId } = req.body;
    if (
      !mongoose.isValidObjectId(userId) ||
      !mongoose.isValidObjectId(modelId)
    ) {
      return res.status(400).json({
        message: "Invalid user ID or model ID",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const model = await Model.findById(modelId);
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    const grantedBy = req.user.id;

    const permission = await AccessPermission.create({
      user: userId,
      model: modelId,
      grantedBy: grantedBy,
    });

    res
      .status(201)
      .json({ message: "Access granted successfully", permission });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(409).json({
        message: "This user already has access to this model",
      });
    }

    res.status(500).json({
      message: "Failed to grant access",
    });
  }
};

const revokeAccess = async (req, res) => {
  try {
    const { userId, modelId } = req.body;
    if (
      !mongoose.isValidObjectId(userId) ||
      !mongoose.isValidObjectId(modelId)
    ) {
      return res.status(400).json({
        message: "Invalid user ID or model ID",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const model = await Model.findById(modelId);
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    const permission = await AccessPermission.findOneAndDelete({
      user: userId,
      model: modelId,
    });
    if (!permission) {
      return res
        .status(404)
        .json({ message: "No matching permission was found" });
    }

    return res.status(200).json({ message: "Access revoked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to revoke access",
    });
  }
};

module.exports = { grantAccess, revokeAccess };
