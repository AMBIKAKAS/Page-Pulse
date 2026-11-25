const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Please log in to access this resource.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        error: "Authentication configuration is missing.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired session. Please log in again.",
    });
  }
};

module.exports = { protect };