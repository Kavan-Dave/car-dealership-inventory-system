const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existingAdmin = await User.findOne({ email: "admin@dealership.com" });
    if (existingAdmin) {
      console.log("Admin already exists. Skipping.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      email: "admin@dealership.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin seeded successfully!");
    console.log("Email:    admin@dealership.com");
    console.log("Password: admin123");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedAdmin();
