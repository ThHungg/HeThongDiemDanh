const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.get("/:studentId", studentController.getStudentById);

module.exports = router;
