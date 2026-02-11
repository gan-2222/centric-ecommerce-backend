//src/models/order.model.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("orders", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_amount: DataTypes.DECIMAL(10, 2)
  },
    {
      tableName: "orders",
      timestamps: true,
      underscored: true, // ?? maps createdAt ? created_at
    }
);
};


