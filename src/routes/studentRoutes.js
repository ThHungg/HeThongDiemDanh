const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

router.get(
  "/profile/:studentId",
  authMiddleware,
  studentController.getStudentById,
);
router.get(
  "/attend/:classCode",
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
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["Quan_tri", "Thu_ky"]),
  studentController.getAllStudents,
);
router.get(
  "/:studentId/classes",
  authMiddleware,
  studentController.getClassesByStudentId,
);
router.get(
  "/attend/:classCode/:studentId",
  authMiddleware,
  studentController.getSpecificStudentAttendance,
);

router.get(
  "/getFilterData",
  authMiddleware,
  studentController.getCoVanFilterData,
);


module.exports = router;
