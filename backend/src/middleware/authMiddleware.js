const jwt = require("jsonwebtoken");

/**
 * Authentication middleware that intercepts incoming requests to verify JWT authorization.
 * Parses the "Authorization: Bearer <token>" header, checks signature authenticity using the
 * configured JWT_SECRET, and binds the token payload (userId, role) to the request object.
 */
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Reject requests with missing authorization headers to protect endpoints
    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization token required"
        });
    }

    // Enforce standard Bearer token scheme format
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Invalid authorization format"
        });
    }

    // Extract the raw token string after "Bearer "
    const token = authHeader.split(" ")[1];

    try {
        // Verify token authenticity and expiration using the shared JWT secret
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Bind the verified user claims (e.g. userId, role) to req.user for downstream middleware/controllers
        req.user = decoded;
        next();
    } catch (error) {
        // Return 401 for expired, modified, or structurally invalid tokens
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateUser;