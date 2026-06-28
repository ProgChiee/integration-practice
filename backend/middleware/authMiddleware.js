const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  // Kunin ang token sa header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token. Access denied." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // I-verify ang token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};