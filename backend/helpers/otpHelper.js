import OTP from "../models/otpVerify.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const generateAndSendOTP = async (userId, email, subject, htmlTemplate) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await OTP.deleteMany({ email }); 

  await new OTP({
    userId,
    email,
    otpCode: code,
    expiresAt,
    verified: false,
  }).save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject || "Xác thực OTP",
    html: htmlTemplate
      ? htmlTemplate(code)
      : `<p>Mã OTP của bạn là <b>${code}</b>. Hết hạn sau 10 phút.</p>`,
  });
};
