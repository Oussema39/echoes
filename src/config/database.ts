import mongoose from "mongoose";

const connectDb = async (): Promise<void> => {
  try {
    const connectionString = process.env.DB_CONNECTION_STRING as string;
    if (!connectionString) {
      throw new TypeError("'connectionString' must be of type string");
    }
    const dbName = process.env.DB_NAME as string;
    await mongoose.connect(connectionString, {
      dbName,
      maxPoolSize: 10,
    });
    console.log("DB connected successfully");
  } catch (error) {
    console.error(error);
  }
};

export default connectDb;
