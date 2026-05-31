const authRoutes = require("./authRoutes");
const classRoutes = require("./classRoutes");
const semesterRoutes = require("./semesterRoutes");
const attendanceRoutes = require("./attendanceRoutes");
const studentRoutes = require("./studentRoutes");
const notificationRoutes = require("./notificationRoutes");
const aiRoutes = require("./aiRoutes");

const routes = (app) => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/classes", classRoutes);
  app.use("/api/v1/semesters", semesterRoutes);
  app.use("/api/v1/attendance", attendanceRoutes);
  app.use("/api/v1/students", studentRoutes);
  app.use("/api/v1/notifications", notificationRoutes);
  app.use("/api/v1/ai", aiRoutes);
};

module.exports = routes;
