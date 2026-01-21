const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../db");

// REGISTER
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[a-z]/).withMessage("Must contain a lowercase letter")
    .matches(/[A-Z]/).withMessage("Must contain an uppercase letter")
    .matches(/[0-9]/).withMessage("Must contain a number")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare(
        "INSERT INTO users(email, password) VALUES (?, ?)"
      );
      stmt.run(email, hashedPassword);
      res.status(201).send("User created successfully");
    } catch (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(400).send("Email already in use");
      }
      res.status(500).send("Server error during registration");
    }
  }
);

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for: ${email}`);

  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (!user) {
      console.log("Login failed: User not found");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log("Login failed: Password mismatch");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    console.log("Login successful: Token generated");
    return res.json({ token });
  } catch (err) {
    console.error("Login route error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;