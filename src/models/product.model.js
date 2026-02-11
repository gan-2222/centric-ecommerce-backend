//src/models/product.model.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("products", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    sku: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2),
    discount_price: DataTypes.DECIMAL(10, 2),    
    stock_quantity: DataTypes.INTEGER,
    rating_avg: DataTypes.DECIMAL(2, 1),
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
    {
      tableName: "products",
      timestamps: true,
      underscored: true, // ?? maps createdAt ? created_at
    }
);
};

