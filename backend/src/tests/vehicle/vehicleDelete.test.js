const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../../app");
const Vehicle = require("../../models/Vehicle");
describe("Vehicle Deletion", () => {
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
})