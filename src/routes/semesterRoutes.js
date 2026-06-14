const express = require("express");
const router = express.Router();
const semesterController = require("../controllers/semesterController");

router.get("/current", semesterController.getCurrentSemester);
router.get("/", semesterController.getAllSemesters);
router.post("/toggleLock", semesterController.toggleLockSemester)

module.exports = router;
