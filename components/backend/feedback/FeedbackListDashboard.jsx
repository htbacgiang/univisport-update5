import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaStar, FaMapMarkerAlt, FaUsers, FaTag, FaCalendarAlt } from 'react-icons/fa';

const CATEGORIES = ['Đồng phục thể thao', 'Đồng phục CLB', 'Đồng phục doanh nghiệp'];

export default function FeedbackListDashboard({ projects: initialProjects, onEdit, onDelete }) {
  const [projects, setProjects] = useState(initialProjects || []);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    if (initialProjects) {
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.category === filter;
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customer?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  return (
    <div className=" p-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setFilter('all'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-[#105d97] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            Tất cả ({projects.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat ? 'bg-[#105d97] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {cat} ({projects.filter(p => p.category === cat).length})
            </button>
          ))}
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          placeholder="Tìm theo tên dự án / khách hàng..."
          className="md:ml-auto md:w-72 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#105d97]/40 focus:border-[#105d97]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProjects.map((project) => (
          <div key={project.slug || project._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-gray-200">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title || "Feedback"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
              {project.logo && (
                <div className="absolute top-2 right-2 w-10 h-10 bg-white rounded-lg shadow p-1">
                  <div className="relative w-full h-full">
                    <Image src={project.logo} alt="logo" fill className="object-contain" />
                  </div>
                </div>
              )}
              <span className="absolute top-2 left-2 px-2.5 py-1 bg-black/60 text-white text-[11px] font-semibold rounded-full">
                {project.industry || project.category}
              </span>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{project.title}</h3>
                <span className="flex items-center gap-1 text-amber-500 text-sm font-semibold shrink-0">
                  <FaStar className="text-xs" />
                  {Number(project.rating ?? 5).toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Khách hàng: {project.customer}</p>
              <p className="text-xs text-gray-400 mb-3">{project.category}</p>

              <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-xs text-gray-500 mb-3 pb-3 border-b">
                <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-gray-400 shrink-0" />{project.location || '—'}</span>
                <span className="flex items-center gap-1.5"><FaUsers className="text-gray-400 shrink-0" />{project.employeeCount || '—'}</span>
                <span className="flex items-center gap-1.5 truncate"><FaTag className="text-gray-400 shrink-0" />{project.serviceTags || '—'}</span>
                <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-gray-400 shrink-0" />{project.year || '—'}</span>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button
                  onClick={() => window.open(`/feedback/${project.slug}`, '_blank')}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded hover:bg-blue-100 transition-colors"
                >
                  👁️ Xem
                </button>
                <button
                  onClick={() => onEdit && onEdit(project)}
                  className="flex-1 px-3 py-2 bg-green-50 text-green-600 text-sm font-medium rounded hover:bg-green-100 transition-colors"
                >
                  ✏️ Sửa
                </button>
                <button
                  onClick={() => {
                    if (confirm("Bạn có chắc chắn muốn xóa feedback này?")) {
                      onDelete && onDelete(project);
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded hover:bg-red-100 transition-colors"
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Hiển thị <span className="font-medium">{startIndex + 1}</span>–<span className="font-medium">{Math.min(endIndex, filteredProjects.length)}</span> / <span className="font-medium">{filteredProjects.length}</span> feedback
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 text-sm rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-full border transition-colors ${page === currentPage
                    ? 'bg-[#105d97] text-white border-[#105d97]'
                    : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 text-sm rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Sau →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
