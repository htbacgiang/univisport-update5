import { FC, useEffect, useState, useRef, useCallback } from "react";
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
import GalleryModal, { ImageSelectionResult } from "./GalleryModal";
import R2ImageModal, { R2ImageSelectionResult } from "./R2ImageModal";
import R2MultiGalleryModal from "./GalleryModal/R2MultiGalleryModal";
import { GalleryImage, ImageGallery } from "./ImageGallery";
import axios from "axios";
import { FacebookReel } from "./FacebookReel";
import { CloudinaryVideo } from "./CloudinaryVideo";
import { AdBanner } from "./AdBanner";
import { InternalLink } from "./InternalLink";

interface Props {
  content: string;
  onChange: (content: string) => void;
}

const SimpleEditor: FC<Props> = ({ content, onChange }): JSX.Element => {
  const [selectionRange, setSelectionRange] = useState<Range>();
  const [showGallery, setShowGallery] = useState(false);
  const [showR2Modal, setShowR2Modal] = useState(false);
  const [showR2GalleryModal, setShowR2GalleryModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState<{
    images: GalleryImage[];
    getPos: () => number;
    title?: string;
  } | null>(null);

  const editGalleryCallbackRef = useCallback(
    (images: GalleryImage[], getPos: () => number, title?: string) => {
      setEditingGallery({ images, getPos, title });
    },
    []
  );

  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<{ src: string; altText?: string; id?: string }[]>([]);
  const isInternalUpdateRef = useRef(false);
  const previousContentRef = useRef<string>("");

  const fetchImages = async () => {
    try {
      const { data } = await axios("/api/image");
      setImages(data.images || []);
    } catch (error) {
      setImages([]);
    }
  };

  const handleImageUpload = async (imageData: File | { file: File; altText: string }) => {
    setUploading(true);
    try {
      const formData = new FormData();
      if (imageData instanceof File) {
        formData.append("image", imageData);
      } else {
        formData.append("image", imageData.file);
        formData.append("altText", imageData.altText);
      }
      const { data } = await axios.post("/api/image", formData);
      setImages([data, ...images]);
      await fetchImages();
    } catch (error) {
      console.error(error);
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
        placeholder: "Nhập tổng quan bài viết...",
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
          "blog prose prose-lg focus:outline-none max-w-full mx-auto h-full min-h-[300px] p-4",
      },
    },
    content: content,
    onUpdate: ({ editor }) => {
      isInternalUpdateRef.current = true;
      const newContent = editor.getHTML();
      previousContentRef.current = newContent;
      onChange(newContent);
      setTimeout(() => {
        isInternalUpdateRef.current = false;
      }, 0);
    },
  });

  const handleImageSelection = (result: ImageSelectionResult) => {
    if (!editor) return;
    (editor.chain().focus() as any)
      .setImage({
        src: result.src,
        alt: result.altText,
        caption: result.caption,
        width: "100%",
        aspectRatio: "auto",
        alignment: "center",
      })
      .run();
  };

  const handleR2ImageSelection = (result: R2ImageSelectionResult) => {
    if (!editor) return;
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
      })
      .run();
  };

  const handleR2GallerySelection = (galleryImages: GalleryImage[], title?: string) => {
    if (!editor || galleryImages.length === 0) return;
    (editor.chain().focus() as any)
      .setImageGallery({ images: galleryImages, title: title || "Thư viện hình ảnh" })
      .run();
  };

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

  useEffect(() => {
    if (editor && selectionRange) {
      editor.commands.setTextSelection(selectionRange);
    }
  }, [editor, selectionRange]);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (editor) {
      const currentContent = editor.getHTML();
      if (isInternalUpdateRef.current) return;
      
      if (currentContent !== content && content !== previousContentRef.current) {
        if (editor.isFocused) return;
        editor.commands.setContent(content, false);
        previousContentRef.current = content;
      }
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        <ToolBar
          editor={editor}
          onOpenImageClick={() => setShowGallery(true)}
          onOpenR2ModalClick={() => setShowR2Modal(true)}
          onOpenR2GalleryClick={() => setShowR2GalleryModal(true)}
        />
      </div>
      <div className="relative">
        {editor && <EditLink editor={editor} />}
        {editor && <EditImage editor={editor} />}
        <EditorContent editor={editor} />
      </div>
      <GalleryModal
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onSelect={handleImageSelection}
        onFileSelect={handleImageUpload}
        uploading={uploading}
        images={images}
      />
      <R2ImageModal
        visible={showR2Modal}
        onClose={() => setShowR2Modal(false)}
        onSelect={handleR2ImageSelection}
        initialFolder=""
      />
      <R2MultiGalleryModal
        visible={showR2GalleryModal}
        onClose={() => setShowR2GalleryModal(false)}
        onSelect={handleR2GallerySelection}
      />
      <R2MultiGalleryModal
        visible={editingGallery !== null}
        onClose={() => setEditingGallery(null)}
        onSelect={handleUpdateGallery}
        initialImages={editingGallery?.images}
        initialTitle={editingGallery?.title}
        initialMode="editor"
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
    </div>
  );
};

export default SimpleEditor;
