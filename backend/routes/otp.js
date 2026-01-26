// routes/otp.routes.js
import { Router } from "express";
import { sendOTP, verifyOTP } from "../controllers/otpController.js";

const router = Router();

router.post("/send", sendOTP);        // gửi OTP
router.post("/verify", verifyOTP);    // xác thực OTP

export default router;
