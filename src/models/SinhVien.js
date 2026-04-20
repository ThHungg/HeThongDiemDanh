const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const SinhVien = sequelize.define(
  "SinhVien",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ma_sinh_vien: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    dien_thoai1: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dien_thoai2: {
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
    ghi_chu: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ho_ten_dem: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    khoa: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    khoa_nhap_hoc: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lop: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lop_chuyen_nganh: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    nganh: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ngay_sinh: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    nhap_hoc: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ten: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    trang_thai: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "sinh_vien",
    timestamps: false,
    underscored: true,
  },
);

module.exports = SinhVien;
