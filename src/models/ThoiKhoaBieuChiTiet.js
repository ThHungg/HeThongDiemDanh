const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ThoiKhoaBieuChiTiet = sequelize.define(
  "ThoiKhoaBieuChiTiet",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tkb_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "tkb",
        key: "id",
      },
    },
    thu: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bat_dau: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ket_thuc: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    phong: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    loai_hoc_phan: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Lý thuyết hoặc Thực hành",
    },
    ghi_chu_ca: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ma_nguoi_nhap: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tt: {
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
    tableName: "tkb_chi_tiet",
    timestamps: false,
    underscored: true,
  },
);

module.exports = ThoiKhoaBieuChiTiet;
