import app from "../app.js";
import mongoose from "mongoose";

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB connected");
}


export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
