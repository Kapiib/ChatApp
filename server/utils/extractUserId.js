const jwt = require("jsonwebtoken");

const extractUserId = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.user_id;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  next();
};

module.exports = extractUserId;