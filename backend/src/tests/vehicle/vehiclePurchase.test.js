const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../../app");
const Vehicle = require("../../models/Vehicle");

describe("Vehicle Purchase", () => {
    test("should reject unauthenticated user when purchasing vehicle", async () => {

        const response = await request(app)
            .post("/api/vehicles/507f191e810c19729de860ea/purchase");

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("Authorization token required");

    });
    
    test("should purchase vehicle successfully", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "salesperson"
            },
            process.env.JWT_SECRET
        );

        const vehicle = await Vehicle.create({
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
            .post(`/api/vehicles/${vehicle._id}/purchase`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Vehicle purchased successfully");

        expect(response.body.vehicle.quantity)
            .toBe(4);

    });

    test("should return 400 when vehicle is out of stock", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "salesperson"
            },
            process.env.JWT_SECRET
        );

        const vehicle = await Vehicle.create({
            make: "Toyota",
            model: "Camry",
            category: "Sedan",
            year: 2023,
            price: 1800000,
            mileage: 12000,
            quantity: 0,
            status: "Sold",
            color: "White",
            fuelType: "Petrol",
            transmission: "Automatic"
        });

        const response = await request(app)
            .post(`/api/vehicles/${vehicle._id}/purchase`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(400);

        expect(response.body.message)
            .toBe("Vehicle is out of stock");

    });

    test("should return 404 when purchasing non-existing vehicle", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "salesperson"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .post("/api/vehicles/507f191e810c19729de860ea/purchase")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Vehicle not found");

    });

    test("should reject invalid vehicle id during purchase", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "salesperson"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .post("/api/vehicles/abc/purchase")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(400);

        expect(response.body.message)
            .toBe("Invalid vehicle ID");

    });

    test("should return 500 when purchase fails", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "salesperson"
            },
            process.env.JWT_SECRET
        );

        jest.spyOn(Vehicle, "findById")
            .mockRejectedValue(new Error("Database Error"));

        const response = await request(app)
            .post("/api/vehicles/507f191e810c19729de860eb/purchase")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Database Error");

    });
})