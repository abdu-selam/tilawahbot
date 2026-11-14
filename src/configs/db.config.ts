import mongoose, { connect } from "mongoose";

let connectionPromise: Promise<typeof mongoose> | undefined;

async function connectDB(uri: string) {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose;
    }

    if (!connectionPromise) {
      connectionPromise = connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
    }

    return connectionPromise;
  } catch (error) {
    connectionPromise = undefined;
    throw error;
  }
}

export default connectDB;
