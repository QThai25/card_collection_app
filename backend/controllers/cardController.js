import Card from '../models/Card.js';
import { validationResult } from 'express-validator';

export const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card)
      return res.status(404).json({ message: 'Thẻ không tồn tại' });
    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const createCard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const card = new Card({ ...req.body, createdBy: req.user.id });
    await card.save();
    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updateCard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!card)
      return res.status(404).json({ message: 'Thẻ không tồn tại' });
    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card)
      return res.status(404).json({ message: 'Thẻ không tồn tại' });
    res.json({ message: 'Thẻ đã xóa' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
