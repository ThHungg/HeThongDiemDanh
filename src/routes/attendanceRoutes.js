const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

router.get("/:classCode", attendanceController.getAttendanceByClass);
router.post("/update", attendanceController.updateAttendanceByClass);

module.exports = router;
