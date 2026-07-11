require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");

beforeAll(async () => {
    await connectDB();
});

beforeEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterEach(() => {
    jest.restoreAllMocks();
});

afterAll(async () => {
    await mongoose.connection.close();
});