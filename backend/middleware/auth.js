const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access forbidden: No token provided");
  }

  try {
    // Verify the token using the secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded payload (userId) to the request object
    req.user = decoded;
    
    // Move to the next middleware or route handler
    next(); 
  } catch (err) {
    // Triggers if the token is malformed, expired, or tampered with
    console.error("JWT Verification error:", err.message);
    return res.status(403).send("Access forbidden: Invalid token");
  }
};