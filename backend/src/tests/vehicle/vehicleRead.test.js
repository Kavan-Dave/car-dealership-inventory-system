const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../../app");
const Vehicle = require("../../models/Vehicle");

describe("Vehicle Creation", () => {
    test("should reject unauthenticated user when fetching vehicles", async () => {

        const response = await request(app)
            .get("/api/vehicles");

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("Authorization token required");

    });

    test("should return empty vehicle list", async () => {
    
            const token = jwt.sign(
                {
                    userId: "123",
                    role: "salesperson"
                },
                process.env.JWT_SECRET
            );
    
            const response = await request(app)
                .get("/api/vehicles")
                .set("Authorization", `Bearer ${token}`);
    
            expect(response.statusCode).toBe(200);
    
            expect(response.body.message)
                .toBe("Vehicles retrieved successfully");
    
            expect(response.body.vehicles).toEqual([]);
    
    });

    test("should return all vehicles", async () => {
    
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
                .get("/api/vehicles")
                .set("Authorization", `Bearer ${token}`);
    
            expect(response.statusCode).toBe(200);
    
            expect(response.body.vehicles.length).toBe(1);
    
            expect(response.body.vehicles[0].make)
                .toBe("Toyota");
    
    });

    test("should return 500 when fetching vehicles fails", async () => {

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
            .get("/api/vehicles")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Database Error");

    });

    test("should reject unauthenticated user when fetching vehicle by id", async () => {

        const response = await request(app)
            .get("/api/vehicles/123");

        expect(response.statusCode).toBe(401);

    });

    test("should return vehicle when valid id is provided", async () => {

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
            .get(`/api/vehicles/${vehicle._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.vehicle.make)
            .toBe("Toyota");

    });

    test("should return 404 when vehicle does not exist", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "salesperson"
            },
            process.env.JWT_SECRET
        );

        const fakeId = "507f191e810c19729de860ea";

        const response = await request(app)
            .get(`/api/vehicles/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Vehicle not found");

    });

    test("should reject invalid vehicle id", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "salesperson"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .get("/api/vehicles/abc")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(400);

        expect(response.body.message)
            .toBe("Invalid vehicle ID");

    });

    test("should return 500 when database query fails", async () => {

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
            .get("/api/vehicles/507f191e810c19729de860eb")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Database Error");

    });


})