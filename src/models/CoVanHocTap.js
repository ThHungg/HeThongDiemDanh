const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CoVanHocTap = sequelize.define(
  "CoVanHocTap",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ghi_chu: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ma_giang_vien: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ma_ky: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    ma_lop: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "co_van_hoc_tap",
    timestamps: false,
    underscored: true,
  },
);

module.exports = CoVanHocTap;
