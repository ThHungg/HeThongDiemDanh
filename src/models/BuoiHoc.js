const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const BuoiHoc = sequelize.define(
  "BuoiHoc",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    tkb_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    tkb_chi_tiet_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    ngay_hoc: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    trang_thai: {
      type: DataTypes.INTEGER,
      defaultValue: 0, 
    },
    loai_buoi_hoc: {
      type: DataTypes.STRING(50),
      defaultValue: "Chinh_thuc",
    },
    ghi_chu: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "buoi_hoc",
    timestamps: false, 
  },
);

module.exports = BuoiHoc;
