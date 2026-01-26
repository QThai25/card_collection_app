import mongoose from "mongoose";

const userCardSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true },
  source: { 
    type: String, 
    enum: ['admin_add', 'scan_code', 'scan_id'], // thêm 'scan_id' để phân biệt scan bằng ObjectId
    default: 'scan_code' 
  },
}, { timestamps: true });

const UserCard = mongoose.model("UserCard", userCardSchema);
export default UserCard;
