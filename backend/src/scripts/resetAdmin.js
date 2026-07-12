const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "admin@dealership.com";
    const plainPassword = "admin123";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const adminUser = await User.findOne({ email });

    if (adminUser) {
      adminUser.password = hashedPassword;
      await adminUser.save();
      console.log("Admin password reset successfully!");
    } else {
      await User.create({
        name: "Admin",
        email: email,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin account created successfully!");
    }

    console.log(`Email:    ${email}`);
    console.log(`Password: ${plainPassword}`);
    process.exit(0);
  } catch (error) {
    console.error("Reset failed:", error);
    process.exit(1);
  }
};

resetAdmin();
