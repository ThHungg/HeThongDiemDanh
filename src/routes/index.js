const authRoutes = require("./authRoutes");
const classRoutes = require("./classRoutes");
const semesterRoutes = require("./semesterRoutes");

const routes = (app) => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/classes", classRoutes);
  app.use("/api/v1/semesters", semesterRoutes);
};

module.exports = routes;
