import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "card-collection-app",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

router.post("/upload-image", upload.single("image"), (req, res) => {
  console.log("📂 File nhận được:", req.file);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "Upload thành công!",
    imageUrl: req.file.path || req.file.secure_url,
  });
});

export default router;
