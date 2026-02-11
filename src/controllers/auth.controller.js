// src/controllers/auth.controller.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, UserProfile, Role } = require("../models");
const { jwtSecret, jwtExpiresIn } = require("../config/auth");

/**
 * REGISTER
 */
exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone, role = "customer" } = req.body;

    // 1. Validate role
    const roleData = await Role.findOne({ where: { name: role } });
    if (!roleData) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // 2. Check existing user (IMPORTANT)
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      role_id: roleData.id,
    });

    // 5. Create profile (optional fields allowed)
    await UserProfile.create({
      user_id: user.id,
      full_name: full_name || null,
      phone: phone || null,
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * LOGIN
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "role",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role.name, // ✅ FIXED
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

