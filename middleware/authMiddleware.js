const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token)
    return res
      .status(401)
      .json({ message: "Unauthorized: Token not provided" });
  try {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Unauthorized: Invalid token" });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
          return res
            .status(401)
            .json({ message: "Unauthorized: User not found" });
        }
        if (user.role !== decoded.role) {
          return res
            .status(401)
            .json({ message: "Unauthorized: Insufficient permissions" });
        }
        req.user = user;
        next();
      },
    );
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  adminAuth: authenticateUser,
};
