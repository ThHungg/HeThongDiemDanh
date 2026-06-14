const express = require("express");
const router = express.Router();
const mailConfigController = require("../controllers/mailConfigController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

router.use(authMiddleware, roleMiddleware(["Quan_tri", "Thu_ky"]));

router.get("/", mailConfigController.getMailConfigs);
router.post("/", mailConfigController.createMailConfig);
router.put("/:id", mailConfigController.updateMailConfig);
router.delete("/:id", mailConfigController.deleteMailConfig);
router.post("/send-now/:id", mailConfigController.sendMailNow);

module.exports = router;
