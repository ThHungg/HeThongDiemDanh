const notificationService = require("../services/notificationService");

const sendEmail = async (req, res) => {
  try {
    const { listMsv, subject, content, classCode } = req.body;
    const response = await notificationService.sendEmail(
      listMsv,
      subject,
      content,
      classCode,
    );
    if (response.status === "Err") {
      return res.status(response.code || 400).json(response);
    }
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    });
  }
};

module.exports = {
  sendEmail,
};
