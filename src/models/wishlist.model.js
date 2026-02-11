//src/models/wishlist.model.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("wishlists", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
    {
      tableName: "wishlists",
      timestamps: true,
      underscored: true, // ?? maps createdAt ? created_at
    }
);
};
