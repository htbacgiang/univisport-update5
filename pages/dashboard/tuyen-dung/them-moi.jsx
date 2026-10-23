import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/layout/AdminLayout';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function AddJobPage() {
  const router = useRouter();
  const { id } = router.query;
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: 'Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, thành phố Hà Nội',
    type: 'Full-time',
    salary: '',
    experience: '',
    description: '',
    requirements: [''],
    benefits: [''],
    isActive: true
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await fetch(`/api/recruitment/jobs/${id}`);
        const data = await res.json();
        if (data.success) {
          setFormData(data.data);
        }
      } catch (err) {
        toast.error('Không thể tải thông tin tin tuyển dụng');
      }
    };

    if (isEditing) {
      fetchJobDetails();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleArrayChange = (index, field, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Xóa các mục rỗng trong mảng
    const cleanData = {
      ...formData,
      requirements: formData.requirements.filter(req => req.trim() !== ''),
      benefits: formData.benefits.filter(ben => ben.trim() !== ''),
    };

    try {
      const url = isEditing ? `/api/recruitment/jobs/${id}` : '/api/recruitment/jobs';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(isEditing ? 'Cập nhật thành công!' : 'Tạo tin tuyển dụng thành công!');
        router.push('/dashboard/tuyen-dung');
      } else {
        toast.error(result.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      toast.error('Lỗi khi lưu dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={`Đồng Phục Univi - ${isEditing ? 'Sửa' : 'Thêm'} Tin Tuyển Dụng`}>
      <div className="min-h-screen bg-gray-50 pb-10">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/tuyen-dung" className="text-gray-500 hover:text-gray-900">
                ← Quay lại
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Sửa Tin Tuyển Dụng' : 'Thêm Tin Tuyển Dụng Mới'}
              </h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề / Vị trí *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="VD: Nhân viên Kế toán"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="VD: Kế Toán"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại hình</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="VD: Full-time / Part-time"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mức lương</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="VD: 6-8 triệu"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="VD: Không yêu cầu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả công việc</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Mô tả chung về công việc..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yêu cầu công việc</label>
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleArrayChange(index, 'requirements', e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                    placeholder="VD: Biết sử dụng Excel..."
                  />
                  {formData.requirements.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem(index, 'requirements')} className="px-3 py-2 bg-red-100 text-red-600 rounded-md">X</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('requirements')} className="text-sm text-blue-600 mt-1">+ Thêm yêu cầu</button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quyền lợi</label>
              {formData.benefits.map((ben, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={ben}
                    onChange={(e) => handleArrayChange(index, 'benefits', e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                    placeholder="VD: Thưởng lễ, tết..."
                  />
                  {formData.benefits.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem(index, 'benefits')} className="px-3 py-2 bg-red-100 text-red-600 rounded-md">X</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('benefits')} className="text-sm text-blue-600 mt-1">+ Thêm quyền lợi</button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Kích hoạt (Hiển thị tin trên trang Tuyển dụng)</label>
            </div>

            <div className="pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#105d97] text-white py-3 px-4 rounded-md font-medium hover:bg-[#0e4d7d] disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật Tin Tuyển Dụng' : 'Tạo Tin Tuyển Dụng')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
