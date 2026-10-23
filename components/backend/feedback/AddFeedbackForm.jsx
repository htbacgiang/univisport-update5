import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { X, Plus } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const SimpleEditor = dynamic(() => import('../../editor/SimpleEditor'), { ssr: false });

export default function AddFeedbackForm({ onSuccess, editingProject = null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!editingProject;

  const [images, setImages] = useState([
    { src: '', aspectRatio: 'landscape', width: 16, height: 9 },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    customer: '',
    category: 'Đồng phục thể thao',
    industry: '',
    description: '',
    overview: '',
    logo: '',
    rating: 5,
    location: '',
    employeeCount: '',
    serviceTags: '',
    productLines: '',
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || '',
        slug: editingProject.slug || '',
        customer: editingProject.customer || '',
        category: editingProject.category || 'Đồng phục thể thao',
        industry: editingProject.industry || '',
        description: editingProject.description || '',
        overview: editingProject.overview || '',
        logo: editingProject.logo || '',
        rating: typeof editingProject.rating === 'number' ? editingProject.rating : 5,
        location: editingProject.location || '',
        employeeCount: editingProject.employeeCount || '',
        serviceTags: editingProject.serviceTags || '',
        productLines: typeof editingProject.productLines === 'number' ? editingProject.productLines : '',
        year: editingProject.year || new Date().getFullYear(),
      });
      // Load logic if array contains advanced objects
      const imageArray = [
        { src: editingProject.image || '', aspectRatio: 'landscape', width: 4, height: 3 },
      ];
      if (editingProject.gallery && Array.isArray(editingProject.gallery)) {
        editingProject.gallery.forEach(img => {
          imageArray.push({
            src: img.src || '',
            aspectRatio: img.aspectRatio || 'landscape-3-4',
            width: img.width || 4,
            height: img.height || 3
          });
        });
      }
      setImages(imageArray);
    }
  }, [editingProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (index, url) => {
    setImages(prev => {
      const newImgs = [...prev];
      if (!newImgs[index]) newImgs[index] = { src: '', aspectRatio: 'landscape', width: 16, height: 9 };
      newImgs[index].src = url;
      return newImgs;
    });
  };

  const handleAspectRatioChange = (index, ratio) => {
    setImages(prev => {
      const newImgs = [...prev];
      let w = 16, h = 9;
      if (ratio === 'square') { w = 1; h = 1; }
      if (ratio === 'portrait') { w = 3; h = 4; }
      if (ratio === 'landscape-3-4') { w = 4; h = 3; }
      newImgs[index] = { ...newImgs[index], aspectRatio: ratio, width: w, height: h };
      return newImgs;
    });
  };

  const handleWidthChange = (index, w) => {
    setImages(prev => {
      const newImgs = [...prev];
      newImgs[index] = { ...newImgs[index], width: parseInt(w) || 16 };
      return newImgs;
    });
  };

  const handleHeightChange = (index, h) => {
    setImages(prev => {
      const newImgs = [...prev];
      newImgs[index] = { ...newImgs[index], height: parseInt(h) || 9 };
      return newImgs;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        rating: formData.rating === '' ? 5 : Number(formData.rating),
        productLines: formData.productLines === '' ? 0 : Number(formData.productLines),
        year: formData.year === '' ? new Date().getFullYear() : Number(formData.year),
        image: images[0]?.src,
        gallery: images.slice(1),
      };

      // Create or sanitize slug safely
      const sourceSlug = payload.slug || payload.title;
      payload.slug = sourceSlug.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

      if (isEditMode) {
        payload.id = editingProject._id;
      }

      const res = await fetch('/api/feedback', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        toast.success(isEditMode ? 'Cập nhật feedback thành công!' : 'Thêm feedback thành công!');
        if (onSuccess) onSuccess(data.data);
      } else {
        toast.error(data.message || 'Lỗi từ máy chủ');
      }
    } catch (err) {
      toast.error('Lỗi khi lưu dự án');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 container mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? '✏️ Chỉnh sửa Feedback' : '➕ Thêm Feedback mới'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97]"
              placeholder="VD: Đồng phục nhân viên ngân hàng..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Đường dẫn (Slug)</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97]"
              placeholder="VD: dong-phuc-nhan-vien (để trống tự tạo)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên khách hàng / Đơn vị</label>
            <input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97]"
            >
              <option value="Đồng phục thể thao">Đồng phục thể thao</option>
              <option value="Đồng phục CLB">Đồng phục CLB</option>
              <option value="Đồng phục doanh nghiệp">Đồng phục doanh nghiệp</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngành (hiển thị badge trên thẻ)</label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97]"
            >
              <option value="">Không có</option>
              <option value="Gym">Gym</option>
              <option value="Yoga">Yoga</option>
              <option value="Pickleball">Pickleball</option>
              <option value="Fitness">Fitness</option>
              <option value="MMA">MMA</option>
              <option value="Running">Running</option>
              <option value="Golf">Golf</option>
              <option value="Tennis">Tennis</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện chính</label>
            <input
              type="text"
              value={images[0]?.src || ''}
              onChange={(e) => handleImageUrlChange(0, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97]"
              placeholder="/images/feedback/cover.jpg"
              required
            />
            {images[0]?.src && (
              <div className="mt-2 relative w-32 h-24 border border-gray-300 rounded overflow-hidden">
                <Image src={images[0].src} alt="Cover Preview" fill className="object-cover" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo khách hàng (hiển thị góc thẻ)</label>
            <input
              type="text"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97]"
              placeholder="/images/feedback/logo-khach-hang.png"
            />
            {formData.logo && (
              <div className="mt-2 relative w-16 h-16 border border-gray-300 rounded overflow-hidden bg-gray-50">
                <Image src={formData.logo} alt="Logo Preview" fill className="object-contain" />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn gọn</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97]"
            placeholder="VD: Hệ thống phòng tập thông minh"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá (0-5)</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh/Thành</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97]"
              placeholder="Hà Nội"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nhân sự</label>
            <input
              type="text"
              name="employeeCount"
              value={formData.employeeCount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97]"
              placeholder="120+"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số dòng sản phẩm</label>
            <input
              type="number"
              name="productLines"
              value={formData.productLines}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97]"
              placeholder="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Năm hợp tác</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97]"
              placeholder="2024"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sản phẩm / Dịch vụ (cách nhau bởi dấu phẩy)</label>
          <input
            type="text"
            name="serviceTags"
            value={formData.serviceTags}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97]"
            placeholder="Coach, PT, Sale"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Đường dẫn ảnh bổ sung (Thiết lập tỉ lệ)</label>
          <p className="text-sm text-gray-500 mb-3">
            Nhập tỷ lệ ảnh (width x height) để hiển thị trong React Photo Gallery.
          </p>
          {images.slice(1).map((img, idx) => {
            const index = idx + 1;
            return (
              <div key={index} className="flex gap-2 mb-2 items-center border p-2 rounded-lg bg-gray-50 overflow-hidden">
                {img.src ? (
                  <div className="relative w-16 h-16 border border-gray-300 rounded overflow-hidden flex-shrink-0">
                    <Image src={img.src} alt={`Preview ${index}`} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 border border-gray-300 rounded bg-gray-200 flex-shrink-0 flex items-center justify-center text-[10px] text-gray-500">
                    Ảnh
                  </div>
                )}
                <input
                  type="text"
                  value={img.src}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  className="flex-1 min-w-[150px] px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#105d97] text-sm"
                  placeholder={`/images/feedback/anh-${index + 1}.jpg`}
                />
                <div className="flex gap-1 items-center flex-shrink-0">
                  <span className="text-xs text-gray-500 font-medium">W:</span>
                  <input
                    type="number"
                    value={img.width || 4}
                    onChange={(e) => handleWidthChange(index, e.target.value)}
                    className="w-12 px-2 py-1.5 border border-gray-300 rounded-md text-sm text-center"
                  />
                  <span className="text-xs text-gray-500 font-medium ml-1">H:</span>
                  <input
                    type="number"
                    value={img.height || 3}
                    onChange={(e) => handleHeightChange(index, e.target.value)}
                    className="w-12 px-2 py-1.5 border border-gray-300 rounded-md text-sm text-center"
                  />
                </div>
                <select
                  value={img.aspectRatio || 'landscape-3-4'}
                  onChange={(e) => handleAspectRatioChange(index, e.target.value)}
                  className="w-32 px-2 py-1.5 border border-gray-300 rounded-md text-sm flex-shrink-0"
                >
                  <option value="landscape">Ngang 16:9</option>
                  <option value="landscape-3-4">Ngang 4:3</option>
                  <option value="square">Vuông 1:1</option>
                  <option value="portrait">Dọc 3:4</option>
                </select>
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors flex-shrink-0"
                  title="Xóa ảnh này"
                >
                  <X size={18} />
                </button>
              </div>
            )
          })}
          <button
            type="button"
            onClick={() => setImages([...images, { src: '', width: 4, height: 3, aspectRatio: 'landscape-3-4' }])}
            className="inline-flex items-center px-4 py-2 bg-blue-50 text-[#105d97] rounded-lg hover:bg-blue-100 gap-2 font-medium"
          >
            <Plus size={20} /> Thêm ảnh
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tổng quan *</label>
          <SimpleEditor
            content={formData.overview}
            onChange={(content) => setFormData(prev => ({ ...prev, overview: content }))}
          />
        </div>



        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#105d97] text-white rounded-lg hover:bg-[#0a4572]">
            {isSubmitting ? 'Đang lưu...' : 'Lưu Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
}
