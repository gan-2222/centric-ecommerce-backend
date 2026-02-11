//src/models/payment.model.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("payments", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    razorpay_order_id: DataTypes.STRING,
    razorpay_payment_id: DataTypes.STRING,
    razorpay_signature: DataTypes.STRING,
    amount: DataTypes.DECIMAL(10, 2),
    currency: DataTypes.STRING,
    payment_method: DataTypes.STRING
  },
    {
      tableName: "payments",
      timestamps: false,
      underscored: true, // ?? maps createdAt ? created_at
    }
);
};
