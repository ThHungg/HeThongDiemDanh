const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Ky = sequelize.define(
  "Ky",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    ma_ky: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    ten_ky: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ma_nam: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    bat_dau_ky_hoc: {
      type: DataTypes.DATE(6),
      allowNull: true,
      comment: "Ngày bắt đầu kỳ để tính toán lịch học động",
    },
    ket_thuc_ky_hoc: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    bat_dau_lap_lich: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    ket_thuc_lap_lich: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    bat_dau_chon_lich: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    ket_thuc_chon_lich: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    mac_dinh: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "1 là kỳ hiện tại đang hoạt động",
    },
    trang_thai: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    last_modify: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
  },
  {
    tableName: "ky",
    timestamps: false,
    underscored: true,
  },
);

module.exports = Ky;
