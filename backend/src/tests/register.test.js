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
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("User registered successfully");

    });

    test("Restrict user for registering with existing email", async () => {

        const user = {
            name: "Kaviraj",
            email: "kaviraj@test.com",
            password: "123456"
        };

        await request(app)
            .post("/api/auth/register")
            .send(user);

        const response = await request(app)
            .post("/api/auth/register")
            .send(user);
        console.log(response.body);
        expect(response.statusCode).toBe(409);
        expect(response.body.message).toBe("Email already exists");

    });

});