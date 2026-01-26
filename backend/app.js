import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import cardRoutes from "./routes/cards.js";
import userCardRoutes from "./routes/userCards.js";
import uploadRoutes from "./routes/upload.js";
import quizRoutes from "./routes/quiz.js";
import otpRoutes from "./routes/otp.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/users", userCardRoutes);
app.use("/api", uploadRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/otp", otpRoutes);

export default app;
