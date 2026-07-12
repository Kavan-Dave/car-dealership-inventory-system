/**
 * Role authorization middleware factory (closure).
 * Generates an Express middleware handler that checks if the authenticated user's role
 * (attached to req.user by authMiddleware) is listed within the allowed parameters.
 * Returns 403 (Forbidden) if the user is authenticated but lacks required permissions.
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user is guaranteed to exist as this middleware is run post authenticateUser
        if (!allowedRoles.includes(req.user.role)) {
            // Return 403 Forbidden instead of 401 Unauthorized because the identity is known,
            // but the identity does not possess the access privileges required for this resource.
            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();
    };
};

module.exports = authorizeRoles;