//src/models/userProfile.model.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("user_profiles", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    full_name: DataTypes.STRING,
    phone: DataTypes.STRING
  },
    {
      tableName: "user_profiles",
      timestamps: true,
      underscored: true, // 👈 maps createdAt → created_at
    }
);
};
