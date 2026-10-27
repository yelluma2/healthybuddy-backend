const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, age, gender });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: createToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: createToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};