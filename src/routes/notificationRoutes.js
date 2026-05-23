const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

// Unified endpoint - gửi email cho single hoặc bulk sinh viên
router.post("/sendEmail", authMiddleware, notificationController.sendEmail);

module.exports = router;
