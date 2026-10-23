import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BubbleMenu, Editor } from "@tiptap/react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import EmbedCloudinaryVideo from "./ToolBar/EmbedCloudinaryVideo";

interface Props {
  editor: Editor;
}

type VideoAspectRatio = "square" | "vertical" | "horizontal";

const EditCloudinaryVideo: FC<Props> = ({ editor }) => {
  const [editing, setEditing] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const active = editor.isActive("cloudinaryVideo");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!active) {
      setEditing(false);
      setPickerOpen(false);
      setShowDeleteConfirm(false);
    }
  }, [active]);

  const replaceVideo = (video: { src: string; name?: string; aspectRatio?: VideoAspectRatio }) => {
    editor.chain().focus().updateAttributes("cloudinaryVideo", {
      src: video.src,
      title: video.name || "Video Univi",
      aspectRatio: video.aspectRatio || "horizontal",
    }).run();
    setPickerOpen(false);
    setEditing(false);
    editor.commands.blur();
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    editor.chain().focus().deleteSelection().run();
    setEditing(false);
    editor.commands.blur();
  };

  return (
    <>
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor: currentEditor }) => currentEditor.isActive("cloudinaryVideo")}
        tippyOptions={{ placement: "top" }}
      >
        {editing ? (
          <EmbedCloudinaryVideo
            onSubmit={replaceVideo}
            onToggle={setPickerOpen}
            selectedVideo={null}
            open={pickerOpen}
            hideTrigger
            centered
          />
        ) : (
          <div className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white shadow-xl">
            <span className="max-w-[220px] truncate text-xs">Video Cloudinary</span>
            <button type="button" onClick={() => { setEditing(true); setPickerOpen(true); }} className="p-1 hover:text-blue-300" title="Chỉnh sửa video">
              <BsPencilSquare size={16} />
            </button>
            <button type="button" onClick={() => setShowDeleteConfirm(true)} className="p-1 hover:text-red-400" title="Xóa video khỏi bài viết">
              <BsTrash size={16} />
            </button>
          </div>
        )}
      </BubbleMenu>

      {/* Modal Popup Xác nhận Xóa Video (Mount qua Portal vào document.body) */}
      {mounted && showDeleteConfirm && createPortal(
        <div
          className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm w-full p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 mx-auto mb-3.5 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
              <FiAlertTriangle size={28} />
            </div>

            <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
              Xóa video khỏi bài viết?
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
              Bạn có chắc chắn muốn xóa video này khỏi nội dung bài viết không?
            </p>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BsTrash size={14} />
                <span>Xóa video</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default EditCloudinaryVideo;
