import mongoose from "mongoose";
import { env } from "./env";

export class Database {
  public async connect(): Promise<void> {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected");
  }
}

