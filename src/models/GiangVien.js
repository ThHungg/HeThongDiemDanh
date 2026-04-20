const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const GiangVien = sequelize.define(
  "GiangVien",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ma_giang_vien: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ho_ten_dem: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ten: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    don_vi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    hoc_vi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    hoc_ham: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email1: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: { isEmail: true },
    },
    email2: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: { isEmail: true },
    },
    dien_thoai: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ghi_chu: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    co_huu1: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    co_huu2: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    giang_vien: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    quan_tri: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    thinh_giang: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    thu_ky: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    trang_thai: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "giang_vien",
    timestamps: false,
    underscored: true,
  },
);

module.exports = GiangVien;
