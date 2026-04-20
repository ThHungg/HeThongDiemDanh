const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const HocPhan = sequelize.define(
  "HocPhan",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    ma_hoc_phan: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    ten_hoc_phan: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    so_tin_chi: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    so_ca: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nganh_phu_trach: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    ma_giang_vien: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    tien_quyet: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    bat_buoc_nganh: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    mon_thay_the: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ma_mon_thay_the: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ma_hoc_phan_hien_tai: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mo_rong: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lien_lac: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    tableName: "hoc_phan",
    timestamps: false,
    underscored: true,
  },
);

module.exports = HocPhan;
