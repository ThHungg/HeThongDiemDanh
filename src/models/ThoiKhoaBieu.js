const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ThoiKhoaBieu = sequelize.define(
  "ThoiKhoaBieu",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ma_lop_hoc_phan: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ma_hoc_phan: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ma_ky: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ma_giang_vien: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ma_nguoi_nhap: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ma_nguoi_coi_thi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ten_lop: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sldk: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    suc_chua: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ngay_thi: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    phong_thi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ca_thi: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hinh_thuc_thi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ghi_chu: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ghi_chu_lich_thi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    trang_thai: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tt_tkb_truong: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    time: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    last_modify: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
  },
  {
    tableName: "tkb",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["tt_tkb_truong", "ma_ky"],
      },
      {
        unique: true,
        fields: ["ma_lop_hoc_phan", "ma_ky"],
      },
    ],
  },
);

module.exports = ThoiKhoaBieu;
