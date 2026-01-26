import express from "express";
import { getQuizByCardId, createQuiz, getAllQuizByCardId } from "../controllers/quizController.js";


const router = express.Router();

router.get("/all/:cardId", getAllQuizByCardId);
router.get("/:cardId", getQuizByCardId);
router.post("/", createQuiz);

export default router;
