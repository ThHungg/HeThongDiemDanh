const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const DangKy = sequelize.define(
  "DangKy",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    last_modify: {
      type: DataTypes.DATE(6),
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
    ma_lop_hoc_phan: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    msv: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ngay_dang_ky: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    nguoi_dang_ky: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tinh_trang_hoc_phi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    hoc_phan_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "hoc_phan",
        key: "id",
      },
    },
    sinh_vien_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "sinh_vien",
        key: "id",
      },
    },
  },
  {
    tableName: "dang_ky",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: "fk_dangky_sinhvien",
        fields: ["sinh_vien_id"],
      },
      {
        name: "fk_dangky_hocphan",
        fields: ["hoc_phan_id"],
      },
    ],
  },
);

module.exports = DangKy;
