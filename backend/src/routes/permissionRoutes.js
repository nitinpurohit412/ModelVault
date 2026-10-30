const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRoles");
const {grantAccess, revokeAccess, getPermissions, getMyPermissions} = require("../controllers/permissionController")

const router = express.Router()

router.post("/", verifyToken, authorizeRole("admin"), grantAccess)

router.delete("/", verifyToken, authorizeRole("admin"), revokeAccess)

router.get("/", verifyToken, authorizeRole("admin", "manager"), getPermissions)

router.get("/my", verifyToken, getMyPermissions);

module.exports = router;    