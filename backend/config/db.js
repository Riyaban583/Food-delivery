import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/food-del");
    console.log("Local MongoDB Connected");
  } catch (error) {
    console.log("DB Error:", error.message);
  }
};
