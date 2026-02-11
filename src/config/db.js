//src/config/db.js

const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "postgres",
//     logging: false,
//     dialectOptions: {
//     ssl: {
//       require: true,              // force SSL
//       rejectUnauthorized: false  // Railway uses self-signed cert
//     }
//   }
//   }
// );

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: process.env.NODE_ENV !== "production" ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,              // force SSL
      rejectUnauthorized: false  // Railway uses self-signed cert
    }
  },
});

module.exports = sequelize;
