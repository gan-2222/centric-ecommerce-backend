//src/models/orderItemStatus.model.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("order_item_statuses", {
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
      tableName: "order_item_statuses",
      timestamps: false, // 👈 IMPORTANT (roles table has NO timestamps)
    });
};
