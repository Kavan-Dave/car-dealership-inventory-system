const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");

describe("Protected Profile Route", () => {

    test("should return profile for authenticated user", async () => {

        const token = jwt.sign(
            {
                userId: "12345"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .get("/api/auth/profile")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Profile retrieved successfully");

        expect(response.body.user.userId)
            .toBe("12345");

    });

    test("should reject request without token", async () => {

        const response = await request(app)
            .get("/api/auth/profile");

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("Authorization token required");

    });

    test("should reject request with invalid token", async () => {

        const response = await request(app)
            .get("/api/auth/profile")
            .set("Authorization", "Bearer invalidtoken");

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("Invalid or expired token");

    });

});