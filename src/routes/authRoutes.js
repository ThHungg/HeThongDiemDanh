const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/sendOtp", authController.SendOtp);
router.post("/verifyOtp", authController.VerifyOtp);
router.post("/logout", authController.Logout);

router.post("/refreshToken", authController.RefreshToken);

module.exports = router;
