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
            category: "Sedan",
            year: 2023,
            price: 1800000,
            mileage: 12000,
            quantity: 5,
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
                category: "Sedan",
                year: 2023,
                price: 1800000,
                mileage: 12000,
                quantity: 5,
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

    test("should reject unauthenticated user when deleting vehicle", async () => {

        const response = await request(app)
            .delete("/api/vehicles/507f191e810c19729de860ea");

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("Authorization token required");

    });

    test("should reject salesperson from deleting vehicle", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "salesperson"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .delete("/api/vehicles/507f191e810c19729de860ea")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);

        expect(response.body.message)
            .toBe("Access denied");

    });

    test("should reject invalid vehicle id during deletion", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "admin"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .delete("/api/vehicles/abc")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(400);

        expect(response.body.message)
            .toBe("Invalid vehicle ID");

    });

    test("should return 404 when deleting non-existing vehicle", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "admin"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .delete("/api/vehicles/507f191e810c19729de860ea")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Vehicle not found");

    });

    test("should delete vehicle successfully", async () => {

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
            .delete(`/api/vehicles/${vehicle._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Vehicle deleted successfully");

        const deletedVehicle = await Vehicle.findById(vehicle._id);

        expect(deletedVehicle).toBeNull();

    });

    test("should return 500 when database deletion fails", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "admin"
            },
            process.env.JWT_SECRET
        );

        jest.spyOn(Vehicle, "findByIdAndDelete")
            .mockRejectedValue(new Error("Database Error"));

        const response = await request(app)
            .delete("/api/vehicles/507f191e810c19729de860ea")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Database Error");

    });
    test("should return 500 when database deletion fails", async () => {

        const token = jwt.sign(
            {
                userId: "123",
                role: "admin"
            },
            process.env.JWT_SECRET
        );

        jest.spyOn(Vehicle, "findByIdAndDelete")
            .mockRejectedValue(new Error("Database Error"));

        const response = await request(app)
            .delete("/api/vehicles/507f191e810c19729de860ea")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Database Error");

    });

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
});