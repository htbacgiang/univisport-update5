import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function RecruitmentDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recruitment/jobs');
      const data = await response.json();
      if (data.success) {
        setJobs(data.data || []);
      } else {
        toast.error('Lỗi khi tải danh sách tin tuyển dụng');
      }
    } catch (err) {
      toast.error('Lỗi kết nối mạng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) return;
    try {
      const response = await fetch(`/api/recruitment/jobs/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        toast.success('Xóa thành công!');
        fetchJobs();
      } else {
        toast.error(result.message || 'Lỗi khi xóa');
      }
    } catch (error) {
      toast.error('Lỗi khi xóa tin tuyển dụng');
    }
  };

  const toggleActive = async (job) => {
    try {
      const response = await fetch(`/api/recruitment/jobs/${job._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !job.isActive }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Cập nhật trạng thái thành công!');
        fetchJobs();
      } else {
        toast.error(result.message || 'Lỗi khi cập nhật');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  return (
    <AdminLayout title="Đồng Phục Univi - Quản lý Tuyển Dụng">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Tuyển Dụng</h1>
              <p className="text-sm text-gray-600 mt-1">Danh sách các vị trí đang tuyển</p>
            </div>
            <Link
              href="/dashboard/tuyen-dung/them-moi"
              className="bg-[#105d97] text-white px-4 py-2 rounded-md hover:bg-[#0e4d7d] transition-colors"
            >
              + Thêm Tin Mới
            </Link>
          </div>
        </header>

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center py-10">Đang tải dữ liệu...</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vị trí</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng ban</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.type} • {job.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(job)}
                          className={`px-2 inline-flex text-xs leading-6 font-semibold rounded-full cursor-pointer ${job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {job.isActive ? 'Đang mở' : 'Đã đóng'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/dashboard/tuyen-dung/them-moi?id=${job._id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                  {jobs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        Chưa có tin tuyển dụng nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
