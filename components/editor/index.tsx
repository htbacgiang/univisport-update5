import { ChangeEventHandler, FC, useEffect, useState, useCallback, useRef } from "react";
import { useEditor, EditorContent, getMarkRange, Range } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { CustomImage } from "./CustomImage";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";

import ToolBar from "./ToolBar";
import EditLink from "./Link/EditLink";
import EditImage from "./EditImage";
import EditCloudinaryVideo from "./EditCloudinaryVideo";
import GalleryModal, { ImageSelectionResult } from "./GalleryModal";
import MultiImageGalleryModal from "./GalleryModal/MultiImageGalleryModal";
import R2MultiGalleryModal from "./GalleryModal/R2MultiGalleryModal";
import R2ImageModal, { R2ImageSelectionResult } from "./R2ImageModal";
import axios from "axios";
import SEOForm, { SeoResult } from "./SeoForm";
import ThumbnailSelector from "./ThumbnailSelector";
import WordCount from "./WordCount";
import { toast } from "react-toastify";
import FAQEditor, { FAQ } from "./FAQEditor";
import AuthorSelector from "./AuthorSelector";
import { FacebookReel } from "./FacebookReel";
import { CloudinaryVideo } from "./CloudinaryVideo";
import { AdBanner } from "./AdBanner";
import { EmbedComponent } from "./EmbedComponent";
import { GalleryImage, ImageGallery } from "./ImageGallery";
import { InternalLink } from "./InternalLink";

export interface FinalPost extends SeoResult {
  id?: string;
  title: string;
  content: string;
  thumbnail?: File | string;
  focusKeyword: string;
  isDraft?: boolean;
  isFeatured?: boolean;
  isDirectPost?: boolean;
  faqs?: FAQ[];
  postAuthorId?: string;
  keywords?: string;
}

interface Props {
  initialValue?: FinalPost;
  btnTitle?: string;
  busy?: boolean;
  onSubmit(post: FinalPost): void;
  defaultFolder?: string;
}

const Editor: FC<Props> = ({
  initialValue,
  btnTitle = "Đăng bài",
  busy = false,
  onSubmit,
  defaultFolder = "",
}): JSX.Element => {
  const [selectionRange, setSelectionRange] = useState<Range>();
  const [showGallery, setShowGallery] = useState(false);
  const [showR2Modal, setShowR2Modal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showR2GalleryModal, setShowR2GalleryModal] = useState(false);

  // Lưu vị trí con trỏ chuột trong editor để chèn ảnh/media đúng vị trí
  const lastSelectionRef = useRef<{ from: number; to: number } | null>(null);
  const [editingGallery, setEditingGallery] = useState<{
    images: GalleryImage[];
    getPos: () => number;
    title?: string;
  } | null>(null);
  // Ref to avoid hoisting issue with useEditor
  const editGalleryCallbackRef = useCallback(
    (images: GalleryImage[], getPos: () => number, title?: string) => {
      setEditingGallery({ images, getPos, title });
    },
    []
  );
  const [uploading, setUploading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isDraft, setIsDraft] = useState(true); // Mặc định là nháp khi tạo mới
  const [isFeatured, setIsFeatured] = useState(false);
  const [isDirectPost, setIsDirectPost] = useState(false); // Mặc định hiển thị 3 cấp
  const [showSidebar, setShowSidebar] = useState(true);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [generatingFaqs, setGeneratingFaqs] = useState(false);

  const handleGenerateAiFaqs = async () => {
    const editorContent = editor ? editor.getHTML() : "";
    const cleanContent = editor ? editor.getText().trim() : "";

    if (!post.title?.trim() && cleanContent.length < 30) {
      toast.warning("Vui lòng nhập tiêu đề hoặc nội dung bài viết trước khi tạo FAQ bằng Gemini AI!");
      return;
    }

    setGeneratingFaqs(true);
    try {
      const { data } = await axios.post("/api/ai/generate", {
        type: "faqs",
        title: post.title || "",
        content: editorContent || cleanContent,
      });

      if (data?.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
        setFaqs(data.faqs);
        toast.success(`Đã tạo ${data.faqs.length} câu hỏi thường gặp bằng Gemini AI thành công!`);
      }
    } catch (err: any) {
      console.error("Lỗi tạo FAQ bằng AI:", err);
      toast.error(err.response?.data?.error || "Không thể tạo FAQ bằng Gemini AI. Vui lòng thử lại!");
    } finally {
      setGeneratingFaqs(false);
    }
  };

  const [postAuthorId, setPostAuthorId] = useState("");
  const [images, setImages] = useState<{ src: string; altText?: string; id?: string }[]>([]);
  const [seoInitialValue, setSeoInitialValue] = useState<SeoResult>();
  const [post, setPost] = useState<FinalPost>({
    title: "",
    content: "",
    meta: "",
    tags: "",
    slug: "",
    category: "", // Giữ để tương thích với database nhưng không sử dụng
    focusKeyword: "",
    keywords: "",
  });

  // Kiểm tra xem có phải đang tạo bài viết mới không
  const isCreatingNewPost = !initialValue?.id;

  // Debug để kiểm tra giá trị
  console.log("Editor debug:", {
    initialValue,
    hasId: !!initialValue?.id,
    isCreatingNewPost,
    btnTitle,
    isDraft,
    postId: post.id
  });

  const fetchImages = async () => {
    try {
      const { data } = await axios("/api/image");
      setImages(data.images || []);
    } catch (error: any) {
      setImages([]);
    }
  };

  const handleImageUpload = async (imageData: File | { file: File; altText: string }) => {
    setUploading(true);

    try {
      const formData = new FormData();
      let fileToUpload: File;
      let altText = "";

      // Kiểm tra xem có phải là object chứa file và altText không
      if (typeof imageData === 'object' && 'file' in imageData && 'altText' in imageData) {
        fileToUpload = imageData.file;
        altText = imageData.altText || "";
      } else {
        // Fallback cho trường hợp chỉ có file
        fileToUpload = imageData as File;
        altText = "";
      }

      formData.append("image", fileToUpload);
      formData.append("altText", altText);

      const { data } = await axios.post("/api/image", formData);

      // Thêm ảnh mới vào danh sách
      const newImage = {
        src: data.src,
        altText: data.altText || altText,
        id: data.id || data._id
      };
      setImages([newImage, ...images]);

      // Refresh lại danh sách ảnh từ server để đảm bảo đồng bộ
      await fetchImages();

      toast.success("Upload ảnh thành công!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Không thể upload ảnh. Vui lòng thử lại!";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      InternalLink.configure({
        autolink: false,
        linkOnPaste: false,
        openOnClick: false,
        HTMLAttributes: {
          target: "",
        },
      }),
      Placeholder.configure({
        placeholder: "Viết bài nhớ chuẩn SEO",
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: "w-full aspect-video",
        },
      }),
      CustomImage.configure({
        HTMLAttributes: {
          class: "mx-auto",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class:
            "tiptap-table border-collapse border border-gray-300 dark:border-gray-600",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      FacebookReel,
      CloudinaryVideo,
      AdBanner,
      EmbedComponent,
      ImageGallery.configure({
        onEditRequest: editGalleryCallbackRef,
      }),
    ],

    editorProps: {
      handleClick: (view: any, pos: number) => {
        const { state } = view;
        const selectionRange = getMarkRange(
          state.doc.resolve(pos),
          state.schema.marks.link
        );
        if (selectionRange) setSelectionRange(selectionRange);
      },
      attributes: {
        class:
          "blog prose prose-lg focus:outline-none dark:prose-invert max-w-full mx-auto h-full",
      },
    },
  });

  // Tự động ghi nhớ vị trí con trỏ chuột khi đang gõ/click trong editor
  useEffect(() => {
    if (!editor) return;

    const saveSelection = () => {
      // Chỉ lưu vị trí khi các modal chọn ảnh đang đóng
      if (!showR2Modal && !showGallery && !showR2GalleryModal && !showImageGallery) {
        const { from, to } = editor.state.selection;
        lastSelectionRef.current = { from, to };
      }
    };

    editor.on("selectionUpdate", saveSelection);
    editor.on("focus", saveSelection);
    return () => {
      editor.off("selectionUpdate", saveSelection);
      editor.off("focus", saveSelection);
    };
  }, [editor, showR2Modal, showGallery, showR2GalleryModal, showImageGallery]);

  const openR2Modal = () => {
    if (editor) {
      const { from, to } = editor.state.selection;
      lastSelectionRef.current = { from, to };
    }
    setShowR2Modal(true);
  };

  const openGalleryModal = () => {
    if (editor) {
      const { from, to } = editor.state.selection;
      lastSelectionRef.current = { from, to };
    }
    setShowGallery(true);
  };

  const openR2GalleryModal = () => {
    if (editor) {
      const { from, to } = editor.state.selection;
      lastSelectionRef.current = { from, to };
    }
    setShowR2GalleryModal(true);
  };

  const openImageGalleryModal = () => {
    if (editor) {
      const { from, to } = editor.state.selection;
      lastSelectionRef.current = { from, to };
    }
    setShowImageGallery(true);
  };

  const handleImageSelection = (result: ImageSelectionResult) => {
    if (!editor) return;
    const target = lastSelectionRef.current;

    if (target && typeof target.from === "number") {
      try {
        const docSize = editor.state.doc.content.size;
        const validFrom = Math.min(Math.max(0, target.from), docSize);
        const validTo = Math.min(Math.max(0, target.to), docSize);
        editor.commands.setTextSelection({ from: validFrom, to: validTo });
      } catch (err) {
        console.warn("Không thể khôi phục vị trí con trỏ:", err);
      }
    }

    (editor.chain().focus() as any)
      .setImage({
        src: result.src,
        alt: result.altText,
        caption: result.caption,
        width: "100%",
        aspectRatio: "auto",
        alignment: "center",
        pos: target?.from,
      })
      .run();
  };

  const handleR2ImageSelection = (result: R2ImageSelectionResult) => {
    if (!editor) return;
    const target = lastSelectionRef.current;

    // Phục hồi lại vị trí con trỏ đã lưu trước khi mở modal
    if (target && typeof target.from === "number") {
      try {
        const docSize = editor.state.doc.content.size;
        const validFrom = Math.min(Math.max(0, target.from), docSize);
        const validTo = Math.min(Math.max(0, target.to), docSize);
        editor.commands.setTextSelection({ from: validFrom, to: validTo });
      } catch (err) {
        console.warn("Không thể khôi phục vị trí con trỏ:", err);
      }
    }

    (editor.chain().focus() as any)
      .setImage({
        src: result.src,
        alt: result.altText || "",
        caption: result.caption || "",
        width: result.width || "100%",
        aspectRatio: result.aspectRatio || "auto",
        alignment: result.alignment || "center",
        objectFit: result.objectFit || "cover",
        objectPosition: result.objectPosition || "50% 50%",
        pos: target?.from,
      })
      .run();
  };

  const handleImageGallerySelection = (galleryImages: GalleryImage[]) => {
    if (!editor || galleryImages.length < 2) return;
    editor
      .chain()
      .focus()
      .setImageGallery({
        images: galleryImages,
        title: "Thư viện hình ảnh",
      })
      .run();
  };

  const handleR2GallerySelection = (galleryImages: GalleryImage[], title?: string) => {
    if (!editor || galleryImages.length === 0) return;
    editor
      .chain()
      .focus()
      .setImageGallery({
        images: galleryImages,
        title: title || "Thư viện hình ảnh",
      })
      .run();
  };

  const handleEditGalleryRequest = editGalleryCallbackRef;

  const handleUpdateGallery = (updatedImages: GalleryImage[], title?: string) => {
    if (!editor || !editingGallery) return;
    const pos = editingGallery.getPos();
    editor
      .chain()
      .focus()
      .command(({ tr }) => {
        tr.setNodeMarkup(pos, undefined, {
          images: updatedImages,
          title: title || editingGallery.title || "Thư viện hình ảnh",
        });
        return true;
      })
      .run();
    setEditingGallery(null);
  };

  const handleSubmit = () => {
    if (!editor) return;
    onSubmit({ ...post, content: editor.getHTML(), isDraft, isFeatured, isDirectPost, faqs, postAuthorId });
  };

  const saveDraft = useCallback(async () => {
    if (!editor || !isCreatingNewPost) return;

    setSavingDraft(true);
    try {
      const thumbnailAtRequest = post.thumbnail;
      const formData = new FormData();
      formData.append("title", post.title || "Nháp bài viết");
      formData.append("content", editor.getHTML());
      formData.append("meta", post.meta || "");
      formData.append("slug", post.slug || `draft-${Date.now()}`);
      formData.append("category", post.category || "");

      // Xử lý tags an toàn hơn
      let tagsArray: string[] = [];
      if (post.tags) {
        if (typeof post.tags === 'string') {
          tagsArray = post.tags.split(',').filter((tag: string) => tag.trim() !== '');
        } else if (Array.isArray(post.tags)) {
          tagsArray = (post.tags as any[]).filter((tag: any) => typeof tag === 'string');
        }
      }
      // Đảm bảo luôn gửi một mảng hợp lệ
      formData.append("tags", JSON.stringify(tagsArray || []));
      formData.append("isDirectPost", String(isDirectPost));
      formData.append("faqs", JSON.stringify(faqs));
      formData.append("postAuthorId", postAuthorId);
      formData.append("keywords", post.keywords || "");

      if (post.id) {
        formData.append("postId", post.id);
      }

      if (post.thumbnail instanceof File) {
        formData.append("thumbnail", post.thumbnail);
      } else if (typeof post.thumbnail === 'string' && post.thumbnail) {
        // Nếu thumbnail là URL từ thư viện, gửi URL này
        formData.append("thumbnailUrl", post.thumbnail);
      }

      const { data } = await axios.post("/api/posts/draft", formData);
      const savedThumbnailUrl = data.post?.thumbnail?.url;

      setPost((prev) => ({
        ...prev,
        ...(!prev.id && data.post?._id ? { id: data.post._id } : {}),
        ...(savedThumbnailUrl && prev.thumbnail === thumbnailAtRequest
          ? { thumbnail: savedThumbnailUrl }
          : {}),
      }));

      if (!post.id && data.post?._id) {
        setIsDraft(true);
      }

      // Toast thành công
      toast.success("Nháp bài viết đã được lưu thành công!");
    } catch (error) {
      console.error("Lỗi lưu nháp:", error);
      toast.error("Có lỗi xảy ra khi lưu nháp bài viết!");
    } finally {
      setSavingDraft(false);
    }
  }, [editor, post, isCreatingNewPost, faqs, isDirectPost, postAuthorId]);

  const publishDraft = useCallback(async () => {
    if (!post.id) {
      return;
    }

    setPublishing(true);
    try {
      const { data } = await axios.put("/api/posts/draft", {
        postId: post.id,
        isDraft: false
      });

      // Cập nhật trạng thái local
      setIsDraft(false);

      // Toast thành công
      toast.success("Bài viết đã được công khai thành công!");

      // Chuyển hướng sau khi hiển thị toast
      setTimeout(() => {
        window.location.href = "/dashboard/bai-viet";
      }, 1500);
    } catch (error: any) {
      console.error("Lỗi công khai bài viết:", error);
      toast.error("Có lỗi xảy ra khi công khai bài viết!");
    } finally {
      setPublishing(false);
    }
  }, [post.id]);

  const convertToDraft = useCallback(async () => {
    if (!post.id) {
      return;
    }

    setSavingDraft(true);
    try {
      const { data } = await axios.put("/api/posts/draft", {
        postId: post.id,
        isDraft: true
      });

      // Cập nhật trạng thái local
      setIsDraft(true);

      // Toast thành công
      toast.success("Bài viết đã được chuyển về lưu nháp!");
    } catch (error: any) {
      console.error("Lỗi chuyển về nháp:", error);
      toast.error("Có lỗi xảy ra khi chuyển về nháp!");
    } finally {
      setSavingDraft(false);
    }
  }, [post.id]);

  // Tự động lưu nháp mỗi 30 giây cho bài viết nháp
  useEffect(() => {
    if (!isDraft || !post.id) return;

    const autoSaveInterval = setInterval(() => {
      if (editor && (post.title || editor.getHTML().trim())) {
        // Gọi API cập nhật bài viết nháp
        const updateDraft = async () => {
          try {
            const thumbnailAtRequest = post.thumbnail;
            const formData = new FormData();
            formData.append("title", post.title || "Nháp bài viết");
            formData.append("content", editor.getHTML());
            formData.append("meta", post.meta || "");
            formData.append("slug", post.slug || `draft-${Date.now()}`);
            formData.append("category", post.category || "");

            let tagsArray: string[] = [];
            if (post.tags) {
              if (typeof post.tags === 'string') {
                tagsArray = post.tags.split(',').filter((tag: string) => tag.trim() !== '');
              } else if (Array.isArray(post.tags)) {
                tagsArray = (post.tags as any[]).filter((tag: any) => typeof tag === 'string');
              }
            }
            formData.append("tags", JSON.stringify(tagsArray || []));
            formData.append("postId", post.id || "");
            formData.append("isDirectPost", String(isDirectPost));
            formData.append("faqs", JSON.stringify(faqs));
            formData.append("postAuthorId", postAuthorId);
            formData.append("keywords", post.keywords || "");

            if (post.thumbnail instanceof File) {
              formData.append("thumbnail", post.thumbnail);
            } else if (typeof post.thumbnail === 'string' && post.thumbnail) {
              formData.append("thumbnailUrl", post.thumbnail);
            }

            const { data } = await axios.post("/api/posts/draft", formData);
            const savedThumbnailUrl = data.post?.thumbnail?.url;

            if (savedThumbnailUrl && thumbnailAtRequest instanceof File) {
              setPost((prev) =>
                prev.thumbnail === thumbnailAtRequest
                  ? { ...prev, thumbnail: savedThumbnailUrl }
                  : prev
              );
            }
          } catch (error) {
            console.error("Lỗi tự động lưu nháp:", error);
          }
        };

        updateDraft();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [editor, post, isDraft, faqs, isDirectPost, postAuthorId]);





  const updateTitle: ChangeEventHandler<HTMLInputElement> = ({ target }) =>
    setPost({ ...post, title: target.value });

  const updateKeywords: ChangeEventHandler<HTMLInputElement> = ({ target }) =>
    setPost({ ...post, keywords: target.value });

  const updateSeoValue = (result: SeoResult) => setPost({ ...post, ...result });

  const updateThumbnail = (thumb: File | string) =>
    setPost((prev) => ({ ...prev, thumbnail: thumb }));

  useEffect(() => {
    if (editor && selectionRange) {
      editor.commands.setTextSelection(selectionRange);
    }
  }, [editor, selectionRange]);

  useEffect(() => {
    if (!editor) return;

    const refreshVideoRatios = () => {
      const videos = Array.from(editor.view.dom.querySelectorAll("video[data-cloudinary-video]"));
      videos.forEach((video) => {
        const element = video as HTMLVideoElement;
        if (element.dataset.ratioListener !== "true") {
          element.addEventListener("loadedmetadata", handleMetadata);
          element.dataset.ratioListener = "true";
        }
        const wrapper = element.closest(".cloudinary-video-embed") as HTMLElement | null;
        if (!wrapper || !element.videoWidth || !element.videoHeight) return;

        const isSquare = Math.abs(element.videoWidth - element.videoHeight) / Math.max(element.videoWidth, element.videoHeight) < 0.12;
        const aspectRatio = isSquare ? "square" : element.videoHeight > element.videoWidth ? "vertical" : "horizontal";
        const aspectValue = aspectRatio === "square" ? "1 / 1" : aspectRatio === "vertical" ? "9 / 16" : "16 / 9";
        const maxWidth = aspectRatio === "vertical" ? "420px" : aspectRatio === "square" ? "640px" : "100%";

        wrapper.dataset.aspectRatio = aspectRatio;
        wrapper.style.aspectRatio = aspectValue;
        wrapper.style.maxWidth = maxWidth;
      });
    };

    const handleMetadata = () => refreshVideoRatios();
    const videos = Array.from(editor.view.dom.querySelectorAll("video[data-cloudinary-video]"));
    videos.forEach((video) => {
      if ((video as HTMLVideoElement).readyState >= 1) handleMetadata();
    });
    editor.on("update", refreshVideoRatios);
    refreshVideoRatios();

    return () => {
      videos.forEach((video) => video.removeEventListener("loadedmetadata", handleMetadata));
      editor.off("update", refreshVideoRatios);
    };
  }, [editor, initialValue?.content]);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (initialValue) {
      setPost({ ...initialValue });
      editor?.commands.setContent(initialValue.content);

      const { meta, slug, tags, category, focusKeyword } = initialValue;
      setSeoInitialValue({ meta, slug, tags, category: category || "", focusKeyword });

      // Cập nhật trạng thái nháp từ initialValue
      setIsDraft(initialValue.isDraft ?? true);
      setIsFeatured(initialValue.isFeatured ?? false);
      setIsDirectPost(initialValue.isDirectPost ?? false);
      setFaqs(initialValue.faqs || []);
      setPostAuthorId(initialValue.postAuthorId || "");
    }
  }, [initialValue, editor]);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 transition-all duration-300 relative">
        {/* Content - Left Main */}
        <div className={`flex flex-col gap-6 min-w-0 transition-all duration-300 ${showSidebar ? "w-full lg:w-[70%]" : "w-full lg:w-[calc(100%-3.5rem)]"}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Nội dung bài viết *</h2>
              <div className="flex items-center gap-3">
                {(isCreatingNewPost || (!isDraft && post.id)) && (
                  <button
                    onClick={isCreatingNewPost ? saveDraft : convertToDraft}
                    disabled={savingDraft || publishing}
                    className={`flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium text-sm ${(savingDraft || publishing) ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {(savingDraft || publishing) ? (
                      <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                    )}
                    <span className="whitespace-nowrap">{savingDraft ? "Đang lưu..." : (isCreatingNewPost ? "Lưu nháp" : "Về nháp")}</span>
                  </button>
                )}

                {post.id && isDraft && (
                  <button
                    onClick={publishDraft}
                    disabled={publishing}
                    className={`flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm ${publishing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {publishing ? (
                      <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className="whitespace-nowrap">{publishing ? "Đang xử lý..." : "Công khai"}</span>
                  </button>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={busy}
                  className={`flex items-center justify-center gap-2 px-4 py-2 bg-[#105d97] hover:bg-[#0e4d7a] text-white rounded-lg transition-colors font-medium text-sm ${busy ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {busy ? (
                    <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                  <span className="whitespace-nowrap">{busy ? "Đang đăng..." : btnTitle}</span>
                </button>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg flex flex-col bg-white h-[calc(100vh-220px)]">
              <div className="relative z-[60] bg-gray-50 border-b border-gray-200 p-2 flex-shrink-0 sticky top-0">
                <ToolBar
                  editor={editor}
                  onOpenImageClick={openGalleryModal}
                  onOpenR2ModalClick={openR2Modal}
                  onOpenR2GalleryClick={openR2GalleryModal}
                  onOpenGalleryClick={openImageGalleryModal}
                />
              </div>

              <div data-editor-scroll-container="true" className="p-4 w-full flex-1 overflow-y-auto custom-scrollbar">
                {editor ? <EditLink editor={editor} /> : null}
                {editor ? <EditImage editor={editor} /> : null}
                {editor ? <EditCloudinaryVideo editor={editor} /> : null}
                <div className="editor-content">
                  <EditorContent editor={editor} className="min-h-[700px]" />
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-500 flex-shrink-0">
              <WordCount editor={editor} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {/* Chọn kiểu URL */}
              <div className="inline-flex items-center rounded-full border border-gray-300 bg-white overflow-hidden text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setIsDirectPost(false)}
                  className={`px-3 py-1.5 transition-all ${!isDirectPost
                    ? "bg-[#105d97] text-white"
                    : "text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  3 cấp
                </button>
                <button
                  type="button"
                  onClick={() => setIsDirectPost(true)}
                  className={`px-3 py-1.5 transition-all border-l border-gray-300 ${isDirectPost
                    ? "bg-emerald-600 text-white"
                    : "text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  2 cấp
                </button>
              </div>

              {/* Link xem trước — hiện full URL */}
              {post.slug && (
                <a
                  href={isDirectPost ? `/${post.slug}` : `/bai-viet/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors font-mono"
                >
                  {`https://dongphucunivi.com${isDirectPost ? `/${post.slug}` : `/bai-viet/${post.slug}`}`}
                </a>
              )}
            </div>
          </div>

          {/* FAQ Container - Separate Box Below Main Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#105d97]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Danh sách FAQ (Câu hỏi thường gặp)
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Tạo FAQ Schema cho bài viết giúp hiển thị câu hỏi trực tiếp trên Google Search (Rich Snippet) và tăng tỷ lệ click (CTR).
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#105d97] border border-blue-200">
                {faqs.length} câu hỏi
              </span>
            </div>
            <FAQEditor
              value={faqs}
              onChange={setFaqs}
              onGenerateAi={handleGenerateAiFaqs}
              isGenerating={generatingFaqs}
            />
          </div>
        </div>

        {/* Combined Section Right Sidebar - Horizontally Collapsible */}
        <div className={`transition-all duration-300 min-w-0 ${showSidebar ? "w-full lg:w-[30%]" : "w-full lg:w-[3.5rem] flex-shrink-0"}`}>
          {showSidebar ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-4 z-10 flex flex-col max-h-[calc(100vh-2rem)]">
              {/* Sidebar Header with Collapse Button */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#105d97]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Thông tin & Cấu hình
                </h2>
                <button
                  type="button"
                  onClick={() => setShowSidebar(false)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#105d97] bg-white border border-gray-300 hover:border-[#105d97] px-2.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                  title="Thu gọn cột thông tin"
                >
                  <span>Thu gọn</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Container with 3 Subsections */}
              <div className="p-5 overflow-y-auto custom-scrollbar space-y-6 flex-1">
                {/* 1. THÔNG TIN CƠ BẢN & SEO */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#105d97]"></span>
                    Thông tin cơ bản
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tiêu đề bài viết *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97] focus:border-transparent outline-none text-sm"
                      placeholder="Tiêu đề bài viết..."
                      onChange={updateTitle}
                      value={post.title}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chọn tác giả bài viết
                    </label>
                    <AuthorSelector value={postAuthorId} onChange={setPostAuthorId} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Từ khóa SEO (Keywords)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97] focus:border-transparent outline-none text-sm"
                      placeholder="Từ khóa 1, từ khóa 2, ..."
                      onChange={updateKeywords}
                      value={post.keywords || ""}
                    />
                  </div>

                  <div className="pt-2">
                    <SEOForm
                      onChange={updateSeoValue}
                      title={post.title}
                      editor={editor}
                      initialValue={seoInitialValue}
                    />
                  </div>
                </div>

                {/* 2. HÌNH ẢNH ĐẠI DIỆN */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#105d97]"></span>
                    Hình ảnh đại diện
                  </h3>
                  <ThumbnailSelector
                    initialValue={typeof post.thumbnail === "string" ? post.thumbnail : ""}
                    onChange={updateThumbnail}
                    onImageFromGallery={(imageUrl) => {
                      setPost((prev) => ({ ...prev, thumbnail: imageUrl }));
                    }}
                  />
                </div>

                {/* 3. BÀI VIẾT NỔI BẬT */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#105d97]"></span>
                    Bài viết nổi bật
                  </h3>
                  <p className="text-xs text-gray-500">
                    Tối đa 4 bài viết nổi bật được hiển thị ở đầu trang /bai-viet.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsFeatured((prev) => !prev)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${isFeatured
                      ? "border-amber-400 bg-amber-50 text-amber-700"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                      }`}
                  >
                    <svg
                      className={`w-5 h-5 flex-shrink-0 ${isFeatured ? "text-amber-500" : "text-gray-400"}`}
                      fill={isFeatured ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    {isFeatured ? "Đang là bài viết nổi bật" : "Đánh dấu là nổi bật"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Collapsed Vertical Bar */
            <div
              onClick={() => setShowSidebar(true)}
              className="sticky top-4 z-10 bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex flex-col items-center py-5 gap-5 cursor-pointer hover:border-[#105d97] hover:shadow-md transition-all group"
              title="Mở rộng thông tin bài viết & SEO"
            >
              <button
                type="button"
                className="p-2 text-gray-600 group-hover:text-[#105d97] bg-gray-100 group-hover:bg-blue-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <div className="py-2 flex items-center justify-center [writing-mode:vertical-lr] rotate-180 text-xs font-bold text-gray-600 group-hover:text-[#105d97] tracking-widest uppercase transition-colors whitespace-nowrap">
                Thông tin & Cấu hình
              </div>
            </div>
          )}
        </div>
      </div>

      <GalleryModal
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onSelect={handleImageSelection}
        images={images}
        onFileSelect={handleImageUpload}
        uploading={uploading}
      />
      <R2ImageModal
        visible={showR2Modal}
        onClose={() => setShowR2Modal(false)}
        onSelect={handleR2ImageSelection}
        initialFolder={defaultFolder || ""}
      />
      <MultiImageGalleryModal
        visible={showImageGallery}
        onClose={() => setShowImageGallery(false)}
        onSelect={handleImageGallerySelection}
      />
      <R2MultiGalleryModal
        visible={showR2GalleryModal}
        onClose={() => setShowR2GalleryModal(false)}
        onSelect={handleR2GallerySelection}
        defaultFolder={defaultFolder || ""}
      />
      {/* Edit existing gallery via R2 Gallery Modal (No Flickr dependency) */}
      <R2MultiGalleryModal
        visible={editingGallery !== null}
        onClose={() => setEditingGallery(null)}
        onSelect={handleUpdateGallery}
        initialImages={editingGallery?.images}
        initialTitle={editingGallery?.title}
        initialMode="editor"
        defaultFolder={defaultFolder || ""}
      />
      <style jsx global>{`
        .tiptap-table {
          display: block;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          max-width: 100%;
          width: max-content !important;
          margin: 1.5em auto !important;
        }
        .blog figure {
          margin: 1.5em 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .blog figure img {
          display: block;
          margin: 0 auto;
        }
        .blog .cloudinary-video-embed[data-aspect-ratio="vertical"] {
          width: 100% !important;
          max-width: 420px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .blog .cloudinary-video-embed[data-aspect-ratio="square"] {
          width: 100% !important;
          max-width: 640px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .blog .cloudinary-video-embed video {
          display: block;
          width: 100%;
          height: auto;
          margin: 0 !important;
          padding: 0 !important;
          max-width: none !important;
        }
        @media (max-width: 767px) {
          .blog .cloudinary-video-embed[data-aspect-ratio="vertical"],
          .blog .cloudinary-video-embed[data-aspect-ratio="square"] {
            max-width: 100% !important;
          }
        }
        @media (min-width: 768px) {
          .blog .cloudinary-video-embed {
            width: 100% !important;
            max-width: 100% !important;
            aspect-ratio: 16 / 9 !important;
            background: #000 !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .blog .cloudinary-video-embed video {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain;
          }
        }
        .blog figcaption {
          margin-top: 0.5em;
          font-size: 0.875em;
          color: #6b7280;
          font-style: italic;
          text-align: center;
          width: 100%;
          max-width: 100%;
        }
        .dark .blog figcaption {
          color: #9ca3af;
        }
      `}</style>
    </>
  );
};

export default Editor;
