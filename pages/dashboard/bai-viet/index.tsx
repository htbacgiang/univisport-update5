import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Link from "next/link";
import AdminLayout from "../../../components/layout/AdminLayout";
import DashboardPostCard from "../../../components/common/DashboardPostCard";
import Pagination from "../../../components/common/Pagination";
import { formatPosts, readPostsFromDb, countPostsStatsFromDb } from "../../../lib/utils";
import { PostDetail } from "../../../utils/types";
import Post from "../../../models/Post";
import db from "../../../utils/db";
import styles from "../../../styles/posts.module.css";
import { Notebook, Plus, Search, LayoutGrid, List, Pencil, Globe, Trash2, CalendarDays, AlertTriangle } from "lucide-react";
import Image from "next/image";

const limit = 12; // Số bài viết mỗi trang
const MAX_FEATURED = 5;

const PostListRow = ({
  post,
  index,
  canDrag,
  onDragStart,
  onDragEnd,
  onDeleteClick,
  onToggleStatus,
}: {
  post: PostDetail;
  index: number;
  canDrag: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDeleteClick: () => void;
  onToggleStatus: (postId: string, isDraft: boolean) => void;
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const confirmDelete = () => {
    onDeleteClick();
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
    onToggleStatus(post.id, !post.isDraft);
  };

  return (
    <>
      <tr
        draggable={canDrag}
        onDragStart={canDrag ? onDragStart : undefined}
        onDragEnd={onDragEnd}
        className={`hover:bg-gray-50 transition-colors border-b border-gray-150 ${
          canDrag ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        <td className="p-4 align-middle text-gray-500 font-medium text-center w-12">
          {index}
        </td>
        <td className="p-4 align-middle">
          <div className="flex items-center gap-2">
            {canDrag && (
              <span className="text-gray-400 cursor-grab active:cursor-grabbing font-bold select-none text-base" title="Kéo bài viết này vào ô nổi bật">
                ⠿
              </span>
            )}
            <span className="font-semibold text-gray-900 line-clamp-1">{post.title}</span>
          </div>
        </td>
        <td className="p-4 align-middle">
          <a
            href={`/bai-viet/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-sky-600 transition-colors font-mono text-xs bg-gray-50 hover:bg-sky-50 px-2 py-1 rounded border border-gray-200 inline-block max-w-[240px] truncate"
            title={`Xem bài viết: /bai-viet/${post.slug}`}
          >
            {post.slug}
          </a>
        </td>
        <td className="p-4 align-middle text-gray-500 text-sm whitespace-nowrap">
          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
        </td>
        <td className="p-4 align-middle whitespace-nowrap">
          <button
            onClick={handleToggleStatus}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
              post.isDraft
                ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
            title="Nhấp để thay đổi trạng thái"
          >
            {post.isDraft ? "Bản nháp" : "Đã xuất bản"}
          </button>
        </td>
        <td className="p-4 align-middle text-right whitespace-nowrap">
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/dashboard/bai-viet/update/${post.slug}`}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              Sửa
            </Link>
            {post.isDraft && (
              <button
                onClick={handleToggleStatus}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 hover:border-green-300 transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                Công khai
              </button>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa
            </button>
          </div>
        </td>
      </tr>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={handleOverlayClick}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
            <div className="p-5 pb-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Xác nhận xóa bài viết</h3>
              </div>
            </div>
            <div className="p-5 py-3">
              <p className="text-sm text-gray-500 leading-6">
                Bạn có chắc chắn muốn xóa bài viết <strong>&quot;{post.title}&quot;</strong>?
              </p>
              <p className="text-xs font-medium text-red-600 mt-2 bg-red-50 p-2 rounded border border-red-100">
                Hành động này không thể hoàn tác!
              </p>
            </div>
            <div className="p-5 pt-2 flex gap-3 justify-end bg-gray-50 border-t border-gray-100">
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Hủy bỏ
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
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

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Posts: NextPage<Props> = ({ initialPosts, totalPages: initialTotalPages, initialStats }) => {
  const [posts, setPosts] = useState<PostDetail[]>(initialPosts);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [stats, setStats] = useState(initialStats);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();

  const yearsRange = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 2020; y--) {
    yearsRange.push(y);
  }

  const isFirstRender = useRef(true);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load posts when page, debounced search, timeframe, selectedMonth, selectedYear or selectedCategory changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    let active = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const skip = (currentPage - 1) * limit;
        const { data } = await axios.get(`/api/posts`, {
          params: {
            limit,
            skip,
            includeDrafts: "true",
            search: debouncedSearch,
            category: selectedCategory,
            timeframe,
            month: timeframe === "custom" ? selectedMonth : undefined,
            year: timeframe === "custom" ? selectedYear : undefined,
          },
        });
        if (active) {
          setPosts(data.posts);
          setTotalPages(data.totalPages || 1);
          if (data.stats) {
            setStats(data.stats);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu!");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [currentPage, debouncedSearch, selectedCategory, timeframe, selectedMonth, selectedYear]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTimeframeChange = (val: string) => {
    setTimeframe(val);
    setCurrentPage(1);
  };

  const handleMonthChange = (val: string) => {
    setSelectedMonth(val);
    setCurrentPage(1);
  };

  const handleYearChange = (val: string) => {
    setSelectedYear(val);
    setCurrentPage(1);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("dashboard-posts-view-mode");
    if (savedMode === "grid" || savedMode === "list") {
      setViewMode(savedMode);
    }
  }, []);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("dashboard-posts-view-mode", mode);
  };

  // Featured state
  const [featuredPosts, setFeaturedPosts] = useState<PostDetail[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [showFeaturedPicker, setShowFeaturedPicker] = useState(false);

  // Drag & drop state
  const [draggingId, setDraggingId] = useState<string | null>(null);   // id đang kéo
  const [draggingFrom, setDraggingFrom] = useState<"featured" | "list" | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null); // slot index đang hover

  // ── Fetch featured posts ──
  const fetchFeatured = useCallback(async () => {
    setFeaturedLoading(true);
    try {
      const { data } = await axios.get("/api/posts/featured");
      // Sort tăng dần theo featuredOrder
      const sorted = (data.posts || []).sort(
        (a: PostDetail, b: PostDetail) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999)
      );
      setFeaturedPosts(sorted);
    } catch {
      // ignore
    } finally {
      setFeaturedLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  // ── Remove from featured ──
  const handleRemoveFeatured = async (postId: string) => {
    try {
      await axios.put("/api/posts/featured", { action: "remove", postId });
      toast.success("Đã xóa khỏi danh sách nổi bật");
      fetchFeatured();
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isFeatured: false, featuredOrder: undefined } : p))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Có lỗi xảy ra");
    }
  };

  // ── Save reorder to API ──
  const saveReorder = async (newList: PostDetail[]) => {
    try {
      await axios.put("/api/posts/featured", {
        action: "reorder",
        items: newList.map((p, i) => ({ postId: p.id, order: i + 1 })),
      });
    } catch {
      toast.error("Không thể lưu thứ tự mới");
      fetchFeatured();
    }
  };

  // ── Add to featured ──
  const handleAddFeatured = async (postId: string) => {
    if (featuredPosts.length >= MAX_FEATURED) {
      toast.error("Đã đủ 4 bài nổi bật!");
      return;
    }
    try {
      await axios.put("/api/posts/featured", { action: "add", postId });
      toast.success("Đã thêm vào danh sách nổi bật");
      setShowFeaturedPicker(false);
      fetchFeatured();
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isFeatured: true } : p))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Có lỗi xảy ra");
    }
  };

  // ──────────────────────────────────────────────────────
  // DRAG & DROP — HTML5 native
  // ──────────────────────────────────────────────────────

  // Kéo trong vùng featured: reorder
  const handleFeaturedDragStart = (e: React.DragEvent, postId: string) => {
    setDraggingId(postId);
    setDraggingFrom("featured");
    e.dataTransfer.effectAllowed = "move";
  };

  // Kéo từ danh sách bài viết xuống vùng featured
  const handleListDragStart = (e: React.DragEvent, postId: string) => {
    setDraggingId(postId);
    setDraggingFrom("list");
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleSlotDragOver = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggingFrom === "list" ? "copy" : "move";
    setDragOverSlot(slotIdx);
  };

  const handleSlotDrop = async (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    setDragOverSlot(null);
    if (!draggingId) return;

    if (draggingFrom === "list") {
      // Thêm bài mới vào slot cụ thể (nếu slot trống)
      if (featuredPosts.length >= MAX_FEATURED) {
        toast.error("Đã đủ 4 bài nổi bật!");
        return;
      }
      await handleAddFeatured(draggingId);
      setDraggingId(null);
      setDraggingFrom(null);
      return;
    }

    // Kéo trong featured: swap vị trí
    if (draggingFrom === "featured") {
      const fromIdx = featuredPosts.findIndex((p) => p.id === draggingId);
      if (fromIdx === -1 || fromIdx === slotIdx) {
        setDraggingId(null);
        setDraggingFrom(null);
        return;
      }
      const newList = [...featuredPosts];
      const [moved] = newList.splice(fromIdx, 1);
      newList.splice(slotIdx, 0, moved);
      setFeaturedPosts(newList); // optimistic
      await saveReorder(newList);
    }

    setDraggingId(null);
    setDraggingFrom(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDraggingFrom(null);
    setDragOverSlot(null);
  };

  // Hàm xử lý đổi trang (server-side pagination)
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Xử lý xoá bài viết theo postId
  const handleDelete = async (postId: string) => {
    try {
      const postToDelete = posts.find((p) => p.id === postId);
      await axios.delete(`/api/posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      if (featuredPosts.some((p) => p.id === postId)) fetchFeatured();
      
      // Cập nhật thống kê cục bộ
      if (postToDelete) {
        setStats((prev) => ({
          total: Math.max(0, prev.total - 1),
          drafts: postToDelete.isDraft ? Math.max(0, prev.drafts - 1) : prev.drafts,
          published: !postToDelete.isDraft ? Math.max(0, prev.published - 1) : prev.published,
        }));
      }
      
      toast.success("Bài viết đã được xóa thành công!");
    } catch (error: any) {
      console.error("Error deleting post:", error);
      const errorMessage = error.response?.data?.error || "Có lỗi xảy ra khi xóa bài viết!";
      toast.error(errorMessage);
    }
  };

  // Xử lý chuyển đổi trạng thái nháp/công khai
  const handleToggleStatus = async (postId: string, isDraft: boolean) => {
    try {
      await axios.put("/api/posts/draft", {
        postId,
        isDraft
      });
      
      setPosts((prevPosts) => 
        prevPosts.map((post) => 
          post.id === postId 
            ? { ...post, isDraft } 
            : post
        )
      );
      
      // Cập nhật thống kê cục bộ
      setStats((prev) => {
        const diff = isDraft ? 1 : -1;
        return {
          total: prev.total,
          drafts: Math.max(0, prev.drafts + diff),
          published: Math.max(0, prev.published - diff),
        };
      });
      
      if (isDraft) {
        toast.success("Bài viết đã được chuyển về trạng thái nháp!");
      } else {
        toast.success("Bài viết đã được công khai!");
      }
    } catch (error: any) {
      console.error("Error toggling status:", error);
      toast.error("Có lỗi xảy ra khi thay đổi trạng thái bài viết!");
    }
  };

  // Lọc bài viết từ server theo bộ lọc
  const filteredPosts = posts;

  // Bài có thể chọn làm featured (từ picker modal)
  const pickablePosts = posts.filter((p) => !p.isFeatured && !p.isDraft);

  // Hàm xử lý chuyển đến trang thêm bài viết mới
  const handleAddNewPost = () => {
    router.push("/dashboard/them-bai-viet");
  };

  return (
    <AdminLayout>
      <div className={styles.postsContainer}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            <Notebook style={{ width: 20, height: 20, color: "#105d97", flexShrink: 0 }} />
            Quản lý bài viết
          </h1>
          <p className={styles.subtitle}>
            Kéo bài viết vào ô nổi bật phía dưới để thêm nhanh
            <span className={styles.postCount}>
              ({posts.length} bài viết · trang {currentPage}/{totalPages})
            </span>
          </p>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tổng số bài viết</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.total || 0}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Notebook className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Đã công khai</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">{stats?.published || 0}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bản nháp</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">{stats?.drafts || 0}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Pencil className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            FEATURED MANAGER
        ══════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 mt-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="text-amber-400 text-xl">★</span>
                Bài viết nổi bật
                <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                  {featuredPosts.length}/{MAX_FEATURED}
                </span>
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Kéo thả thẻ để sắp xếp thứ tự · Vị trí 1 hiển thị đầu tiên trên trang /bai-viet
              </p>
            </div>
            <button
              onClick={() => setShowFeaturedPicker(true)}
              disabled={featuredPosts.length >= MAX_FEATURED}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                featuredPosts.length >= MAX_FEATURED
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
              }`}
              title={featuredPosts.length >= MAX_FEATURED ? "Đã đủ 5 bài nổi bật" : ""}
            >
              <span className="text-base leading-none">+</span>
              Thêm bài
            </button>
          </div>

          {/* 5 slots hiển thị dạng card */}
          {featuredLoading ? (
            <div className="flex gap-4">
              {[...Array(MAX_FEATURED)].map((_, i) => (
                <div key={i} className="flex-1 h-40 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(MAX_FEATURED)].map((_, slotIdx) => {
                const post = featuredPosts[slotIdx];
                const isOver = dragOverSlot === slotIdx;
                const isDraggingThis = post && draggingId === post.id;

                return (
                  <div
                    key={slotIdx}
                    onDragOver={(e) => handleSlotDragOver(e, slotIdx)}
                    onDrop={(e) => handleSlotDrop(e, slotIdx)}
                    onDragLeave={() => setDragOverSlot(null)}
                    className={`relative rounded-xl border-2 transition-all duration-200 min-h-[160px] ${
                      post
                        ? isDraggingThis
                          ? "border-amber-300 bg-amber-50 opacity-50"
                          : isOver
                          ? "border-amber-400 bg-amber-50 shadow-lg scale-[1.02]"
                          : "border-amber-200 bg-white shadow-sm hover:shadow-md"
                        : isOver
                        ? "border-amber-400 bg-amber-50 scale-[1.02] shadow-lg"
                        : "border-dashed border-gray-200 bg-gray-50"
                    }`}
                  >
                    {/* Số thứ tự */}
                    <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                      post ? "bg-amber-400 text-white" : "bg-gray-200 text-gray-400"
                    }`}>
                      {slotIdx + 1}
                    </div>

                    {post ? (
                      <div
                        draggable
                        onDragStart={(e) => handleFeaturedDragStart(e, post.id)}
                        onDragEnd={handleDragEnd}
                        className="flex flex-col h-full cursor-grab active:cursor-grabbing select-none"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-full aspect-video rounded-t-xl overflow-hidden bg-gray-100">
                          {post.thumbnail ? (
                            <Image
                              src={post.thumbnail}
                              alt={post.title}
                              fill
                              className="object-cover"
                              draggable={false}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300">📝</div>
                          )}
                          {/* Remove button */}
                          <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); handleRemoveFeatured(post.id); }}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white text-xs flex items-center justify-center hover:bg-red-500 transition-colors z-20"
                            title="Xóa khỏi nổi bật"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Info */}
                        <div className="p-2 flex-1">
                          <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-6">{post.title}</p>
                          <p className="text-xs text-gray-400 mt-1 truncate">{post.category || "—"}</p>
                        </div>

                        {/* Drag hint */}
                        <div className="px-2 pb-2 text-xs text-gray-300 flex items-center gap-1">
                          <span>⠿</span> Kéo để đổi vị trí
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4 text-center gap-2">
                        <span className="text-3xl text-gray-200">☆</span>
                        <p className="text-xs text-gray-400">Kéo bài viết vào đây</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL PICKER */}
        {showFeaturedPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Chọn bài viết nổi bật</h3>
                <button
                  onClick={() => setShowFeaturedPicker(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                >✕</button>
              </div>
              <div className="overflow-y-auto flex-1 p-4 space-y-2">
                {pickablePosts.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">Không có bài viết nào để chọn</p>
                ) : (
                  pickablePosts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => handleAddFeatured(post.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-left"
                    >
                      {post.thumbnail ? (
                        <Image src={post.thumbnail} alt={post.title} width={48} height={36} className="object-cover rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-9 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-xs">📝</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                        <p className="text-xs text-gray-400">{post.category || "Không có danh mục"}</p>
                      </div>
                      <span className="text-amber-500 text-sm flex-shrink-0 font-semibold">+ Thêm</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 max-w-3xl">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 hover:border-gray-400 transition-all"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Category Filter */}
            <div className="relative flex-shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 hover:border-gray-400 transition-all cursor-pointer min-w-[160px]"
              >
                <option value="">Tất cả danh mục</option>
                <option value="Đồng phục thể thao">Đồng phục thể thao</option>
                <option value="Đồng phục doanh nghiệp">Đồng phục doanh nghiệp</option>
                <option value="Kiến thức chất liệu & công nghệ">Kiến thức chất liệu & công nghệ</option>
                <option value="Kiến thiết kế & branding">Kiến thiết kế & branding</option>
                <option value="Phản hồi khách hàng">Phản hồi khách hàng</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Timeframe Filter */}
            <div className="relative flex-shrink-0">
              <select
                value={timeframe}
                onChange={(e) => handleTimeframeChange(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 hover:border-gray-400 transition-all cursor-pointer min-w-[155px]"
              >
                <option value="">Tất cả thời gian</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="last_month">Tháng trước</option>
                <option value="year">Năm nay</option>
                <option value="custom">Tháng/Năm cụ thể...</option>
              </select>
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Custom Month/Year selectors */}
            {timeframe === "custom" && (
              <div className="flex gap-2 flex-shrink-0">
                {/* Select Month */}
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 hover:border-gray-400 transition-all cursor-pointer min-w-[110px]"
                  >
                    <option value="">Cả năm</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        Tháng {i + 1}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                {/* Select Year */}
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => handleYearChange(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 hover:border-gray-400 transition-all cursor-pointer min-w-[100px]"
                  >
                    {yearsRange.map((yr) => (
                      <option key={yr} value={String(yr)}>
                        Năm {yr}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            
            {/* View Mode Switcher */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 flex-shrink-0 self-start sm:self-auto">
              <button
                onClick={() => handleViewModeChange("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-sky-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                title="Hiển thị dạng lưới"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Lưới
              </button>
              <button
                onClick={() => handleViewModeChange("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === "list"
                    ? "bg-white text-sky-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                title="Hiển thị dạng danh sách"
              >
                <List className="w-3.5 h-3.5" />
                Danh sách
              </button>
            </div>
          </div>
          
          <button className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#105d97] text-white border-0 rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#0e4d7a] transition-all shadow-sm whitespace-nowrap md:w-auto w-full h-[38px]" onClick={handleAddNewPost}>
            <Plus className="w-4 h-4" />
            Thêm bài viết mới
          </button>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Notebook style={{ width: 40, height: 40, color: "#cbd5e1", margin: "0 auto" }} />
            </div>
            <h3 className={styles.emptyTitle}>Không có bài viết nào</h3>
            <p className={styles.emptyDescription}>
              {searchTerm ? "Không tìm thấy bài viết phù hợp với từ khóa tìm kiếm." : "Bắt đầu tạo bài viết đầu tiên của bạn."}
            </p>
            <button className={styles.addButton} onClick={handleAddNewPost}>
              <Plus style={{ width: 15, height: 15 }} />
              Tạo bài viết mới
            </button>
          </div>
        ) : viewMode === "list" ? (
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm mb-5">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold">
                  <th className="p-4 font-semibold text-gray-700 text-center w-12">STT</th>
                  <th className="p-4 font-semibold text-gray-700">Tiêu đề bài viết</th>
                  <th className="p-4 font-semibold text-gray-700">Slug</th>
                  <th className="p-4 font-semibold text-gray-700">Ngày đăng</th>
                  <th className="p-4 font-semibold text-gray-700">Trạng thái</th>
                  <th className="p-4 font-semibold text-gray-700 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {filteredPosts.map((post, idx) => {
                  const canDrag = !post.isFeatured && !post.isDraft && featuredPosts.length < MAX_FEATURED;
                  const sequenceNumber = (currentPage - 1) * limit + idx + 1;
                  return (
                    <PostListRow
                      key={post.id}
                      post={post}
                      index={sequenceNumber}
                      canDrag={canDrag}
                      onDragStart={(e) => handleListDragStart(e, post.id)}
                      onDragEnd={handleDragEnd}
                      onDeleteClick={() => handleDelete(post.id)}
                      onToggleStatus={handleToggleStatus}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {filteredPosts.map((post) => {
              const canDrag = !post.isFeatured && !post.isDraft && featuredPosts.length < MAX_FEATURED;
              return (
                <div
                  key={post.slug}
                  draggable={canDrag}
                  onDragStart={canDrag ? (e) => handleListDragStart(e, post.id) : undefined}
                  onDragEnd={handleDragEnd}
                  className={`relative ${canDrag ? "cursor-grab active:cursor-grabbing" : ""}`}
                >
                  {/* Drag badge */}
                  {canDrag && (
                    <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-amber-400 text-white text-xs rounded font-semibold pointer-events-none select-none">
                      ⠿ Kéo lên
                    </div>
                  )}
                  <DashboardPostCard
                    post={post}
                    onDeleteClick={() => handleDelete(post.id)}
                    onToggleStatus={handleToggleStatus}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Info & Controls */}
        {totalPages > 1 && (
          <div className={styles.paginationSection}>
            <div className={styles.paginationInfo}>
              <span>Trang {currentPage} / {totalPages}</span>
              <span>•</span>
              <span>{posts.length} bài viết trên trang này</span>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps<{
  initialPosts: PostDetail[];
  totalPages: number;
  initialStats: { total: number; published: number; drafts: number };
}> = async () => {
  try {
    await db.connectDb();

    // Lấy tất cả bài viết bao gồm cả nháp cho dashboard
    const totalPosts = await Post.countDocuments({});
    const totalPages = Math.ceil(totalPosts / limit);
    
    // Sử dụng readPostsFromDb với includeDrafts=true cho admin dashboard
    const posts = await readPostsFromDb(limit, 0, 0, true, true);
    const formattedPosts = formatPosts(posts);

    // Thống kê bài viết ban đầu (bao gồm cả direct posts)
    const initialStats = await countPostsStatsFromDb(true);

    return {
      props: {
        initialPosts: formattedPosts,
        totalPages,
        initialStats,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default Posts;
