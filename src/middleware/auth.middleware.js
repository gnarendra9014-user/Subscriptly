
import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token required",
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token required",
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: String(decoded.sub),
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
}
