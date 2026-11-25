const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/User");

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        error: "Please provide your name, email and password.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length > 60) {
      return res.status(400).json({
        success: false,
        error: "Name must be between 1 and 60 characters.",
      });
    }

    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email address.",
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        success: false,
        error: "Password must be between 8 and 72 characters.",
      });
    }

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token: createToken(user._id.toString()),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "An account with this email already exists.",
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to create your account.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        error: "Please enter your email and password.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail })
      .select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token: createToken(user._id.toString()),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to log in.",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Unable to fetch account details.",
    });
  }
};

module.exports = { register, login, getMe };