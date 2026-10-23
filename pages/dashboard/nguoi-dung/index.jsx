import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import AdminLayout from "../../../components/layout/AdminLayout";

const PAGE_SIZE = 10;

const ROLE_BADGE = {
  admin: "bg-red-100 text-red-700",
  user: "bg-blue-100 text-blue-700",
};

export default function NguoiDungPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/users", {
        params: { page: currentPage, limit: PAGE_SIZE, search },
      });
      setUsers(res.data.users || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Lỗi tải người dùng:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    if (status === "authenticated") fetchUsers();
  }, [status, fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const itemStart = (currentPage - 1) * PAGE_SIZE + 1;
  const itemEnd = Math.min(currentPage * PAGE_SIZE, total);

  if (status === "loading") {
    return (
      <AdminLayout title="Quản lý người dùng">
        <p className="p-8">Đang xác thực...</p>
      </AdminLayout>
    );
  }
  if (!session || session.user.role !== "admin") {
    return (
      <AdminLayout title="Quản lý người dùng">
        <p className="p-8">Bạn không có quyền truy cập trang này.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Quản lý người dùng">
      <div className="p-6 bg-white dark:bg-slate-900 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý người dùng</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Tổng cộng <span className="font-semibold text-blue-600">{total}</span> người dùng trong hệ thống
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tìm kiếm
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearchInput(""); setSearch(""); setCurrentPage(1); }}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Xóa lọc
            </button>
          )}
        </form>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 dark:bg-gray-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Danh sách người dùng
            </h3>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-300">Đang tải...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <svg className="mx-auto w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Không tìm thấy người dùng nào
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    {["STT", "Người dùng", "Email", "SĐT", "Vai trò", "Xác thực", "Ngày tạo", "Chi tiết"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {users.map((user, i) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {itemStart + i}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{user.email}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{user.phone || <span className="text-gray-400 italic">—</span>}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_BADGE[user.role] || "bg-gray-100 text-gray-700"}`}>
                          {user.role === "admin" ? "Admin" : "Người dùng"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {user.emailVerified ? (
                          <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Đã xác thực
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-gray-400">Chưa xác thực</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị {itemStart}–{itemEnd} / {total} người dùng
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className="px-3.5 py-1.5 text-sm border border-gray-300 rounded-full disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center text-sm rounded-full border transition-colors ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-1.5 text-sm border border-gray-300 rounded-full disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                {selectedUser.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={selectedUser.image} alt={selectedUser.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_BADGE[selectedUser.role] || "bg-gray-100 text-gray-700"}`}>
                    {selectedUser.role === "admin" ? "Admin" : "Người dùng"}
                  </span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Email", value: selectedUser.email },
                  { label: "SĐT", value: selectedUser.phone || "Chưa cập nhật" },
                  { label: "Xác thực email", value: selectedUser.emailVerified ? "Đã xác thực" : "Chưa xác thực" },
                  { label: "Ngày tạo", value: selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString("vi-VN") : "—" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">{row.label}</span>
                    <span className="text-gray-900 dark:text-white text-right">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
