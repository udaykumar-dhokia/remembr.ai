import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

const connectDatabase = async () => {
  if (!MONGODB_URL) {
    console.log("🔴 Missing credentials to connect with database...");
    return;
  }
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("🟢 Database connected successfully...");
  } catch (error) {
    console.log("🔴 Failed to connect with database...");
  }
};

export default connectDatabase;
