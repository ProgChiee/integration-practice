const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/auth/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route (kailangan ng token)
router.get("/me", protect, getMe);

module.exports = router;