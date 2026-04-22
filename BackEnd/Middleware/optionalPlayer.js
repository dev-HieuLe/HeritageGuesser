import jwt from "jsonwebtoken";

/**
 * Like verifyPlayer but never blocks the request.
 * If a valid token is present, populates req.user; otherwise req.user stays undefined.
 */
export const optionalPlayer = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    (authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null) || req.cookies?.token;

  if (!token) return next();

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      req.user = { id: decoded.id, name: decoded.name, email: decoded.email };
    }
    next();
  });
};
