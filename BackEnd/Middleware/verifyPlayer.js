import jwt from "jsonwebtoken";

export const verifyPlayer = (req, res, next) => {
  // Support both cookie (web) and Bearer token (Android)
  const authHeader = req.headers.authorization;
  const token =
    (authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null) || req.cookies.token;

  if (!token)
    return res.status(401).json({ status: "Error", message: "No token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token is expired!" });

    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };
    next();
  });
};
