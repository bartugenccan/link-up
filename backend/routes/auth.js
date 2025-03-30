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

  // Kullanıcı bilgilerinden şifreyi çıkar
  const { password: _, ...userWithoutPassword } = user;

  // Set HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS üzerinden çalışıyorsa true olmalı
    sameSite: "strict",
    maxAge: 3600000, // 1 saat
  });

  res.json({
    status: true,
    message: "Logged in successfully",
    data: {
      user: userWithoutPassword,
    },
  });
});

// Validate Token
const authenticateToken = (req, res, next) => {
  // İlk olarak cookie'den token'ı al
  const tokenFromCookie = req.cookies.token;

  // Cookie yoksa header'dan almayı dene (eski sistemlerle uyumluluk için)
  const authHeader = req.header("Authorization");
  const tokenFromHeader = authHeader ? authHeader.split(" ")[1] : null;

  // İki kaynaktan birinden token'ı al
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: false,
        message: "Forbidden",
      });
    }
    req.user = user;
    next();
  });
};

// Profile
router.get("/profile", authenticateToken, async (req, res) => {
  const { id } = req.user;

  const { data, error } = await supabase
    .from("users")
    .select("id, email, name, created_at, updated_at")
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

// Logout
router.post("/logout", authenticateToken, async (req, res) => {
  // Cookie'yi temizle
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({
    status: true,
    message: "Logged out successfully",
  });
});

// Verify Token
router.get("/verify", authenticateToken, async (req, res) => {
  // Token zaten authenticateToken middleware'i tarafından doğrulandı
  // Sadece başarılı yanıt dönebiliriz
  res.json({
    status: true,
    message: "Token is valid",
  });
});

module.exports = router;
