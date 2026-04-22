const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/sendOtp", authController.SendOtp);
router.post("/verifyOtp", authController.VerifyOtp);
router.post("/logout", authController.Logout);

router.get("/me", authMiddleware, authController.GetCurrentUser);

router.post("/refreshToken", authController.RefreshToken);

module.exports = router;
