const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true, // Tiết lập này quan trọng để TiDB chấp nhận
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

const connectDB = async () => {
  try {
    const res = await sequelize.authenticate();
    await sequelize.sync({ alert: true });
    console.log("Connect DB is success!");
  } catch (e) {
    console.error("Unable to connect to the database:", e);
  }
};

module.exports = { sequelize, connectDB };
