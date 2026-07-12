const mongoose = require("mongoose");

/**
 * Establishes a connection to the MongoDB database using the URI provided in environment variables.
 * If the connection fails, the process is terminated immediately since the application cannot
 * function without its primary data store.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("Database Connection Failed");
        console.error(error.message);
        // Exit process with failure code (1) to prevent the server from running in an unhealthy state
        process.exit(1);
    }
};

module.exports = connectDB;