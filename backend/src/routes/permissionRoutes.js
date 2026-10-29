const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRoles");
const {grantAccess, revokeAccess} = require("../controllers/permissionController")

const router = express.Router()

router.post("/", verifyToken, authorizeRole("admin"), grantAccess)

router.delete("/", verifyToken, authorizeRole("admin"), revokeAccess)

module.exports = router;    