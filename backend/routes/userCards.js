// routes/userCards.js
import express from "express";
import * as userCardController from "../controllers/userCardController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// View user's collection — nên yêu cầu đăng nhập
router.get("/:id/cards", authMiddleware, userCardController.getUserCards);

// Add card to a user's collection (admin only)
router.post("/:id/cards", authMiddleware, adminMiddleware, userCardController.addUserCard);

// Scan QR (any authenticated user)
router.post("/scan", authMiddleware, userCardController.scanCard);

export default router;
