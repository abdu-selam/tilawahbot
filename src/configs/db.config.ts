import { connect } from "mongoose";
import env from "../utils/env.js";

const connectDb = async () => {
  try {
    await connect(env.mongo);
    console.log("Connected to mongodb")
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDb;
