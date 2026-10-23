'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import OrderDetailsPopup from "./OrderDetailsPopup";
import { paymentMethodText, orderStatusText, orderStatusColors } from "../../utils/mappings";

function formatCurrency(amount) {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const [ordersByDate, setOrdersByDate] = useState({});
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (status === "authenticated") fetchOrders();
  }, [status]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/orders");
      const sortedOrders = (res.data.orders || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const groupedOrdersByDate = {};
      const datesArray = [];

      sortedOrders.forEach(order => {
        const dateKey = new Date(order.createdAt).toLocaleDateString("vi-VN");
        if (!groupedOrdersByDate[dateKey]) {
          groupedOrdersByDate[dateKey] = [];
          datesArray.push(dateKey);
        }
        groupedOrdersByDate[dateKey].push(order);
      });

      setOrdersByDate(groupedOrdersByDate);
      setDates(datesArray);
    } catch (error) {
      console.error("Lỗi khi tải orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentOrders = ordersByDate[dates[currentPage - 1]] || [];
  const totalPages = dates.length;

  const totalOrders = currentOrders.length;
  const cancelledOrders = currentOrders.filter(o => o.status === "cancelled").length;
  const totalRevenue = currentOrders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.finalTotal, 0);

  if (status === "loading") return <p className="p-8">Đang xác thực...</p>;
  if (!session) return <p className="p-8">Bạn cần đăng nhập.</p>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-2">Đơn hàng ngày {dates[currentPage - 1]}</h2>
      <div className="mb-4 text-sm">
        <p>Tổng đơn hàng: <strong>{totalOrders}</strong></p>
        <p>Số đơn hàng đã hủy: <strong>{cancelledOrders}</strong></p>
        <p>Tổng doanh thu: <strong>{formatCurrency(totalRevenue)}</strong></p>
      </div>

      {loading && <p>Đang tải đơn hàng...</p>}
      {!loading && currentOrders.length === 0 && <p>Chưa có đơn hàng nào trong ngày này.</p>}

      {!loading && currentOrders.length > 0 && (
        <>
          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-2 py-3">STT</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Giờ đặt</th>
                <th className="px-4 py-3">Tổng thanh toán</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order, index) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-2 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-semibold">{order.name}</td>
                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleTimeString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(order.finalTotal)}
                  </td>
                  <td className={`px-4 py-3 ${orderStatusColors[order.status]}`}>
                      {orderStatusText[order.status]}
                    </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center items-center space-x-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3.5 py-1 text-sm border rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors">Lùi</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-9 h-9 flex items-center justify-center text-sm font-medium border rounded-full hover:bg-gray-100 transition-colors ${currentPage === i + 1 ? "bg-[#105d97] text-white border-[#105d97]" : "border-gray-300 text-gray-700"}`}>{i + 1}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-3.5 py-1 text-sm border rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors">Tiếp</button>
          </div>
        </>
      )}

      {selectedOrder && (
        <OrderDetailsPopup order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
