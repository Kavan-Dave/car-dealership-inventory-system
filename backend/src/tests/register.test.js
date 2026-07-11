const request = require("supertest");
const app = require("../app");

describe("User Registration", () => {

    test("should register a new user with valid details", async () => {

        const user = {
            name: "Kaviraj",
            email: "kaviraj@test.com",
            password: "123456"
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(user);

        expect(response.body.message).toBe("User registered successfully");

    });

});