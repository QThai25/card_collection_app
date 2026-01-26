import User from "../models/User.js";
import { generateAndSendOTP } from "../helpers/otpHelper.js";

// GỬI OTP LẦN ĐẦU
export const sendOTP = async (req, res) => {
  try {
    const { email, userId } = req.body;

    await generateAndSendOTP(userId, email);

    res.status(200).json({ message: "OTP đã được gửi!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi gửi OTP" });
  }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    const otp = await OTP.findOne({ email, otpCode, verified: false });
    if (!otp) {
      return res.status(400).json({ message: "OTP không hợp lệ!" });
    }

    if (otp.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP đã hết hạn!" });
    }

    otp.verified = true;
    await otp.save();

    await User.findOneAndUpdate({ email }, { isActive: true });

    res.status(200).json({ message: "Xác thực email thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server OTP" });
  }
};

// GỬI LẠI OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại!" });
    }

    await generateAndSendOTP(user._id, email);

    res.status(200).json({ message: "Đã gửi lại OTP!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi resend OTP" });
  }
};
