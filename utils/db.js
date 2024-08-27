import mongoose from "mongoose";

export const connectToDB = async () => {
  mongoose.connection.on("error", (error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
  });

  await mongoose.connect(process.env.DB_URI);
};
