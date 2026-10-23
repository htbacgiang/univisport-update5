import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import AdminLayout from "../../../components/layout/AdminLayout";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiPrinter,
  FiEdit,
  FiTrash2,
  FiEye,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiPackage,
  FiDollarSign,
  FiRefreshCw,
  FiLayers,
} from "react-icons/fi";
import UniformOrderFormModal from "../../../components/backend/uniform-orders/UniformOrderFormModal";
import UniformOrderDetailModal from "../../../components/backend/uniform-orders/UniformOrderDetailModal";

const STATUS_TABS = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "in_production", label: "Đang sản xuất" },
  { value: "completed", label: "Xưởng đã xong" },
  { value: "delivering", label: "Đang giao" },
  { value: "delivered", label: "Đã giao" },
  { value: "cancelled", label: "Đã hủy" },
];

const STATUS_BADGE = {
  pending: {
    label: "Chờ xác nhận",
    badge: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  in_production: {
    label: "Đang sản xuất",
    badge: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  completed: {
    label: "Xưởng đã xong",
    badge: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300",
    dot: "bg-purple-500",
  },
  delivering: {
    label: "Đang giao",
    badge: "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/40 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  delivered: {
    label: "Đã giao",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Đã hủy",
    badge: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

export default function UniformOrdersPage() {
  const { data: session } = useSession();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/uniform-orders", {
        params: {
          search: search || undefined,
          status: selectedStatus !== "all" ? selectedStatus : undefined,
        },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
      showToast("Lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [search, selectedStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  // Thống kê nhanh
  const totalCount = orders.length;
  const inProductionCount = orders.filter((o) => o.status === "in_production").length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const completedCount = orders.filter((o) => o.status === "completed" || o.status === "delivered").length;
  const totalGarments = orders.reduce((sum, o) => sum + (o.totalQuantity || 0), 0);

  const handleCreateNew = () => {
    setEditingOrder(null);
    setIsFormOpen(true);
  };

  const handleEdit = (order) => {
    setIsDetailOpen(false);
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const handleViewDetail = (order) => {
    setDetailOrder(order);
    setIsDetailOpen(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/admin/uniform-orders/${orderId}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId || o._id === orderId ? { ...o, status: newStatus } : o))
      );
      if (detailOrder && (detailOrder.id === orderId || detailOrder._id === orderId)) {
        setDetailOrder((prev) => ({ ...prev, status: newStatus }));
      }
      showToast("Đã cập nhật trạng thái đơn hàng");
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi đổi trạng thái đơn hàng");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingOrder) return;
    try {
      const id = deletingOrder.id || deletingOrder._id;
      await axios.delete(`/api/admin/uniform-orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id && o._id !== id));
      if (detailOrder && (detailOrder.id === id || detailOrder._id === id)) {
        setIsDetailOpen(false);
      }
      showToast("Đã xóa đơn hàng thành công");
      setDeletingOrder(null);
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi xóa đơn hàng");
    }
  };

  return (
    <AdminLayout title="Quản lý đơn hàng may đồng phục">
      <div className="p-4 sm:p-6 bg-[#f8fafc] dark:bg-gray-950 min-h-screen space-y-5">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-xl bg-gray-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
            <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            {toastMessage}
          </div>
        )}

        {/* ── HEADER & ACTIONS ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#105d97] uppercase tracking-wider mb-1">
              <FiLayers className="w-4 h-4" />
              <span>Đồng phục Univi • Xưởng sản xuất</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Quản lý đơn may đồng phục
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Tạo và theo dõi đơn hàng đặt qua các kênh (Zalo, Fanpage, Hotline...) theo mẫu biên bản sản xuất
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchOrders}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 hover:text-[#105d97] hover:border-[#105d97] transition-all"
              title="Tải lại danh sách"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#105d97]" : ""}`} />
            </button>

            <button
              onClick={handleCreateNew}
              className="px-4 py-2.5 rounded-xl bg-[#0e568f] hover:bg-[#0c4a7c] text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <FiPlus className="w-4 h-4 stroke-[3]" />
              <span>Tạo đơn đồng phục mới</span>
            </button>
          </div>
        </div>

        {/* ── KPI METRICS SUMMARY CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#0e568f]">
              <FiLayers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase">Tổng đơn</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">{totalCount}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
              <FiClock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase">Chờ xử lý</p>
              <p className="text-lg font-black text-amber-600">{pendingCount}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600">
              <FiPackage className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase">Đang sản xuất</p>
              <p className="text-lg font-black text-sky-600">{inProductionCount}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <FiCheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase">Đã hoàn tất</p>
              <p className="text-lg font-black text-emerald-600">{completedCount}</p>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
              <span className="font-black text-base">SL</span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase">Tổng số áo</p>
              <p className="text-lg font-black text-red-600">{totalGarments} áo</p>
            </div>
          </div>
        </div>

        {/* ── FILTER & SEARCH BAR ── */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo mã đơn, tên khách, SĐT, mã thiết kế..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-[#0e568f] outline-none transition-all"
              />
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {STATUS_TABS.map((tab) => {
                const isActive = selectedStatus === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setSelectedStatus(tab.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#0e568f] text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── ORDERS LIST TABLE ── */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          {loading && orders.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">
              <div className="w-8 h-8 border-2 border-[#0e568f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Đang tải danh sách đơn hàng...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-sky-50 dark:bg-sky-950/50 text-[#0e568f] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FiPackage className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                Chưa có đơn may đồng phục nào
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                Bấm nút &quot;Tạo đơn đồng phục mới&quot; để lên biên bản sản xuất và theo dõi tiến độ may cho khách hàng.
              </p>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-[#0e568f] hover:bg-[#0c4a7c] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                + Tạo đơn đầu tiên
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Mã đơn & Biên bản</th>
                    <th className="py-3.5 px-4">Khách hàng</th>
                    <th className="py-3.5 px-4">Mockup áo</th>
                    <th className="py-3.5 px-4">Mã thiết kế</th>
                    <th className="py-3.5 px-4 text-center">Số lượng</th>
                    <th className="py-3.5 px-4">Hạn giao</th>
                    <th className="py-3.5 px-4">Tài chính</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {orders.map((o) => {
                    const statusInfo = STATUS_BADGE[o.status] || STATUS_BADGE.pending;
                    const mockup = o.mockupFull || o.mockupFront || o.mockupBack;
                    const id = o.id || o._id;

                    return (
                      <tr
                        key={id}
                        className="hover:bg-sky-50/40 dark:hover:bg-gray-800/40 transition-colors"
                      >
                        {/* 1. Mã đơn & Ngày */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleViewDetail(o)}
                            className="font-mono font-bold text-xs text-[#0e568f] hover:underline block text-left"
                          >
                            #{o.orderCode}
                          </button>
                          <span className="text-[11px] text-red-600 font-semibold block mt-0.5">
                            {o.reportDate ? `Biên bản: ${o.reportDate}` : o.orderDate}
                          </span>
                        </td>

                        {/* 2. Khách hàng */}
                        <td className="py-3 px-4">
                          <p className="font-bold text-gray-900 dark:text-gray-100 text-xs">
                            {o.customerName}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                            {o.customerPhone && <span>{o.customerPhone}</span>}
                            {o.channel && (
                              <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.2 rounded text-[10px] font-semibold text-sky-700">
                                {o.channel}
                              </span>
                            )}
                            {o.customerFacebook && (
                              <a
                                href={o.customerFacebook.startsWith("http") ? o.customerFacebook : `https://${o.customerFacebook}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline font-bold text-[10px] bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800 inline-flex items-center gap-0.5"
                                title={`Facebook: ${o.customerFacebook}`}
                              >
                                FB ↗
                              </a>
                            )}
                            {o.customerWebsite && (
                              <a
                                href={o.customerWebsite.startsWith("http") ? o.customerWebsite : `https://${o.customerWebsite}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold text-[10px] bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-0.5"
                                title={`Website: ${o.customerWebsite}`}
                              >
                                Web ↗
                              </a>
                            )}
                          </div>
                        </td>

                        {/* 3. Mockup Thumbnail */}
                        <td className="py-3 px-4">
                          {mockup ? (
                            <button
                              onClick={() => handleViewDetail(o)}
                              className="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white p-0.5 hover:scale-110 transition-transform overflow-hidden block"
                              title="Xem ảnh chi tiết"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={mockup}
                                alt="Mockup"
                                className="w-full h-full object-contain"
                              />
                            </button>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400">
                              Chưa có
                            </div>
                          )}
                        </td>

                        {/* 4. Mã thiết kế & Chi tiết */}
                        <td className="py-3 px-4 max-w-[200px]">
                          {Array.isArray(o.designCodes) && o.designCodes.length > 0 ? (
                            <div className="space-y-0.5">
                              {o.designCodes.slice(0, 2).map((dc, i) => (
                                <p
                                  key={i}
                                  className="font-mono font-bold text-[11px] text-gray-800 dark:text-gray-200 truncate"
                                  title={dc}
                                >
                                  {dc}
                                </p>
                              ))}
                              {o.designCodes.length > 2 && (
                                <span className="text-[10px] text-gray-400">
                                  +{o.designCodes.length - 2} mã khác
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic text-[11px]">—</span>
                          )}
                          {Array.isArray(o.sewingDetails) && o.sewingDetails.length > 0 && (
                            <p className="text-[11px] text-rose-600 italic font-semibold truncate mt-1">
                              • {o.sewingDetails[0]}
                            </p>
                          )}
                        </td>

                        {/* 5. Số lượng */}
                        <td className="py-3 px-4 text-center">
                          <span className="text-base font-black text-red-600 block leading-tight">
                            {o.totalQuantity || 0}
                          </span>
                          <span className="text-[10px] font-semibold text-gray-400">
                            (Nam {o.totalMen || 0} / Nữ {o.totalWomen || 0})
                          </span>
                        </td>

                        {/* 6. Hạn giao */}
                        <td className="py-3 px-4">
                          <div className="text-[11px]">
                            {o.deliveryDate ? (
                              <span className="font-bold text-sky-700 block">
                                Trả: {o.deliveryDate}
                              </span>
                            ) : (
                              <span className="text-gray-400">Chưa hẹn</span>
                            )}
                            {o.completionDate && (
                              <span className="text-[10px] text-gray-500 block">
                                Xong: {o.completionDate}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 7. Tài chính */}
                        <td className="py-3 px-4">
                          {o.totalAmount > 0 ? (
                            <div>
                              <span className="font-bold text-gray-900 dark:text-white block">
                                {o.totalAmount?.toLocaleString("vi-VN")} đ
                              </span>
                              {o.deposit > 0 && (
                                <span className="text-[10px] text-emerald-600 block">
                                  Cọc: {o.deposit?.toLocaleString("vi-VN")} đ
                                </span>
                              )}
                              {o.remaining > 0 && (
                                <span className="text-[10px] text-red-500 font-semibold block">
                                  Còn: {o.remaining?.toLocaleString("vi-VN")} đ
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* 8. Trạng thái */}
                        <td className="py-3 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(id, e.target.value)}
                            className={`text-[11px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ${statusInfo.badge}`}
                          >
                            <option value="pending">Chờ xác nhận</option>
                            <option value="in_production">Đang sản xuất</option>
                            <option value="completed">Xưởng đã xong</option>
                            <option value="delivering">Đang giao</option>
                            <option value="delivered">Đã giao</option>
                            <option value="cancelled">Đã hủy</option>
                          </select>
                        </td>

                        {/* 9. Thao tác */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Nút Xem / In */}
                            <button
                              onClick={() => handleViewDetail(o)}
                              className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0e568f] transition-colors"
                              title="Xem biên bản & In A4"
                            >
                              <FiPrinter className="w-4 h-4" />
                            </button>

                            {/* Nút Sửa */}
                            <button
                              onClick={() => handleEdit(o)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors"
                              title="Chỉnh sửa đơn"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>

                            {/* Nút Xóa */}
                            <button
                              onClick={() => setDeletingOrder(o)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              title="Xóa đơn hàng"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── MODAL TẠO MỚI / CHỈNH SỬA ── */}
        <UniformOrderFormModal
          isOpen={isFormOpen}
          initialData={editingOrder}
          onClose={() => setIsFormOpen(false)}
          onSaved={(savedOrder) => {
            fetchOrders();
            showToast(editingOrder ? "Đã cập nhật đơn hàng!" : "Đã tạo đơn hàng mới!");
          }}
        />

        {/* ── MODAL CHI TIẾT & IN BIÊN BẢN ── */}
        <UniformOrderDetailModal
          isOpen={isDetailOpen}
          order={detailOrder}
          onClose={() => setIsDetailOpen(false)}
          onEdit={(ord) => handleEdit(ord)}
          onDelete={(ord) => setDeletingOrder(ord)}
          onStatusChange={handleStatusChange}
        />

        {/* ── POPUP XÁC NHẬN XÓA ── */}
        {deletingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiTrash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                Xác nhận xóa đơn hàng
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Bạn có chắc chắn muốn xóa đơn hàng{" "}
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  #{deletingOrder.orderCode}
                </span>{" "}
                của <span className="font-semibold">{deletingOrder.customerName}</span>?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeletingOrder(null)}
                  className="flex-1 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                >
                  Xóa vĩnh viễn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
