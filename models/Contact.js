// models/Contact.js
import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Họ và tên là bắt buộc'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Email không hợp lệ'],
  },
  phone: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  },
  note: {
    type: String,
    trim: true,
  },
  source: {
    type: String,
    trim: true,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Kiểm tra nếu model đã được định nghĩa để tránh lỗi khi hot-reload trong dev
export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);