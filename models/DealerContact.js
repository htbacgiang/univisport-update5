import mongoose from 'mongoose';

const DealerContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Họ và tên là bắt buộc'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  province: {
    type: String,
    required: [true, 'Tỉnh/Thành phố là bắt buộc'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Hình thức hợp tác là bắt buộc'],
    trim: true,
  },
  channels: {
    type: [String],
    default: [],
  },
  volume: {
    type: String,
    trim: true,
  },
  products: {
    type: [String],
    default: [],
  },
  notes: {
    type: String,
    trim: true,
  },
  source: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['Chưa liên hệ', 'Đang tư vấn', 'Đã chốt', 'Hủy'],
    default: 'Chưa liên hệ',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.DealerContact || mongoose.model('DealerContact', DealerContactSchema);
