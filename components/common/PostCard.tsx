import Image from "next/image";
import { FC, useState } from "react";
import { PostDetail as BasePostDetail } from "../../utils/types";
import Link from "next/link";

// Mở rộng kiểu dữ liệu PostDetail gốc để thêm các thuộc tính mới
interface ExtendedPostDetail extends BasePostDetail {
  category: string; // Thêm danh mục
  createdAt: string; // Thêm ngày tạo
}

interface Props {
  post: ExtendedPostDetail;
  busy?: boolean;
  controls?: boolean;
  onDeleteClick?(): void;
}

const PostCard: FC<Props> = ({
  controls = false,
  post,
  busy,
  onDeleteClick,
}): JSX.Element => {
  if (!post) return <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-gray-400">Không có dữ liệu bài viết</div>;

  const { title, slug, thumbnail, createdAt } = post;
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    if (onDeleteClick) {
      onDeleteClick();
    }
    setShowModal(false);
  };

  const formatDate = (date: string): string =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <>
      <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100">
        {/* Thumbnail Container */}
        <div className="relative overflow-hidden">
          {!thumbnail ? (
            <div className="w-full h-56 flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p>Không có hình ảnh</p>
              </div>
            </div>
          ) : (
            <Link href={post.isDirectPost ? `/${slug}` : `/bai-viet/${slug}`}>
              <div className="relative h-56 md:h-64 w-full">
                <Image
                  src={thumbnail}
                  layout="fill"
                  alt={title}
                  objectFit="cover"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          )}
        </div>

        {/* Content */}
        <div className="py-3 px-6 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">
              {formatDate(createdAt)}
            </span>
          </div>

          <Link
            href={post.isDirectPost ? `/${slug}` : `/bai-viet/${slug}`}
            className="block group-hover:text-[#105d97] transition-colors duration-200 flex-grow"
            aria-label={title}
          >
            <h2 className="text-lg md:text-base font-medium text-gray-900 line-clamp-2 group-hover:text-[#105d97] transition-colors duration-200">
              {title}
            </h2>
          </Link>

          <div className="">
            <Link
              href={post.isDirectPost ? `/${slug}` : `/bai-viet/${slug}`}
              className="inline-flex items-center text-[#105d97] font-medium text-base hover:text-[#0e4a7a] transition-colors duration-200"
            >
              Đọc thêm
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Controls (Edit/Delete) */}
          {controls && (
            <div className="mt-4 flex justify-between gap-3 pt-4 border-t border-gray-100">
              <Link
                className="flex-1 px-4 py-2 bg-blue-50 text-[#105d97] rounded-lg hover:bg-blue-100 text-sm font-medium text-center transition-all duration-300"
                href={`/dashboard/bai-viet/update/${slug}`}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Sửa
              </Link>
              <button
                disabled={busy}
                onClick={() => setShowModal(true)}
                className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Xóa
              </button>
            </div>
          )}
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-medium text-gray-900">Xác nhận xóa</h2>
            </div>
            <p className="mb-8 text-gray-700 leading-6">
              Bạn có chắc chắn muốn xóa bài viết <span className="font-semibold text-gray-900">&quot;{title}&quot;</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium"
              >
                Hủy
              </button>
              <button
                disabled={busy}
                onClick={handleDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy ? "Đang xóa..." : "Xóa bài viết"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
