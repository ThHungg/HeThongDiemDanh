const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ChuyenCan = sequelize.define(
  "ChuyenCan",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    dang_ky_id: { type: DataTypes.BIGINT, allowNull: false },
    diem_trung_binh: { type: DataTypes.DECIMAL(4, 2), defaultValue: 0.0 },
  },
  {
    tableName: "chuyen_can",
    timestamps: false,
  },
);

module.exports = ChuyenCan;
