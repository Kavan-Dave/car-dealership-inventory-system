const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const Vehicle = require("../models/Vehicle");

describe("Vehicle Creation", () => {

    test("should reject unauthenticated user", async () => {

        const response = await request(app)
            .post("/api/vehicles")
            .send({});

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("Authorization token required");

    });

    test("should allow admin to create vehicle", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "admin"
            },
            process.env.JWT_SECRET
        );

        const vehicle = {
            make: "Toyota",
            model: "Camry",
            year: 2023,
            price: 1800000,
            mileage: 12000,
            color: "White",
            fuelType: "Petrol",
            transmission: "Automatic"
        };

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${token}`)
            .send(vehicle);

        expect(response.statusCode).toBe(201);

        expect(response.body.message)
            .toBe("Vehicle created successfully");

        expect(response.body.vehicle.make)
            .toBe("Toyota");

        const savedVehicle = await Vehicle.findOne({
            make: "Toyota"
        });

        expect(savedVehicle).not.toBeNull();

    });

    test("should return 500 when database insertion fails", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "admin"
            },
            process.env.JWT_SECRET
        );

        jest.spyOn(Vehicle, "create")
            .mockRejectedValue(new Error("Database Error"));

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${token}`)
            .send({
                make: "Toyota",
                model: "Camry",
                year: 2023,
                price: 1800000,
                mileage: 12000,
                color: "White",
                fuelType: "Petrol",
                transmission: "Automatic"
            });

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Database Error");

    });

    test("should reject invalid fuel type", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "admin"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${token}`)
            .send({
                make: "Toyota",
                model: "Camry",
                year: 2023,
                price: 1800000,
                mileage: 12000,
                color: "White",
                fuelType: "Water",
                transmission: "Automatic"
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.message)
            .toBe("Invalid fuel type");

    });

    test("should reject request with missing required fields", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "admin"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${token}`)
            .send({
                make: "Toyota"
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.message)
            .toBe("All vehicle fields are required");

    });
});