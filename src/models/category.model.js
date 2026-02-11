//src/models/category.model.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("categories", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
    {
      tableName: "categories",
      timestamps: true,
      underscored: true, // ?? maps createdAt ? created_at
    }
);
};
