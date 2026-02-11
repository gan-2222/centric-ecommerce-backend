//src/models/cart.model.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("carts", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
    {
      tableName: "carts",
      timestamps: true,
      underscored: true, // 👈 maps createdAt → created_at
    }
);
};
