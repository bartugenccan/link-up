const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabase = require("../supabase");
require("dotenv").config();

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase
    .from("users")
    .insert([{ email, password: hashedPassword, name }])
    .select("*");

  if (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }

  res.json({
    status: true,
    message: "User registered successfully",
  });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .limit(1);

  if (error) {
    return res.status(400).json({
      status: false,
      message: "Invalid credentials",
    });
  }

  const user = users[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      status: false,
      message: "Invalid credentials",
    });
  }

  // Create a JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({
    status: true,
    message: "Logged in successfully",
    data: {
      token,
      user,
    },
  });
});

// Validate Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
    });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
    });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({
        status: false,
        message: "Forbidden",
      });
    req.user = user;
    next();
  });
};

// Profile
router.get("/profile", authenticateToken, async (req, res) => {
  const { id } = req.user;

  const { data, error } = await supabase
    .from("users")
    .select("id, email")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }

  res.json({
    status: true,
    message: "Profile retrieved successfully",
    data,
  });
});

module.exports = router;
