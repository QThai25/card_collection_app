import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import cardRoutes from "./routes/cards.js";
import userCardRoutes from "./routes/userCards.js";
import uploadRoutes from "./routes/upload.js";
import quizRoutes from "./routes/quiz.js";
import otpRoutes from "./routes/otp.js";

const app = express();

/* ================== CORS ================== */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8081",
  "https://card-collection-app-tawny.vercel.app",
  "https://card-collection-app-wb6x-hrpt4jyku-qthai25s-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      // Local
      if (
        origin === "http://localhost:3000" ||
        origin === "http://localhost:8081"
      ) {
        return callback(null, true);
      }

      // ✅ ALL Vercel preview & production
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// ⚠️ BẮT BUỘC cho preflight
app.options("*", cors());

app.use(express.json());
/* ========================================== */

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running 🚀",
    time: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/users", userCardRoutes);
app.use("/api", uploadRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/otp", otpRoutes);

export default app;
