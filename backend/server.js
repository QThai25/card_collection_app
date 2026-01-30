import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "Card_DB",
  })
  .then(() => {
    console.log("✅ MongoDB connected to:", mongoose.connection.name);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
