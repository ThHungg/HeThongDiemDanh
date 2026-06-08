const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/students/filters", authMiddleware, aiController.AIController);

module.exports = router;
