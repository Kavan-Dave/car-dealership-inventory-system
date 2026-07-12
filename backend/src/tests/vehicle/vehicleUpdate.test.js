const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../../app");
const Vehicle = require("../../models/Vehicle");

describe("Vehicle Update", () => {
    test("should update vehicle when valid fields is provided", async () => {

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
            quantity: 5,
            color: "White",
            fuelType: "Petrol",
            transmission: "Automatic"
        });

        const response = await request(app)
            .put(`/api/vehicles/${vehicle._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                make:"Toyota",
                model:"Camry",
                category:"Sedan",
                year:2023,
                price:2100000,
                mileage:12000,
                quantity:5,
                color:"Black",
                fuelType:"Petrol",
                transmission:"Automatic"
        });

        expect(response.statusCode).toBe(200);

        expect(response.body.vehicle.price)
            .toBe(2100000);

        expect(response.body.vehicle.color)
            .toBe("Black");

    });

    test("should reject salesperson from updating vehicle", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "salesperson"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .put("/api/vehicles/507f191e810c19729de860ea")
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(response.statusCode).toBe(403);

        expect(response.body.message)
            .toBe("Access denied");

    });

    test("should reject invalid vehicle id during update", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "admin"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
                .put("/api/vehicles/abc")
                .set("Authorization", `Bearer ${token}`)
                .send({
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

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid vehicle ID");

    });

    test("should return 404 when updating non-existing vehicle", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "admin"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .put("/api/vehicles/507f191e810c19729de860ea")
            .set("Authorization", `Bearer ${token}`)
            .send({
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

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Vehicle not found");

    });

    test("should return 500 when database update fails", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "admin"
            },
            process.env.JWT_SECRET
        );

        jest.spyOn(Vehicle, "findByIdAndUpdate")
            .mockRejectedValue(new Error("Database Error"));

        const response = await request(app)
            .put("/api/vehicles/507f191e810c19729de860eb")
            .set("Authorization", `Bearer ${token}`)
            .send({
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

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Database Error");

    });
})