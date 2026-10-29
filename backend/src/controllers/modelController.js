const Model = require("../models/model");
const AccessPermission = require("../models/accessPermission");
const mongoose = require("mongoose");

const models = async (req, res, next) => {
  try {
    const { name, provider, description } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof provider !== "string" ||
      !provider.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        message: "Name, provider, and description must be non-empty strings",
      });
    }

    const newModel = await Model.create({
      name: name.trim(),
      provider: provider.trim(),
      description: description.trim(),
    });
    res.status(201).json({
      message: `Model successfully created and the newly created model is ${name}`,
      newModel,
    });
  } catch (err) {
    next(err);
  }
};

const getModels = async (req, res, next) => {
  try {
    if (req.user.role === "admin" || req.user.role === "manager") {
      const allModels = await Model.find();
      return res.status(200).json({ models: allModels });
    }

    const permissions = await AccessPermission.find({
      user: req.user.id,
    });

    const modelIds = permissions.map((permission) => {
      return permission.model;
    });

    const allowedModels = await Model.find({
      _id: { $in: modelIds },
    });
    return res.status(200).json({ models: allowedModels });
  } catch (err) {
    next(err);
  }
};

const getModelById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid model ID",
      });
    }

    const model = await Model.findById(id);
    if (!model) {
      return res.status(404).json({
        message: "Model not found",
      });
    }

    if (req.user.role === "admin" || req.user.role === "manager") {
      return res.status(200).json({ model });
    }

    const permission = await AccessPermission.findOne({
      user: req.user.id,
      model: model._id,
    });
    if (!permission) {
      return res.status(403).json({ message: "User has no permission." });
    }

    return res.status(200).json({ model });
  } catch (err) {
    next(err);
  }
};

const updateModels = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid modelId" });
    }

    const { name, provider, description } = req.body;
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof provider !== "string" ||
      !provider.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        message: "Name, provider, and description must be non-empty strings",
      });
    }

    const updatedModel = await Model.findByIdAndUpdate(
      id,
      {
        name: name,
        provider: provider,
        description: description,
      },
      { new: true, runValidators: true },
    );

    if (!updatedModel) {
      return res.status(404).json({ message: "Model can't be updated" });
    }

    return res
      .status(200)
      .json({ message: "Model was successfully updated", updatedModel });
  } catch (err) {
    next(err);
  }
};

const deleteModel = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid modelId" });
    }

    const checkModel = await Model.findById(id);
    if (!checkModel) {
      return res.status(404).json({
        message: "Model not found",
      });
    }

    await AccessPermission.deleteMany({ model: id });

    await Model.findByIdAndDelete(id);

    return res.status(200).json({ message: "Model deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { models, getModels, getModelById, updateModels, deleteModel };
