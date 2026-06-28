const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db"); // Kung db.js pa rin ang pangalan, basta ito yung may createClient() ng Supabase

// ─── REGISTER ───────────────────────────────────────────────
exports.register = async (req, res) => {
  const { fullName, email, password, region, dietType, allergies, otherAllergy } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // 1. Check kung may umiiral nang email sa Supabase
    const { data: existing, error: checkError } = await db
      .from("users")
      .select("id")
      .eq("email", email);

    if (checkError) throw checkError;

    if (existing && existing.length > 0) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // 2. I-hash ang password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Ayusin ang format ng allergies array
    const finalAllergies = (allergies || []).map(a => a === 'others' ? `others: ${otherAllergy || ''}` : a);

    // 4. I-insert sa Supabase (Gagamitin ang totoong column names mo sa DB)
    const { error: insertError } = await db
      .from("users")
      .insert([
        {
          full_name: fullName,
          email: email,
          password: hashedPassword,
          region: region || null,
          diet_type: dietType || "no_restrictions",
          allergies: finalAllergies, // Otomatikong array/JSONB ito sa Supabase!
        }
      ]);

    if (insertError) throw insertError;

    res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
    console.error("Register error:", error.message || error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ─── LOGIN ──────────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // 1. Hanapin ang user sa Supabase (.single() para isang object lang ang ibalik, hindi array)
    const { data: user, error: fetchError } = await db
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle(); // Iiwas sa error kung walang nahanap

    if (fetchError) throw fetchError;

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 2. I-compare ang password gamit ang bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 3. Gumawa ng JWT token
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
    console.error("Login error:", error.message || error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ─── GET CURRENT USER (protected) ───────────────────────────
exports.getMe = async (req, res) => {
  try {
    // Kunin ang user profile base sa id na galing sa authMiddleware (req.userId)
    const { data: user, error: fetchError } = await db
      .from("users")
      .select("id, full_name, email, created_at")
      .eq("id", req.userId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
 } catch (error) {
  console.error("Register error FULL:", JSON.stringify(error, null, 2));
  console.error("Register error message:", error.message);
  res.status(500).json({ message: "Server error. Please try again." });
}
};