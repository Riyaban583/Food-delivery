import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/food-del";
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected:", mongoUri);
  } catch (error) {
    console.log("DB Connection Error:", error.message);
  }
};
