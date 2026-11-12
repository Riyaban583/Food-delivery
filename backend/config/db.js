import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/food-del";

  if (!process.env.MONGO_URI) {
    console.warn("⚠️ WARNING: MONGO_URI is not set in environment variables! Using default local URI.");
  }

  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB Connected Successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB Disconnected");
  });

  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error("DB Connection Initialization Error:", error.message);
  }
};
