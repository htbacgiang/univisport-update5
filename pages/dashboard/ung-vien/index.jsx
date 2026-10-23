import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import { toast } from 'react-hot-toast';

export default function ApplicationsDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recruitment/applications');
      const data = await response.json();
      if (data.success) {
        setApplications(data.data || []);
      } else {
        toast.error('Lỗi khi tải danh sách ứng viên');
      }
    } catch (err) {
      toast.error('Lỗi kết nối mạng');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/recruitment/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Cập nhật trạng thái thành công!');
        fetchApplications();
        if (selectedApp && selectedApp._id === id) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
      } else {
        toast.error(result.message || 'Lỗi khi cập nhật');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hồ sơ ứng viên này?')) return;
    try {
      const response = await fetch(`/api/recruitment/applications/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        toast.success('Xóa thành công!');
        fetchApplications();
        if (selectedApp && selectedApp._id === id) setSelectedApp(null);
      } else {
        toast.error(result.message || 'Lỗi khi xóa');
      }
    } catch (error) {
      toast.error('Lỗi khi xóa hồ sơ');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'reviewed': return 'Đã xem';
      case 'accepted': return 'Đã nhận';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  return (
    <AdminLayout title="Đồng Phục Univi - Quản lý Ứng Viên">
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

        {/* Sidebar List */}
        <div className="w-full md:w-1/3 border-r bg-white min-h-screen">
          <header className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Ứng Viên</h1>
            <p className="text-sm text-gray-500">{applications.length} hồ sơ</p>
          </header>

          <div className="overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
            {loading ? (
              <div className="p-6 text-center text-gray-500">Đang tải...</div>
            ) : applications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">Chưa có ứng viên nào</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedApp?._id === app._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900">{app.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{app.position}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(app.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail View */}
        <div className="w-full md:w-2/3 bg-gray-50 p-6 md:p-8">
          {selectedApp ? (
            <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 max-w-3xl mx-auto">
              <div className="flex justify-between items-start mb-6 pb-6 border-b">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedApp.name}</h2>
                  <p className="text-lg text-[#105d97] font-medium">{selectedApp.position}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleStatusChange(selectedApp._id, e.target.value)}
                    className={`px-3 py-2 rounded-lg border text-sm font-semibold cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(selectedApp.status)}`}
                  >
                    <option value="pending">Chờ duyệt</option>
                    <option value="reviewed">Đã xem</option>
                    <option value="accepted">Đã nhận</option>
                    <option value="rejected">Từ chối</option>
                  </select>
                  <button
                    onClick={() => handleDelete(selectedApp._id)}
                    className="text-xs text-red-500 hover:text-red-700 text-right"
                  >
                    Xóa hồ sơ
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Thông tin liên hệ</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">📧</span>
                      <a href={`mailto:${selectedApp.email}`} className="text-gray-800 hover:text-blue-600">{selectedApp.email}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">📱</span>
                      <a href={`tel:${selectedApp.phone}`} className="text-gray-800 hover:text-blue-600">{selectedApp.phone}</a>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Hồ sơ đính kèm</h4>
                  {selectedApp.cvUrl ? (
                    <a
                      href={selectedApp.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#105d97] text-white rounded-lg hover:bg-[#0e4d7d] transition-colors"
                    >
                      <span>📄</span> Xem CV (Mở tab mới)
                    </a>
                  ) : (
                    <p className="text-gray-500 italic">Không có CV đính kèm</p>
                  )}
                </div>
              </div>

              {selectedApp.message && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Giới thiệu bản thân</h4>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap leading-6 border border-gray-100">
                    {selectedApp.message}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <span className="text-6xl mb-4">📄</span>
              <p className="text-lg">Chọn một ứng viên để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
