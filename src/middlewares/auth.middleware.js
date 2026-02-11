// src/middlewares/auth.middleware.js

const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/auth");

function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Handle: "Bearer <token>" OR "Bearer bearer <token>"
    const parts = authHeader.split(" ").filter(Boolean);

    const token =
      parts.length === 2 ? parts[1] :
      parts.length === 3 && parts[1].toLowerCase() === "bearer" ? parts[2] :
      null;

    if (!token) {
      return res.status(401).json({ message: "Invalid Authorization header" });
    }

    const decoded = jwt.verify(token, jwtSecret);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = auth;
