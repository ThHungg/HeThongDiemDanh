const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/profile/:studentId", studentController.getStudentById);
router.get(
  "/attend",
  authMiddleware,
  studentController.getAttendanceByStudentId,
);
//Student routes
router.get("/myClasses", authMiddleware, studentController.getClassesByStudent);
router.get(
  "/myClasses/:classCode",
  authMiddleware,
  studentController.getClassByStudentAndId,
);

//Department
//Get All
router.get("/", studentController.getAllStudents);
router.get("/:studentId/classes", studentController.getClassesByStudentId);

module.exports = router;
