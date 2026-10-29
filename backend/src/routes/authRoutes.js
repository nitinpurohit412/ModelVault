const express = require('express')
const {register, login} = require('../controllers/authController')
const verifyToken = require("../middleware/authMiddleware")
const authorizeRole = require('../middleware/authorizeRoles')

const router = express.Router()

router.post("/register", register)
router.post("/login", login)

router.get("/me", verifyToken, (req,res)=>{
     res.status(200).json({
    message: "Authentication successful",
    user: req.user,
  });
})

router.get("/admin-test", verifyToken, authorizeRole("admin"), (req,res)=>{
  res.status(200).json({message : "Admin access granted"})
})


module.exports = router