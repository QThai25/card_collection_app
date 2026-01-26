import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";

export const getQuizByCardId = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: "Invalid cardId" });
    }

    const objectId = new mongoose.Types.ObjectId(cardId);

    const quiz = await Quiz.findOne({ cardId: objectId });

    if (!quiz) {
      console.log("❌ Quiz not found for cardId:", objectId);
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (err) {
    console.error("⚠️ Error in getQuizByCardId:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllQuizByCardId = async (req, res) => {
  try {
    const { cardId } = req.params;

    // Kiểm tra cardId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: "Invalid cardId" });
    }

    const objectId = new mongoose.Types.ObjectId(cardId);

    // Tìm tất cả quiz có cardId trùng
    const quizzes = await Quiz.find({ cardId: objectId });

    console.log(`✅ Found ${quizzes.length} quizzes for cardId: ${objectId}`);

    // Trả luôn mảng quiz (có thể rỗng)
    res.status(200).json(quizzes);
  } catch (err) {
    console.error("⚠️ Error in getAllQuizByCardId:", err);
    res.status(500).json({ message: err.message });
  }
};


export const createQuiz = async (req, res) => {
  try {
    const { cardId, question, options, correctAnswer, explanation } = req.body;
    const newQuiz = new Quiz({ cardId, question, options, correctAnswer, explanation });
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
