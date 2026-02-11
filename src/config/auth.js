//src/config/auth.js

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

module.exports = {
  jwtSecret: process.env.JWT_SECRET || "supersecretkey",
  jwtExpiresIn: "1d"
};
