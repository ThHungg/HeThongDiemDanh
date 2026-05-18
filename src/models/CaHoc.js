const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CaHoc = sequelize.define(
  "CaHoc",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    gio_bat_dau: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    gio_ket_thuc: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    ten_ca: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "ca_hoc",
    timestamps: false,
    underscored: true,
  },
);

module.exports = CaHoc;
