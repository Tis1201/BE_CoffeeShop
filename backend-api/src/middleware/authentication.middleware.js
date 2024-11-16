const jwt = require("jsonwebtoken");
const knex = require("../config/database/knex"); // Or your database configuration

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const refreshToken = req.headers["x-refresh-token"]; // Get refreshToken from headers

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Access denied. No token provided.",
    });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    // Verify the accessToken
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = {
      customer_id: decoded.customer_id,
      full_name: decoded.full_name,
      email: decoded.email,
    };
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // Access token expired, check for valid refreshToken
      if (!refreshToken) {
        return res.status(403).json({
          status: "error",
          message: "Refresh token is required.",
        });
      }

      try {
        // Check if refreshToken exists in the database
        const user = await knex("customers")
          .where("refreshToken", refreshToken)
          .andWhere("refreshTokenExpires", ">", new Date())
          .first();

        if (!user) {
          return res.status(403).json({
            status: "error",
            message: "Invalid or expired refresh token.",
          });
        }

        // Generate a new accessToken
        const newAccessToken = jwt.sign(
          {
            customer_id: user.customer_id,
            full_name: user.full_name,
            email: user.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "15m" } // Set accessToken expiry
        );

        res.setHeader("x-access-token", newAccessToken); // Return the new access token
        req.user = {
          customer_id: user.customer_id,
          full_name: user.full_name,
          email: user.email,
        };
        return next();
      } catch (refreshError) {
        console.error("Error refreshing access token:", refreshError);
        return res.status(500).json({
          status: "error",
          message: "Could not refresh access token.",
        });
      }
    } else {
      // Other token errors
      return res.status(403).json({
        status: "error",
        message: "Invalid token.",
      });
    }
  }
};

module.exports = authMiddleware;
