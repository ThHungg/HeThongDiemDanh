const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const DiemDanh = sequelize.define(
  "DiemDanh",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    buoi_hoc_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    sinh_vien_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    ma_giang_vien: {
      type: DataTypes.STRING(255),
    },
    diem_so: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 10,
    },
    thoi_gian_diem_danh: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ghi_chu: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "diem_danh",
    timestamps: false,
  },
);

module.exports = DiemDanh;
