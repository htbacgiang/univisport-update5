import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import { toast } from 'react-hot-toast';
import FeedbackListDashboard from '../../../components/backend/feedback/FeedbackListDashboard';
import AddFeedbackForm from '../../../components/backend/feedback/AddFeedbackForm';

export default function FeedbackDashboard() {
  const [activeTab, setActiveTab] = useState('list');
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu tĩnh hoặc từ API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/feedback');
        const data = await response.json();

        if (data.success && data.data) {
          setProjects(data.data.projects || []);
        } else {
          setError(data.message || 'Lỗi khi tải dữ liệu');
        }
        setLoading(false);
      } catch (err) {
        setError('Lỗi kết nối mạng');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleFeedbackAdded = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/feedback');
      const data = await response.json();
      if (data.success) {
        setProjects(data.data.projects || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setEditingProject(null);
      setActiveTab('list');
    }
  };

  const handleDelete = async (project) => {
    try {
      const response = await fetch(`/api/feedback?id=${project._id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        toast.success('Xóa Feedback thành công!');
        setProjects(projects.filter(p => p._id !== project._id));
      } else {
        toast.error(result.message || 'Lỗi khi xóa');
      }
    } catch (error) {
      toast.error('Lỗi khi xóa Feedback');
    }
  };

  return (
    <AdminLayout title="Đồng Phục Univi - Quản lý Feedback">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Feedback</h1>
            <p className="text-sm text-gray-600 mt-1">Danh sách khách hàng phản hồi</p>
          </div>
        </header>

        <div className="bg-white border-b">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('list')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'list' ? 'border-[#105d97] text-[#105d97]' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                📋 Danh sách Feedback
              </button>
              <button
                onClick={() => {
                  setActiveTab('add');
                  setEditingProject(null);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'add' ? 'border-[#105d97] text-[#105d97]' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {editingProject ? '✏️ Sửa Feedback' : '➕ Thêm Feedback'}
              </button>
            </nav>
          </div>
        </div>

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!loading && activeTab === 'list' && (
            <FeedbackListDashboard
              projects={projects}
              onEdit={(proj) => {
                setEditingProject(proj);
                setActiveTab('add');
              }}
              onDelete={handleDelete}
            />
          )}
          {!loading && activeTab === 'add' && (
            <AddFeedbackForm
              onSuccess={handleFeedbackAdded}
              editingProject={editingProject}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
