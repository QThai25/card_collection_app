import express from "express";
import { body } from "express-validator";
import * as authController from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("password").isLength({ min: 6 }).withMessage("Mật khẩu phải ít nhất 6 ký tự"),
    body("name").notEmpty().withMessage("Tên là bắt buộc"),
  ],
  authController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("password").notEmpty().withMessage("Mật khẩu là bắt buộc"),
  ],
  authController.login
);

router.get("/me", authMiddleware, authController.getMe);

export default router;
