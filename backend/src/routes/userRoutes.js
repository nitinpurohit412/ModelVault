const express = require('express')
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRoles");
const {getAllUsers, updateUserRole, deleteUser, getUserModel} = require('../controllers/userController')

const router = express.Router()

router.get("/", verifyToken, authorizeRole("admin"), getAllUsers)

router.patch("/:id/role", verifyToken, authorizeRole("admin"), updateUserRole)

router.delete("/:id", verifyToken, authorizeRole("admin"), deleteUser)

router.get("/:id/models", verifyToken, authorizeRole("admin"), getUserModel)

module.exports = router;