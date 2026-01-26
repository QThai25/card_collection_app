import express from "express";
import { body } from "express-validator";
import * as cardController from "../controllers/cardController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", cardController.getCards); // Public
router.get("/:id", cardController.getCard); // Public

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  [
    body("code").notEmpty().withMessage("Mã là bắt buộc"),
    body("title").notEmpty().withMessage("Tiêu đề là bắt buộc"),
    body("description").notEmpty().withMessage("Mô tả là bắt buộc"),
    body("rarity").notEmpty().withMessage("Độ hiếm là bắt buộc"),
  ],
  cardController.createCard
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  [
    body("code").notEmpty().withMessage("Mã là bắt buộc"),
    body("title").notEmpty().withMessage("Tiêu đề là bắt buộc"),
    body("description").notEmpty().withMessage("Mô tả là bắt buộc"),
    body("rarity").notEmpty().withMessage("Độ hiếm là bắt buộc"),
  ],
  cardController.updateCard
);

router.delete("/:id", authMiddleware, adminMiddleware, cardController.deleteCard);

export default router;
