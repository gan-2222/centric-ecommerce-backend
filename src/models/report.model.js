//src/models/report.model.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("reports", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    report_type: DataTypes.STRING,
    generated_by: DataTypes.INTEGER
  },
    {
      tableName: "reports",
      timestamps: true,
      underscored: true, // ?? maps createdAt ? created_at
    }
);
};
