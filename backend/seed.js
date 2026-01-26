import mongoose from "mongoose";
import dotenv from "dotenv";
import Card from "./models/Card.js";
import connectDB from "./config/db.js";

dotenv.config();

const seedCards = [
  {
    code: "CARD-2025-0001",
    title: "Trần Hưng Đạo",
    description: "Anh hùng chống quân Nguyên",
    rarity: "Legendary",
    imageUrl: "https://example.com/tran-hung-dao.jpg",
  },
  {
    code: "CARD-2025-0002",
    title: "Hai Bà Trưng",
    description: "Nữ tướng khởi nghĩa",
    rarity: "Epic",
    imageUrl: "https://example.com/hai-ba-trung.jpg",
  },
  {
    code: "CARD-2025-0003",
    title: "Lý Thường Kiệt",
    description: "Danh tướng triều Lý",
    rarity: "Rare",
    imageUrl: "https://example.com/ly-thuong-kiet.jpg",
  },
  {
    code: "CARD-2025-0004",
    title: "Nguyễn Huệ",
    description: "Anh hùng áo vải",
    rarity: "Epic",
    imageUrl: "https://example.com/nguyen-hue.jpg",
  },
  {
    code: "CARD-2025-0005",
    title: "Lê Lợi",
    description: "Người khai sáng triều Lê",
    rarity: "Rare",
    imageUrl: "https://example.com/le-loi.jpg",
  },
];

const seedData = async () => {
  try {
    await connectDB();
    await Card.deleteMany();
    await Card.insertMany(seedCards);
    console.log("✅ Đã thêm 5 thẻ bài mẫu vào cơ sở dữ liệu!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Lỗi seed dữ liệu:", error);
    mongoose.connection.close();
  }
};

seedData();
