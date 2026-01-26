import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Card",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
  },
  voiceUri: {
    type: String,
  },
});

export default mongoose.model("Quiz", quizSchema);
