import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  rarity: { type: String, required: true },
  attributes: { type: Object },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Card = mongoose.model("Card", cardSchema);
export default Card;
