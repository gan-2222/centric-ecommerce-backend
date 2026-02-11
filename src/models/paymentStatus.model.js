//src/models/paymentStatus.model.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("payment_statuses", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true
    }
  },
    {
      tableName: "payment_statuses",
      timestamps: false, // 👈 IMPORTANT (roles table has NO timestamps)
    });
};
