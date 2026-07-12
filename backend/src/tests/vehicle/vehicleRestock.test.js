const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../../app");
const Vehicle = require("../../models/Vehicle");

describe("Vehicle Restock", () => {
    test("should reject unauthenticated user when restocking vehicle", async () => {

        const response = await request(app)
            .post("/api/vehicles/507f191e810c19729de860ea/restock");

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("Authorization token required");

    });

    test("should reject salesperson from restocking vehicle", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "salesperson"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .post("/api/vehicles/507f191e810c19729de860ea/restock")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);

        expect(response.body.message)
            .toBe("Access denied");

    });

    test("should restock vehicle successfully", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "admin"
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
            .post(`/api/vehicles/${vehicle._id}/restock`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Vehicle restocked successfully");

        expect(response.body.vehicle.quantity)
            .toBe(1);

        expect(response.body.vehicle.status)
            .toBe("Available");

    });


    test("should return 404 when restocking non-existing vehicle", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "admin"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .post("/api/vehicles/507f191e810c19729de860ea/restock")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Vehicle not found");

    });

    test("should reject invalid vehicle id during restock", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "admin"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .post("/api/vehicles/abc/restock")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(400);

        expect(response.body.message)
            .toBe("Invalid vehicle ID");

    });

    test("should return 500 when restocking vehicle fails", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "admin"
            },
            process.env.JWT_SECRET
        );

        jest.spyOn(Vehicle, "findById")
            .mockRejectedValue(new Error("Database Error"));

        const response = await request(app)
            .post("/api/vehicles/507f191e810c19729de860eb/restock")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Database Error");

    });
})