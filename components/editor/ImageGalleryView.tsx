import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { FiEdit2, FiTrash2, FiImage } from "react-icons/fi";
import { GalleryImage } from "./ImageGallery";

interface Props extends NodeViewProps {
  onEditRequest: (images: GalleryImage[], getPos: () => number, title?: string) => void;
}

const ImageGalleryView = ({
  node,
  editor,
  getPos,
  deleteNode,
  onEditRequest,
}: Props) => {
  const images: GalleryImage[] = Array.isArray(node.attrs.images)
    ? node.attrs.images
    : [];
  const title: string = node.attrs.title || "Thư viện hình ảnh";

  const handleEdit = () => {
    onEditRequest(images, getPos as () => number, title);
  };

  const handleDelete = () => {
    deleteNode();
  };

  return (
    <NodeViewWrapper
      as="div"
      className="relative group my-4 rounded-xl border-2 border-dashed border-[#105d97]/30 bg-blue-50/30 select-none"
      data-drag-handle
    >
      {/* Overlay toolbar */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={handleEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#105d97] text-white text-xs font-semibold rounded-lg shadow-md hover:bg-[#0d4a7a] transition-colors"
          title="Chỉnh sửa gallery"
        >
          <FiEdit2 className="w-3.5 h-3.5" />
          Sửa
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors"
          title="Xóa gallery"
        >
          <FiTrash2 className="w-3.5 h-3.5" />
          Xóa
        </button>
      </div>

      {/* Preview header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-[#105d97]/20">
        <FiImage className="w-4 h-4 text-[#105d97]" />
        <span className="text-sm font-semibold text-[#105d97]">{title}</span>
        <span className="ml-auto text-xs text-gray-400">{images.length} ảnh</span>
      </div>

      {/* Image grid preview */}
      <div className="p-3 grid grid-cols-4 gap-2">
        {images.slice(0, 8).map((img, idx) => (
          <div
            key={idx}
            className="aspect-[4/3] rounded-md overflow-hidden bg-gray-100 border border-gray-200"
          >
            {img.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img.src}
                alt={img.altText || `Ảnh ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <FiImage className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
        {images.length > 8 && (
          <div className="aspect-[4/3] rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-400 font-medium">
            +{images.length - 8}
          </div>
        )}
      </div>

      {/* Click hint */}
      <p className="text-center text-xs text-gray-400 pb-2">
        Hover để chỉnh sửa hoặc xóa gallery
      </p>
    </NodeViewWrapper>
  );
};

export default ImageGalleryView;
