const jwt = require("jsonwebtoken");
const authenticateUser = require("../middleware/authMiddleware");

describe("JWT Authentication Middleware", () => {

    let req;
    let res;
    let next;

    beforeEach(() => {

        req = {
            headers: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();

    });

    test("should reject request when authorization header is missing", () => {

        authenticateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            message: "Authorization token required"
        });

        expect(next).not.toHaveBeenCalled();

    });

    test("should reject request when authorization format is invalid", () => {

        req.headers.authorization = "Token abc123";

        authenticateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid authorization format"
        });

        expect(next).not.toHaveBeenCalled();

    });

    test("should reject request when token is invalid", () => {

        req.headers.authorization = "Bearer invalidtoken";

        authenticateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid or expired token"
        });

        expect(next).not.toHaveBeenCalled();

    });

    test("should allow request with valid token", () => {

        const token = jwt.sign(
            {
                userId: "12345"
            },
            process.env.JWT_SECRET
        );

        req.headers.authorization = `Bearer ${token}`;

        authenticateUser(req, res, next);

        expect(req.user.userId).toBe("12345");

        expect(next).toHaveBeenCalled();

    });

});