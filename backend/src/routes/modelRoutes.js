const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRoles");
const {
  models,
  getModels,
  getModelById,
  updateModels,
  deleteModel,
  toggleModelStatus,
} = require("../controllers/modelController");

const router = express.Router();

router.post("/", verifyToken, authorizeRole("admin"), models);

router.get("/", verifyToken, getModels);

router.get("/:id", verifyToken, getModelById);

router.patch("/:id", verifyToken, authorizeRole("admin"), updateModels);

router.patch(
  "/:id/status",
  verifyToken,
  authorizeRole("admin"),
  toggleModelStatus,
);

router.delete("/:id", verifyToken, authorizeRole("admin"), deleteModel);

module.exports = router;
