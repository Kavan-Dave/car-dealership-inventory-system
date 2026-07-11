const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
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
        // console.log(response.body);
        expect(response.statusCode).toBe(409);
        expect(response.body.message).toBe("Email already exists");

    });

    test("should reject registration when name is missing", async () => {

        const user = {
            email: "kaviraj@test.com",
            password: "123456"
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(user);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("All fields are required");

    });

    test("should reject registration when email is missing", async () => {

        const user = {
            name: "kaviraj",
            password: "123456"
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(user);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("All fields are required");

    });

    test("should reject registration when password is missing", async () => {

        const user = {
            name : "Kaviraj",
            email: "kaviraj@test.com"
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(user);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("All fields are required");

    });

    test("should store password in hashed format", async () => {

        const user = {
            name: "Kaviraj",
            email: "kaviraj@test.com",
            password: "123456"
        };

        await request(app)
            .post("/api/auth/register")
            .send(user);

        const savedUser = await User.findOne({
            email: user.email
        });

        expect(savedUser.password).not.toBe(user.password);

        const isMatch = await bcrypt.compare(
            user.password,
            savedUser.password
        );

        expect(isMatch).toBe(true);

    });

    test("Should reject invalid email format", async () => {

        const user = {
            name: "Kaviraj",
            email: "kaviraj@test",
            password: "123456"
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(user);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid email format");
    });

});