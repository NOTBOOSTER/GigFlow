import mongoose from "mongoose";
import { MONGO_URI } from "../utils/envLoader.js";
import Logger from "../utils/logger.js";

const logger = new Logger(" Database ");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        appName: "GigFlow"
    });
    logger.success(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
