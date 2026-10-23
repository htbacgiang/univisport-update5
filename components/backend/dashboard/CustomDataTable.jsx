"use client";
import React, { useState, useEffect } from "react";
import { Users2, Trash2, ChevronLeft, ChevronRight, Phone, Clock, AlertTriangle, MapPin } from "lucide-react";

export default function CustomDataTable() {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    async function fetchContacts() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/contact?page=${currentPage}&limit=${PAGE_SIZE}`);
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          setTotal(result.total ?? result.data.length);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Không thể tải danh sách khách hàng");
        console.error("Lỗi khi gọi API:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      const result = await response.json();
      if (result.success) {
        // Nếu xóa bản ghi cuối của trang hiện tại → lùi về trang trước
        const newTotal = total - 1;
        const maxPage = Math.ceil(newTotal / PAGE_SIZE) || 1;
        setTotal(newTotal);
        if (currentPage > maxPage) {
          setCurrentPage(maxPage); // useEffect sẽ tự fetch lại
        } else {
          setData((prev) => prev.filter((item) => item._id !== id));
        }
        setShowConfirm(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Không thể xóa thông tin");
      console.error("Lỗi khi xóa:", err);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const itemStart = total === 0 ? 0 : startIndex + 1;
  const itemEnd = Math.min(startIndex + PAGE_SIZE, total);

  const formatDate = (val) => {
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "—";
    }
  };

  return (
    <>
      <div className="bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#f1f5f9]">
          <Users2 className="w-4 h-4 text-[#105d97] shrink-0" />
          <h3 className="text-sm font-bold uppercase tracking-[0.04em] text-[#105d97] m-0">
            Danh sách liên hệ
          </h3>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2.5 py-12 text-[#64748b] text-sm">
            <div className="w-5 h-5 border-2 border-[#105d97] border-t-transparent rounded-full animate-spin" />
            Đang tải dữ liệu...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center gap-2 mx-5 my-4 px-4 py-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg text-[#dc2626] text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f1f5f9] text-left">
                    <th className="px-5 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wider w-12">STT</th>
                    <th className="px-5 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wider">Khách hàng</th>
                    <th className="px-5 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wider">SĐT</th>
                    <th className="px-5 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wider">Tin nhắn</th>
                    <th className="px-5 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wider">Trang</th>
                    <th className="px-5 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wider">Thời gian</th>
                    <th className="px-5 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wider text-center w-20">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-sm text-[#94a3b8]">
                        Chưa có liên hệ nào
                      </td>
                    </tr>
                  ) : (
                    data.map((item, i) => (
                      <tr key={item._id} className="hover:bg-[#f8fafc] transition-colors duration-100">
                        <td className="px-5 py-3.5 text-sm text-[#64748b]">{startIndex + i + 1}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#105d97]/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-[#105d97]">
                                {item.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-[#0f172a]">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-sm text-[#374151]">
                            <Phone className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                            {item.phone}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 max-w-[220px]">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-[#374151] truncate block" title={item.message || ""}>
                              {item.message || <span className="text-[#94a3b8]">Không có</span>}
                            </span>
                            {item.note && (
                              <span className="text-xs text-[#64748b] truncate block" title={item.note}>
                                📌 {item.note}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 max-w-[220px]">
                          {item.source ? (
                            <div className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#105d97] shrink-0 mt-0.5" />
                              <span className="text-sm text-[#105d97] font-medium truncate block" title={item.source}>
                                {item.source}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#94a3b8] text-sm">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-sm text-[#64748b]">
                            <Clock className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                            {formatDate(item.createdAt)}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <button
                            onClick={() => confirmDelete(item._id)}
                            className="inline-flex items-center justify-center w-8 h-8 bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] rounded-lg hover:bg-[#fee2e2] hover:border-[#fca5a5] transition-colors duration-150"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > 0 && (
              <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3.5 border-t border-[#f1f5f9] bg-[#f8fafc]">
                <span className="text-sm text-[#64748b]">
                  Hiển thị{" "}
                  <span className="font-semibold text-[#0f172a]">{itemStart}–{itemEnd}</span>
                  {" "}trong{" "}
                  <span className="font-semibold text-[#0f172a]">{total}</span>
                  {" "}liên hệ
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-9 h-9 text-sm font-medium text-[#374151] border border-[#d1d5db] rounded-full bg-white hover:bg-[#f3f4f6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Trang trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-full border transition-colors ${
                        currentPage === i + 1
                          ? "bg-[#105d97] text-white border-[#105d97]"
                          : "bg-white text-[#374151] border-[#d1d5db] hover:bg-[#f3f4f6]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-9 h-9 text-sm font-medium text-[#374151] border border-[#d1d5db] rounded-full bg-white hover:bg-[#f3f4f6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Trang tiếp"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-[#fef2f2] rounded-full mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-[#dc2626]" />
            </div>
            <h3 className="text-base font-bold text-[#0f172a] text-center mb-1.5">Xác nhận xóa</h3>
            <p className="text-sm text-[#64748b] text-center mb-5">
              Bạn có chắc muốn xóa liên hệ này? Hành động không thể hoàn tác.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-[#f9fafb] text-[#374151] border border-[#d1d5db] rounded-lg text-sm font-semibold hover:bg-[#f3f4f6] transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2.5 bg-[#dc2626] text-white rounded-lg text-sm font-semibold hover:bg-[#b91c1c] transition-colors"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
