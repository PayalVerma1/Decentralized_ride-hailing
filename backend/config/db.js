import mongoose from "mongoose";

/**
 * MongoDB connection using Mongoose.
 * Retries once on failure; exits process in production on failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ridechain",
    );
    console.log(
      `  ║  MongoDB     : ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`,
    );
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

export default connectDB;
