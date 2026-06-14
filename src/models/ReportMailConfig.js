const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ReportMailConfig = sequelize.define(
    "ReportMailConfig",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        kich_hoat: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0, // 0 = Tắt, 1 = Bật
        },
        loai_chu_ky: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "weekly", // "daily", "weekly", "monthly"
        },
        gio_gui: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 20,
        },
        diem_min: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0.0,
        },
        diem_max: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 5.0,
        },
        email_nhan: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        tableName: "report_mail_config",
        timestamps: false,
    }
);

module.exports = ReportMailConfig;
