const request = require("supertest");
const app = require("../../app");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

describe("User Login", () => {

    test("should login a user with valid credentials", async () => {
        const hashedPassword = await bcrypt.hash("Password123", 10);
        await User.create({
            name: "John Doe",
            email: "john@example.com",
            password: hashedPassword
        });
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "john@example.com",
                password: "Password123"
            });
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe("Login successful");
            expect(response.body.token).toBeDefined();
            expect(typeof response.body.token).toBe("string");
            const decoded = jwt.verify(
                response.body.token,
                process.env.JWT_SECRET
            );
        expect(decoded.role).toBe("salesperson");
        expect(decoded.userId).toBeDefined();
    });

    test("should reject login when email does not exist", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "unknown@test.com",
                password: "Password123"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("Invalid email or password");
    });

    test("should reject login when password is incorrect", async () => {
        const hashedPassword = await bcrypt.hash("Password123", 10);
        await User.create({
            name: "John Doe",
            email: "john@example.com",
            password: hashedPassword
        });
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "john@example.com",
                password: "123Password"
            });
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Invalid email or password");
    });

    test("should reject login when email is misssing", async () => {
        const hashedPassword = await bcrypt.hash("Password123", 10);
        await User.create({
            name: "John Doe",
            email: "john@example.com",
            password: hashedPassword
        });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                password: "Password123"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid email or password");

    });

    test("should reject login when password is misssing", async () => {
        const hashedPassword = await bcrypt.hash("Password123", 10);
        await User.create({
            name: "John Doe",
            email: "john@example.com",
            password: hashedPassword
        });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "john@example.com"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid email or password");

    });

    test("Should reject invalid email format", async () => {

        const hashedPassword = await bcrypt.hash("Password123", 10);
        await User.create({
            name: "John Doe",
            email: "john@example.com",
            password: hashedPassword
        });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "john.com",
                password: "Password123"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid email or password");
    });

    test("should return 500 when database query fails during login", async () => {

        const findOneSpy = jest
            .spyOn(User, "findOne")
            .mockRejectedValue(new Error("Database Error"));

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "john@example.com",
                password: "Password123"
            });

        expect(response.statusCode).toBe(500);
        expect(response.body.message ).toBe("Database Error");

        findOneSpy.mockRestore();
    });

});