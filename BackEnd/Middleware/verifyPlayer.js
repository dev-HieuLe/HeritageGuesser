import jwt from "jsonwebtoken";

export const verifyPlayer = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ status: "Error", message: "No token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token is expired!" });

    req.id = decoded.id;
    req.name = decoded.name;
    req.email = decoded.email;
    next();
  });

  console.log("Token from cookie:", req.cookies.token);
};
