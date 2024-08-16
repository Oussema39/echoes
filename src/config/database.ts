import mongoose from "mongoose";

export const connectDb = async (): Promise<void> => {
  try {
    const connectionString = process.env.DB_CONNECTION_STRING as string;
    const dbName = process.env.DB_NAME as string;
    await mongoose.connect(connectionString, {
      dbName,
    });
    console.log("DB connected successfully");
  } catch (error) {
    console.error(error);
  }
};
