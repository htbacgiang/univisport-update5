import axios from "axios";
import { getSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  GripVertical,
  Image as ImageIcon,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";

const EMPTY_FORM = {
  type: "local",
  title: "",
  src: "",
  fbUrl: "",
  poster: "",
  isVisible: true,
};

const buildCaptureTimes = (duration) => {
  if (!Number.isFinite(duration) || duration <= 0) return [0, 0, 0, 0, 0];

  const maxTime = Math.max(duration - 0.08, 0);
  return [0.08, 0.24, 0.4, 0.56, 0.72].map((position) =>
    Math.min(Math.max(duration * position, 0), maxTime)
  );
};

const getVideoUrl = (video) =>
  video.type === "facebook" ? video.fbUrl : video.src;

const normalizeList = (items = []) =>
  items.map((item) => ({ ...item, id: item._id || item.id }));

export default function VideoFeedbackAdminPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generatingPoster, setGeneratingPoster] = useState(false);
  const [posterOptions, setPosterOptions] = useState([]);
  const fileInputRef = useRef(null);
  const posterVideoRef = useRef(null);
  const lastPosterSourceRef = useRef("");
  const posterGenerationRef = useRef(0);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/video-feedback?admin=true");
      setVideos(normalizeList(data.videos));
      setOrderChanged(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể tải danh sách video.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const openAdd = () => {
    setEditTarget(null);
    lastPosterSourceRef.current = "";
    setPosterOptions([]);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (video) => {
    setEditTarget(video);
    lastPosterSourceRef.current = video.src || "";
    setForm({
      type: video.type || "local",
      title: video.title || "",
      src: video.src || "",
      fbUrl: video.fbUrl || "",
      poster: video.poster || "",
      isVisible: video.isVisible !== false,
    });
    setPosterOptions([]);
    setShowModal(true);
  };

  const closeModal = () => {
    posterGenerationRef.current += 1;
    lastPosterSourceRef.current = "";
    setGeneratingPoster(false);
    setPosterOptions([]);
    setShowModal(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  };

  const generatePosterOptionsFromVideo = useCallback((videoSrc, options = {}) => {
    const source = String(videoSrc || "").trim();
    const silent = options.silent === true;

    if (!source) {
      if (!silent) toast.error("Vui lòng nhập đường dẫn video trước.");
      return;
    }

    const generationId = posterGenerationRef.current + 1;
    posterGenerationRef.current = generationId;
    setGeneratingPoster(true);

    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    let timeoutId;
    let settled = false;
    let captureTimes = [];
    const frames = [];

    const cleanup = () => {
      clearTimeout(timeoutId);
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("seeked", captureFrame);
      video.removeEventListener("error", fail);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };

    const finish = () => {
      if (settled) return false;
      settled = true;
      cleanup();
      if (posterGenerationRef.current === generationId) {
        setGeneratingPoster(false);
      }
      return true;
    };

    const fail = () => {
      if (!finish()) return;
      if (!silent) {
        toast.error("Không thể tạo ảnh từ video này. Hãy dùng video cùng domain hoặc tải poster thủ công.");
      }
    };

    function seekNextFrame() {
      const nextTime = captureTimes[frames.length] || 0;
      try {
        if (
          video.readyState >= 2 &&
          (nextTime === 0 || Math.abs(video.currentTime - nextTime) < 0.01)
        ) {
          requestAnimationFrame(captureFrame);
        } else {
          video.currentTime = nextTime;
        }
      } catch {
        fail();
      }
    }

    function captureFrame() {
      if (settled) return;

      try {
        const naturalWidth = video.videoWidth || 480;
        const naturalHeight = video.videoHeight || 270;
        const width = Math.min(480, naturalWidth);
        const height = Math.max(
          1,
          Math.round((naturalHeight / naturalWidth) * width)
        );
        const context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        frames.push({
          id: `${generationId}-${frames.length}`,
          src: canvas.toDataURL("image/jpeg", 0.78),
          time: video.currentTime,
        });

        if (frames.length < 5) {
          seekNextFrame();
          return;
        }

        const isLatestGeneration = posterGenerationRef.current === generationId;
        if (!finish() || !isLatestGeneration) return;

        setPosterOptions(frames);
        setForm((current) => {
          if (current.src.trim() !== source || current.poster) return current;
          return { ...current, poster: frames[0]?.src || "" };
        });
        if (!silent) toast.success("Đã tạo 5 ảnh từ video.");
      } catch {
        fail();
      }
    }

    function handleMetadata() {
      captureTimes = buildCaptureTimes(video.duration);
      seekNextFrame();
    }

    function handleLoadedData() {
      if (captureTimes[0] === 0 && frames.length === 0) captureFrame();
    }

    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("seeked", captureFrame);
    video.addEventListener("error", fail);
    timeoutId = setTimeout(fail, 8000);
    video.src = source;
    video.load();
  }, []);

  const capturePosterFromCurrentFrame = useCallback(() => {
    const video = posterVideoRef.current;
    const source = form.src.trim();

    if (!source) {
      toast.error("Vui lòng nhập đường dẫn video trước.");
      return;
    }
    if (!video || !video.videoWidth || !video.videoHeight) {
      toast.error("Vui lòng đợi video tải xong.");
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const width = Math.min(480, video.videoWidth);
      const height = Math.max(1, Math.round((video.videoHeight / video.videoWidth) * width));
      const context = canvas.getContext("2d");

      video.pause();
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const poster = canvas.toDataURL("image/jpeg", 0.78);
      setForm((current) =>
        current.src.trim() === source ? { ...current, poster } : current
      );
      toast.success("Đã chọn frame hiện tại.");
    } catch {
      toast.error("Không thể chọn frame này. Hãy dùng video cùng domain hoặc tải poster thủ công.");
    }
  }, [form.src]);

  useEffect(() => {
    if (!showModal || form.type !== "local") return;

    const source = form.src.trim();
    if (!source || lastPosterSourceRef.current === source) return;

    const timeoutId = setTimeout(() => {
      lastPosterSourceRef.current = source;
      setPosterOptions([]);
      generatePosterOptionsFromVideo(source, { silent: true });
    }, 650);

    return () => clearTimeout(timeoutId);
  }, [form.src, form.type, generatePosterOptionsFromVideo, showModal]);

  const submitForm = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề video.");
      return;
    }
    if (form.type === "local" && !form.src.trim()) {
      toast.error("Vui lòng nhập đường dẫn video.");
      return;
    }
    if (form.type === "facebook" && !form.fbUrl.trim()) {
      toast.error("Vui lòng nhập link Facebook.");
      return;
    }

    setSaving(true);
    try {
      if (editTarget) {
        const { data } = await axios.put(
          `/api/video-feedback?id=${editTarget._id}`,
          form
        );
        setVideos((current) =>
          current.map((item) =>
            item._id === editTarget._id ? { ...data.video, id: data.video._id } : item
          )
        );
        toast.success("Đã cập nhật video.");
      } else {
        const { data } = await axios.post("/api/video-feedback", form);
        setVideos((current) => [...current, { ...data.video, id: data.video._id }]);
        toast.success("Đã thêm video.");
      }
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể lưu video.");
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (video) => {
    const nextVisible = !video.isVisible;
    const previousVideos = videos;
    setVideos((current) =>
      current.map((item) =>
        item._id === video._id ? { ...item, isVisible: nextVisible } : item
      )
    );

    try {
      await axios.put(`/api/video-feedback?id=${video._id}`, {
        ...video,
        isVisible: nextVisible,
      });
      toast.success(nextVisible ? "Đã hiện video." : "Đã ẩn video.");
    } catch (error) {
      setVideos(previousVideos);
      toast.error(error.response?.data?.error || "Không thể cập nhật video.");
    }
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put("/api/video-feedback?action=reorder", {
        orderedIds: videos.map((video) => video._id),
      });
      setVideos(normalizeList(data.videos));
      setOrderChanged(false);
      toast.success("Đã lưu thứ tự video.");
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể lưu thứ tự.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const { data } = await axios.delete(
        `/api/video-feedback?id=${deleteTarget._id}`
      );
      setVideos(normalizeList(data.videos));
      setOrderChanged(false);
      toast.success("Đã xóa video.");
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể xóa video.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const uploadPoster = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const { data } = await axios.post("/api/upload", body);
      if (data.links?.[0]) {
        setForm((current) => ({ ...current, poster: data.links[0] }));
        toast.success("Đã tải poster lên.");
      }
    } catch {
      toast.error("Tải poster thất bại.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <AdminLayout title="Quản lý Video Feedback">
      <div className="min-h-screen space-y-5 bg-[#f8fafc] p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Video className="h-5 w-5 text-[#105d97]" />
            <div>
              <h1 className="m-0 text-[1.375rem] font-bold text-[#0f172a]">
                Video Feedback
              </h1>
              <p className="text-xs text-[#64748b]">
                Quản lý video hiển thị trong section Video Feedback trang chủ.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {orderChanged && (
              <button
                type="button"
                onClick={saveOrder}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#105d97] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d4a7a] disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Đang lưu..." : "Lưu thứ tự"}
              </button>
            )}
            <button
              type="button"
              onClick={openAdd}
              className="flex items-center gap-2 rounded-lg bg-[#16a34a] px-4 py-2 text-sm font-medium text-white hover:bg-[#15803d]"
            >
              <Plus className="h-4 w-4" />
              Thêm video
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <GripVertical className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Kéo thả để đổi thứ tự video, sau đó bấm <strong>Lưu thứ tự</strong>.
            Video bị ẩn vẫn được giữ trong trang quản trị.
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-6 w-6 animate-spin text-[#105d97]" />
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-[#64748b]">
              <Video className="h-12 w-12 text-[#cbd5e1]" />
              <p className="text-sm">Chưa có video feedback nào.</p>
              <button
                type="button"
                onClick={openAdd}
                className="flex items-center gap-2 rounded-lg bg-[#105d97] px-4 py-2 text-sm font-medium text-white"
              >
                <Plus className="h-4 w-4" />
                Thêm video đầu tiên
              </button>
            </div>
          ) : (
            <ReactSortable
              list={videos}
              setList={(nextVideos) => {
                const currentOrder = videos.map((video) => video._id).join(",");
                const nextOrder = nextVideos.map((video) => video._id).join(",");
                setVideos(nextVideos);
                if (currentOrder !== nextOrder) setOrderChanged(true);
              }}
              handle=".video-feedback-drag-handle"
              animation={150}
            >
              {videos.map((video, index) => (
                <div
                  key={video._id}
                  className={`grid grid-cols-[32px_72px_1fr_auto] items-center gap-3 border-b border-[#f1f5f9] p-3 last:border-0 md:gap-4 md:p-4 ${
                    video.isVisible ? "hover:bg-[#f8fafc]" : "bg-gray-50 opacity-60"
                  }`}
                >
                  <button
                    type="button"
                    className="video-feedback-drag-handle cursor-grab text-[#94a3b8] active:cursor-grabbing"
                    aria-label={`Di chuyển video ${index + 1}`}
                  >
                    <GripVertical className="h-5 w-5" />
                  </button>

                  <div className="relative flex h-24 w-16 items-center justify-center overflow-hidden rounded-lg border border-[#e2e8f0] bg-gray-100">
                    {video.poster ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={video.poster}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Video className="h-5 w-5 text-[#94a3b8]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold text-[#0f172a]">
                      {video.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#64748b]">
                      {getVideoUrl(video) || "Chưa có đường dẫn video"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                        Video {index + 1}
                      </span>
                      <span className="rounded-full bg-purple-50 px-2 py-0.5 font-medium text-purple-700">
                        {video.type === "facebook" ? "Facebook" : "Local"}
                      </span>
                      {video.isVisible === false && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-500">
                          Đang ẩn
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleVisible(video)}
                      title={video.isVisible ? "Ẩn video" : "Hiện video"}
                      className={`rounded-lg p-2 ${
                        video.isVisible
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      {video.isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(video)}
                      title="Chỉnh sửa"
                      className="rounded-lg p-2 text-[#105d97] hover:bg-blue-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(video)}
                      title="Xóa video"
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </ReactSortable>
          )}
        </div>

        {!loading && videos.length > 0 && (
          <p className="text-right text-xs text-[#94a3b8]">
            {videos.filter((video) => video.isVisible).length}/{videos.length} video đang hiển thị
          </p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-base font-bold text-[#0f172a]">
                {editTarget ? "Chỉnh sửa video" : "Thêm video mới"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1.5 text-[#64748b] hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={submitForm}
              className="flex-1 space-y-4 overflow-y-auto px-6 py-5"
            >
              <Field label="Kiểu video">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "local", label: "Local / URL MP4" },
                    { value: "facebook", label: "Facebook" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setPosterOptions([]);
                        setForm((current) => ({ ...current, type: option.value }));
                      }}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                        form.type === option.value
                          ? "border-[#105d97] bg-blue-50 text-[#105d97]"
                          : "border-[#e2e8f0] text-[#64748b] hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Tiêu đề *">
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#105d97] focus:outline-none focus:ring-2 focus:ring-[#105d97]/20"
                  placeholder="Nhập tiêu đề video"
                />
              </Field>

              {form.type === "facebook" ? (
                <Field label="Link Facebook *">
                  <input
                    value={form.fbUrl}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        fbUrl: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#105d97] focus:outline-none focus:ring-2 focus:ring-[#105d97]/20"
                    placeholder="https://www.facebook.com/reel/..."
                  />
                </Field>
              ) : (
                <Field label="Đường dẫn video *">
                  <input
                    value={form.src}
                    onChange={(event) => {
                      setPosterOptions([]);
                      setForm((current) => ({
                        ...current,
                        src: event.target.value,
                        poster: "",
                      }));
                    }}
                    className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#105d97] focus:outline-none focus:ring-2 focus:ring-[#105d97]/20"
                    placeholder="/video-univi.mp4 hoặc https://..."
                  />
                </Field>
              )}

              <Field label="Poster / ảnh đại diện">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  onChange={uploadPoster}
                  className="hidden"
                />
                <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
                  <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-lg border border-[#e2e8f0] bg-gray-100">
                    {form.poster ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.poster}
                        alt="Xem trước poster video"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-center text-xs text-[#94a3b8]">
                        <Video className="h-6 w-6" />
                        <span>Chưa chọn poster</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading || generatingPoster}
                      className="flex items-center gap-2 rounded-lg border border-[#105d97] px-3 py-2 text-xs font-medium text-[#105d97] hover:bg-blue-50 disabled:opacity-60"
                    >
                      {uploading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {uploading ? "Đang tải..." : "Tải poster lên"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const source = form.src.trim();
                        lastPosterSourceRef.current = source;
                        setPosterOptions([]);
                        generatePosterOptionsFromVideo(source);
                      }}
                      disabled={
                        form.type !== "local" ||
                        !form.src.trim() ||
                        uploading ||
                        generatingPoster
                      }
                      className="flex items-center gap-2 rounded-lg border border-[#16a34a] px-3 py-2 text-xs font-medium text-[#15803d] hover:bg-green-50 disabled:border-gray-200 disabled:text-gray-400 disabled:opacity-70"
                    >
                      {generatingPoster ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <ImageIcon className="h-4 w-4" />
                      )}
                      {generatingPoster ? "Đang tạo..." : "Tạo 5 ảnh từ video"}
                    </button>
                    {form.type === "local" && posterOptions.length > 0 && (
                      <div className="grid grid-cols-5 gap-1.5">
                        {posterOptions.map((option, index) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                poster: option.src,
                              }))
                            }
                            className={`relative aspect-[9/14] overflow-hidden rounded-md border-2 bg-gray-100 ${
                              form.poster === option.src
                                ? "border-[#16a34a]"
                                : "border-transparent hover:border-[#105d97]/40"
                            }`}
                            title={`Chọn ảnh ${index + 1}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={option.src}
                              alt={`Poster gợi ý ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <span className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-[10px] font-semibold text-white">
                              {index + 1}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    {form.type === "local" && form.src.trim() && (
                      <div className="rounded-lg border border-[#e2e8f0] bg-gray-50 p-2">
                        <video
                          key={form.src}
                          ref={posterVideoRef}
                          src={form.src}
                          poster={form.poster || undefined}
                          controls
                          playsInline
                          preload="metadata"
                          crossOrigin="anonymous"
                          className="block max-h-56 w-full rounded-md bg-black object-contain"
                        />
                        <button
                          type="button"
                          onClick={capturePosterFromCurrentFrame}
                          disabled={uploading || generatingPoster}
                          className="mt-2 flex items-center gap-2 rounded-lg border border-[#105d97] px-3 py-2 text-xs font-medium text-[#105d97] hover:bg-blue-50 disabled:opacity-60"
                        >
                          <ImageIcon className="h-4 w-4" />
                          Chọn frame hiện tại
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                      <input
                        value={form.poster}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            poster: event.target.value,
                          }))
                        }
                        className="min-w-0 flex-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-xs focus:border-[#105d97] focus:outline-none"
                        placeholder="/images/... hoặc https://..."
                      />
                    </div>
                  </div>
                </div>
              </Field>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#e2e8f0] p-3">
                <input
                  type="checkbox"
                  checked={form.isVisible}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isVisible: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-[#105d97]"
                />
                <span className="text-sm font-medium text-[#374151]">
                  Hiển thị video này trên trang chủ
                </span>
              </label>

              <div className="flex justify-end gap-2 border-t border-[#e2e8f0] pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-[#64748b] hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading || generatingPoster}
                  className="rounded-lg bg-[#105d97] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d4a7a] disabled:opacity-60"
                >
                  {saving ? "Đang lưu..." : editTarget ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">
                  Xác nhận xóa video
                </h3>
                <p className="mt-1 text-xs text-[#64748b]">
                  &quot;{deleteTarget.title}&quot; sẽ bị xóa vĩnh viễn.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-[#64748b]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[#374151]">{label}</label>
      {children}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session || session.user?.role !== "admin") {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
}
