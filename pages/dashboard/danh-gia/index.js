import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Trash2, X, Star, Search, Filter, MessageSquare, ExternalLink } from 'lucide-react';

function StarDisplay({ value }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}
        />
      ))}
    </span>
  );
}

const STAR_COLORS = {
  1: 'bg-red-100 text-red-700 border-red-200',
  2: 'bg-orange-100 text-orange-700 border-orange-200',
  3: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  4: 'bg-blue-100 text-blue-700 border-blue-200',
  5: 'bg-green-100 text-green-700 border-green-200',
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Filters
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  // Delete modal
  const [deleteModal, setDeleteModal] = useState(null); // { productSlug, reviewId, reviewerName }
  const [deleting, setDeleting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(ratingFilter && { rating: ratingFilter }),
      });
      const res = await fetch(`/api/admin/reviews?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReviews(data.reviews || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error('Không thể tải đánh giá: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, ratingFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, ratingFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/products/${deleteModal.productSlug}/reviews?reviewId=${deleteModal.reviewId}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Đã xóa đánh giá thành công');
      setReviews((prev) => prev.filter((r) => String(r._id) !== String(deleteModal.reviewId)));
      setTotal((t) => t - 1);
      setDeleteModal(null);
    } catch (err) {
      toast.error('Lỗi khi xóa: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));

  return (
    <AdminLayout title="Quản lý đánh giá">
      <div className="p-6 bg-[#f8fafc] min-h-screen space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-[#105d97] shrink-0" />
            <h1 className="text-[1.375rem] font-bold text-[#0f172a] m-0">Quản lý đánh giá</h1>
          </div>
          <span className="text-sm bg-[#105d97]/10 text-[#105d97] font-semibold px-3 py-1.5 rounded-full">
            {total} đánh giá
          </span>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#e2e8f0] rounded-[10px] p-4 flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, nội dung, sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97]"
            />
          </div>

          {/* Star filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Lọc:</span>
            <button
              onClick={() => setRatingFilter('')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${ratingFilter === '' ? 'bg-[#105d97] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Tất cả
            </button>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRatingFilter(ratingFilter === String(s) ? '' : String(s))}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  ratingFilter === String(s)
                    ? 'bg-yellow-400 text-white border-yellow-400'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent'
                }`}
              >
                {s}<Star size={10} className="fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <div className="animate-spin w-8 h-8 border-4 border-[#105d97] border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-gray-400">Đang tải đánh giá...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-12 text-center">
              <Star className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Không có đánh giá nào phù hợp</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <th className="text-left px-4 py-3 font-semibold text-[#64748b] text-xs uppercase tracking-wide">STT</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748b] text-xs uppercase tracking-wide">Sản phẩm</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748b] text-xs uppercase tracking-wide">Người đánh giá</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748b] text-xs uppercase tracking-wide">Sao</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748b] text-xs uppercase tracking-wide">Nội dung</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748b] text-xs uppercase tracking-wide">Ngày</th>
                    <th className="text-center px-4 py-3 font-semibold text-[#64748b] text-xs uppercase tracking-wide">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {reviews.map((review, idx) => (
                    <tr
                      key={String(review._id)}
                      className={`hover:bg-[#f8fafc] transition-colors ${review.rating <= 2 ? 'bg-red-50/30' : ''}`}
                    >
                      <td className="px-4 py-3 text-gray-400 text-xs">{(page - 1) * limit + idx + 1}</td>

                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {review.productImage && (
                            <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                              <Image
                                src={review.productImage}
                                alt={review.productName}
                                fill
                                className="object-cover"
                                unoptimized={review.productImage?.startsWith('http')}
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-[#0f172a] text-xs truncate max-w-[140px]">{review.productName}</p>
                            <Link
                              href={`/san-pham/${review.productSlug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-[#105d97] hover:underline flex items-center gap-0.5 mt-0.5"
                            >
                              {review.productMa} <ExternalLink size={9} />
                            </Link>
                          </div>
                        </div>
                      </td>

                      {/* Reviewer */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#105d97]/10 flex items-center justify-center text-[#105d97] font-bold text-xs flex-shrink-0">
                            {(review.name || 'A').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-[#0f172a] text-xs">{review.name}</span>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${STAR_COLORS[review.rating] || ''}`}>
                          {review.rating}<Star size={10} className="fill-current" />
                        </span>
                      </td>

                      {/* Comment */}
                      <td className="px-4 py-3 max-w-[250px]">
                        {review.comment ? (
                          <p className="text-gray-600 text-xs line-clamp-2 leading-6">{review.comment}</p>
                        ) : (
                          <span className="text-gray-300 text-xs italic">Không có nội dung</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(review.createdAt)}</td>

                      {/* Delete */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setDeleteModal({
                            productSlug: review.productSlug,
                            reviewId: review._id,
                            reviewerName: review.name,
                            productName: review.productName,
                          })}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label={`Xóa đánh giá của ${review.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3.5 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-[#105d97] text-white border-[#105d97]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3.5 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Sau
            </button>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => !deleting && setDeleteModal(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-center text-gray-900 mb-1">Xóa đánh giá</h3>
              <p className="text-sm text-center text-gray-500 mb-5">
                Bạn có chắc muốn xóa đánh giá của <span className="font-semibold text-gray-800">{deleteModal.reviewerName}</span>{' '}
                cho sản phẩm <span className="font-semibold text-gray-800">{deleteModal.productName}</span>?
                <br />
                <span className="text-red-500 text-xs">Hành động này không thể hoàn tác.</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <X size={16} /> Hủy
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-white font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang xóa...</>
                  ) : (
                    <><Trash2 size={16} /> Xóa ngay</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session || session.user?.role !== 'admin') {
    return { redirect: { destination: '/', permanent: false } };
  }
  return { props: {} };
}
