// components/OrderDetailsPopup.jsx
import React from "react";

export default function OrderDetailsPopup({ order, onClose }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md p-4 rounded-md shadow-lg">
        <h3 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h3>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item._id || item.id} className="flex items-center gap-4 border-b pb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                <p className="text-sm text-gray-600">
                  {Number(item.price).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
