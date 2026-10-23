import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Pencil, Globe, Trash2, CalendarDays, AlertTriangle } from "lucide-react";
import styles from "../../styles/posts.module.css";

interface DashboardPostCardProps {
  post: {
    id: string;
    slug: string;
    title: string;
    thumbnail?: string;
    status?: string;
    isDraft?: boolean;
    createdAt: string;
  };
  onDeleteClick?: () => void;
  onToggleStatus?: (postId: string, isDraft: boolean) => void;
}

const DashboardPostCard: React.FC<DashboardPostCardProps> = ({ post, onDeleteClick, onToggleStatus }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const confirmDelete = () => {
    onDeleteClick?.();
    setShowDeleteConfirm(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setShowDeleteConfirm(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showDeleteConfirm) setShowDeleteConfirm(false);
    };
    if (showDeleteConfirm) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showDeleteConfirm]);

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleStatus?.(post.id, !post.isDraft);
  };

  return (
    <>
      <div className={styles.postCard}>
        {post.thumbnail && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={post.thumbnail}
            alt={post.title}
            className={styles.postImage}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        )}
        <div className={styles.postContent}>
          <h3 className={styles.postTitle}>{post.title}</h3>

          <div className={styles.postMeta}>
            <div className={styles.postDate}>
              <CalendarDays className="w-3 h-3" />
              {new Date(post.createdAt).toLocaleDateString("vi-VN")}
            </div>
            <span className={`${styles.postStatus} ${post.isDraft ? styles.statusDraft : styles.statusPublished}`}>
              {post.isDraft ? "Bản nháp" : "Đã xuất bản"}
            </span>
          </div>

          <div className={styles.postActions}>
            <Link
              href={`/dashboard/bai-viet/update/${post.slug}`}
              className={`${styles.actionButton} ${styles.editButton}`}
            >
              <Pencil className="w-3.5 h-3.5" />
              Chỉnh sửa
            </Link>
            {onToggleStatus && post.isDraft && (
              <button
                className={`${styles.actionButton} ${styles.publishButton}`}
                onClick={handleToggleStatus}
              >
                <Globe className="w-3.5 h-3.5" />
                Công khai
              </button>
            )}
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={(e) => { e.preventDefault(); setShowDeleteConfirm(true); }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 bg-[#fef2f2] rounded-full flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4.5 h-4.5 text-[#dc2626]" style={{ width: 18, height: 18 }} />
                </div>
                <h3 className={styles.modalTitle}>Xác nhận xóa bài viết</h3>
              </div>
            </div>
            <div className={styles.modalBody}>
              <p>Bạn có chắc chắn muốn xóa bài viết <strong>&quot;{post.title}&quot;</strong>?</p>
              <p className={styles.modalWarning}>Hành động này không thể hoàn tác!</p>
            </div>
            <div className={styles.modalActions}>
              <button
                className={`${styles.modalButton} ${styles.cancelButton}`}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Hủy bỏ
              </button>
              <button
                className={`${styles.modalButton} ${styles.confirmDeleteButton}`}
                onClick={confirmDelete}
              >
                Xóa bài viết
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardPostCard;
