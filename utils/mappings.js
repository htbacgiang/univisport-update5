// utils/mappings.js
export const orderStatusText = {
  pending: "Đang chờ xử lý",
  paid: "Đã thanh toán",
  shipped: "Đang giao hàng",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

export const orderStatusColors = {
  pending: "text-yellow-500",     // Màu vàng cho đơn hàng đang chờ xử lý
  paid: "text-green-500",           // Màu xanh cho đơn hàng đã thanh toán
  shipped: "text-blue-500",         // Màu xanh dương cho đơn hàng đang giao
  delivered: "text-gray-500",       // Màu xám cho đơn hàng đã giao
  cancelled: "text-red-500",        // Màu đỏ cho đơn hàng đã hủy
};

export const paymentMethodText = {
  COD: "Thanh toán khi nhận hàng",
  BankTransfer: "Chuyển khoản ngân hàng",
  MoMo: "Thanh toán qua MoMo",
};
