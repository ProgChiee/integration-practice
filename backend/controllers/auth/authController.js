const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

// ─── REGISTER ───────────────────────────────────────────────
exports.register = async (req, res) => {
  const { fullName, email, password, region, dietType, allergies, otherAllergy } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users 
        (full_name, email, password, region, diet_type, allergies) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        fullName,
        email,
        hashedPassword,
        region || null,
        dietType || "no_restrictions",
        JSON.stringify(allergies || []),
      ]
    );

    res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ─── LOGIN ──────────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Check kung may kulang na fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // 2. Hanapin ang user sa database
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = users[0];

    // 3. I-compare ang password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 4. Gumawa ng JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ─── GET CURRENT USER (protected) ───────────────────────────
exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, full_name, email, created_at FROM users WHERE id = ?",
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user: users[0] });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error." });
  }
};