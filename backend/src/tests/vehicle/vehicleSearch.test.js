const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../../app");
const Vehicle = require("../../models/Vehicle");

describe("Vehicle Search", () => {
    test("should reject unauthenticated user when searching vehicles", async () => {

        const response = await request(app)
            .get("/api/vehicles/search");

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("Authorization token required");

    });

    test("should search vehicles by make", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "salesperson"
            },
            process.env.JWT_SECRET
        );

        await Vehicle.create({
            make: "Toyota",
            model: "Camry",
            category: "Sedan",
            year: 2023,
            price: 1800000,
            mileage: 12000,
            quantity: 5,
            color: "White",
            fuelType: "Petrol",
            transmission: "Automatic"
        });

        await Vehicle.create({
            make: "Honda",
            model: "City",
            category: "Sedan",
            year: 2023,
            price: 1500000,
            mileage: 10000,
            quantity: 5,
            color: "Black",
            fuelType: "Petrol",
            transmission: "Manual"
        });

        const response = await request(app)
            .get("/api/vehicles/search?make=Toyota")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.vehicles.length).toBe(1);

        expect(response.body.vehicles[0].make)
            .toBe("Toyota");

    });

    test("should return empty array when no vehicles match search", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "salesperson"
            },
            process.env.JWT_SECRET
        );

        await Vehicle.create({
            make: "Toyota",
            model: "Camry",
            category: "Sedan",
            year: 2023,
            price: 1800000,
            mileage: 12000,
            quantity: 5,
            color: "White",
            fuelType: "Petrol",
            transmission: "Automatic"
        });

        const response = await request(app)
            .get("/api/vehicles/search?make=BMW")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.vehicles).toEqual([]);

    });

    test("should return 500 when searching vehicles fails", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "salesperson"
            },
            process.env.JWT_SECRET
        );

        jest.spyOn(Vehicle, "find")
            .mockRejectedValue(new Error("Database Error"));

        const response = await request(app)
            .get("/api/vehicles/search")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Database Error");

    });
})