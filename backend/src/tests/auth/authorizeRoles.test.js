const authorizeRoles = require("../../middleware/authorizeRoles");

describe("Authorization Middleware", () => {

    let req;
    let res;
    let next;

    beforeEach(() => {

        req = {
            user: {
                role: "salesperson"
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();

    });

    test("should allow access for authorized role", () => {

        authorizeRoles("salesperson")(req, res, next);

        expect(next).toHaveBeenCalled();

    });

    test("should deny access for unauthorized role", () => {

        authorizeRoles("admin")(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);

        expect(res.json).toHaveBeenCalledWith({
            message: "Access denied"
        });

        expect(next).not.toHaveBeenCalled();

    });

});