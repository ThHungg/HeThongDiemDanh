const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

router.get(
  "/lecturer/myClasses",
  authMiddleware,
  roleMiddleware(["Giang_vien", "Thinh_giang", "Quan_tri", "Thu_ky"]),
  classController.getClassesByLecturer,
);
router.get(
  "/lecturer/myClasses/:classCode",
  authMiddleware,
  classController.getClassByLecturerAndId,
);

//Student routes
router.get(
  "/student/myClasses",
  authMiddleware,
  classController.getClassesByStudent,
);

module.exports = router;
