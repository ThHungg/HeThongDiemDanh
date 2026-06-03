const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

const attendanceRoles = ["Giang_vien", "Thinh_giang", "Quan_tri", "Thu_ky"];

router.use(authMiddleware, roleMiddleware(attendanceRoles));

router.get("/:classCode", attendanceController.getAttendanceByClass);
router.post("/update", attendanceController.updateAttendanceByClass);
router.get("/export/:classCode", attendanceController.exportAttendanceByClass);
router.get("/download/:fileName", attendanceController.downloadAttendanceFile);

module.exports = router;
