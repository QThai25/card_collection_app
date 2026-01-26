import UserCard from "../models/UserCard.js";
import Card from "../models/Card.js";
import mongoose from "mongoose";

export const getUserCards = async (req, res) => {
  try {
    const userCards = await UserCard.find({ userId: req.params.id }).populate(
      "cardId"
    );
    res.json(userCards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addUserCard = async (req, res) => {
  try {
    console.log("🧠 req.params.id:", req.params.id);
    console.log("📦 req.body:", req.body);

    const { cardId } = req.body;
    const userCard = new UserCard({
      userId: req.params.id,
      cardId,
      source: "admin_add",
    });
    const saved = await userCard.save();
    console.log("✅ Saved:", saved);

    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const scanCard = async (req, res) => {
  try {
    const { cardId, code } = req.body;

    if (!cardId && !code) {
      return res.json({
        success: false,
        message: "Thiếu dữ liệu. Gửi cardId hoặc code.",
      });
    }

    let card = null;
    if (cardId) {
      if (!mongoose.Types.ObjectId.isValid(cardId)) {
        return res.json({
          success: false,
          message: "cardId không hợp lệ.",
        });
      }
      card = await Card.findById(cardId);
    }
    if (!card && code) {
      card = await Card.findOne({ code });
    }

    if (!card) {
      return res.json({
        success: false,
        message: "Thẻ không tồn tại",
      });
    }

    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.json({
        success: false,
        message: "Yêu cầu xác thực",
      });
    }

    const existing = await UserCard.findOne({
      userId,
      cardId: card._id,
    });

    if (existing) {
      return res.json({
        success: false,
        message: "Bạn đã có thẻ này",
      });
    }

    const userCard = new UserCard({
      userId,
      cardId: card._id,
      source: cardId ? "scan_id" : "scan_code",
    });

    const saved = await userCard.save();

    return res.json({
      success: true,
      message: `Đã thêm thẻ "${card.title || card.name}" vào bộ sưu tập!`,
      card,
      userCard: saved,
    });
  } catch (err) {
    console.error("scanCard error:", err);
    return res.json({
      success: false,
      message: "Lỗi server",
    });
  }
};

