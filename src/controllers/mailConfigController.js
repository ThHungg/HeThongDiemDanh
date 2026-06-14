const mailConfigService = require("../services/mailConfigService");

const getMailConfigs = async (req, res) => {
  try {
    const response = await mailConfigService.getMailConfigs();
    if (response.status === "Err") {
      return res.status(response.code || 400).json(response);
    }
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    });
  }
};

const createMailConfig = async (req, res) => {
  try {
    const response = await mailConfigService.createMailConfig(req.body);
    if (response.status === "Err") {
      return res.status(response.code || 400).json(response);
    }
    return res.status(201).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    });
  }
};

const updateMailConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await mailConfigService.updateMailConfig(id, req.body);
    if (response.status === "Err") {
      return res.status(response.code || 400).json(response);
    }
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    });
  }
};

const deleteMailConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await mailConfigService.deleteMailConfig(id);
    if (response.status === "Err") {
      return res.status(response.code || 400).json(response);
    }
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    });
  }
};

const sendMailNow = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await mailConfigService.sendMailNow(id);
    if (response.status === "Err") {
      return res.status(response.code || 400).json(response);
    }
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    });
  }
};

module.exports = {
  getMailConfigs,
  createMailConfig,
  updateMailConfig,
  deleteMailConfig,
  sendMailNow,
};
