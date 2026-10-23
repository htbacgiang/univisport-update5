import Image from "next/image";
import { ChangeEventHandler, FC, useCallback, useState, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import ActionButton from "../../common/ActionButton";
import ModalContainer, { ModalProps } from "../../common/ModalContainer";
import Gallery from "./Gallery";
import axios from "axios";
import { useSession } from "next-auth/react";

export interface ImageSelectionResult {
  src: string;
  altText: string;
  caption?: string;
}

interface ImageData {
  src: string;
  altText?: string;
  id?: string;
}

interface Props extends ModalProps {
  images: ImageData[];
  uploading?: boolean;
  onFileSelect(imageData: File | { file: File; altText: string }): void;
  onSelect(result: ImageSelectionResult): void;
}

const GalleryModal: FC<Props> = ({
  visible,
  uploading,
  images,
  onFileSelect,
  onSelect,
  onClose,
}): JSX.Element => {
  const { data: session, status } = useSession();
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [editingAltText, setEditingAltText] = useState(false);
  const [savingAltText, setSavingAltText] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAltText, setUploadAltText] = useState("");
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string>("");

  const handleClose = useCallback(() => {
    setSelectedImage(null);
    setAltText("");
    setCaption("");
    setEditingAltText(false);
    setErrorMessage("");
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadAltText("");
    if (uploadPreviewUrl) {
      URL.revokeObjectURL(uploadPreviewUrl);
      setUploadPreviewUrl("");
    }
    onClose && onClose();
  }, [onClose, uploadPreviewUrl]);

  const handleOnImageChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { files } = target;
    if (!files) {
      return;
    }

    const file = files[0];
    
    if (!file.type.startsWith("image")) {
      alert("Vui lòng chọn file ảnh!");
      return;
    }

    // Cleanup previous preview URL
    if (uploadPreviewUrl) {
      URL.revokeObjectURL(uploadPreviewUrl);
    }

    // Create new preview URL
    const previewUrl = URL.createObjectURL(file);
    setUploadPreviewUrl(previewUrl);
    setUploadFile(file);
    setShowUploadModal(true);
  };

  const handleUploadConfirm = () => {
    if (!uploadFile) {
      alert("Không có file để upload. Vui lòng chọn lại!");
      return;
    }
    
    const customEvent = {
      file: uploadFile,
      altText: uploadAltText.trim()
    };
    
    if (onFileSelect && typeof onFileSelect === 'function') {
      try {
        onFileSelect(customEvent as any);
      } catch (error) {
        alert("Có lỗi xảy ra khi upload: " + (error as Error).message);
      }
    } else {
      alert("Lỗi: onFileSelect không hợp lệ!");
      return;
    }
    
    // Đóng modal sau khi upload
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadAltText("");
    if (uploadPreviewUrl) {
      URL.revokeObjectURL(uploadPreviewUrl);
      setUploadPreviewUrl("");
    }
  };

  const handleUploadCancel = () => {
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadAltText("");
    if (uploadPreviewUrl) {
      URL.revokeObjectURL(uploadPreviewUrl);
      setUploadPreviewUrl("");
    }
  };

  const handleImageSelect = (image: ImageData) => {
    setSelectedImage(image);
    setAltText(image.altText || "");
    setCaption("");
    setEditingAltText(false);
    setErrorMessage("");
  };

  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (uploadPreviewUrl) {
        URL.revokeObjectURL(uploadPreviewUrl);
      }
    };
  }, [uploadPreviewUrl]);

  const handleSelection = () => {
    if (!selectedImage) return handleClose();
    onSelect({ src: selectedImage.src, altText, caption: caption.trim() });
    handleClose();
  };



  const handleSaveAltText = async () => {
    if (!selectedImage?.id || !editingAltText) return;
    
    setSavingAltText(true);
    setErrorMessage("");
    
    try {
      const response = await axios.put("/api/image/alt-text", {
        imageId: selectedImage.id,
        altText: altText.trim()
      });
      
      // Cập nhật selectedImage với alt text mới
      if (selectedImage) {
        setSelectedImage({
          ...selectedImage,
          altText: altText.trim()
        });
      }
      
      setEditingAltText(false);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || "Có lỗi xảy ra khi lưu alt text";
      setErrorMessage(errorMsg);
    } finally {
      setSavingAltText(false);
    }
  };

  const handleEditAltText = () => {
    setEditingAltText(true);
  };

  const handleCancelEdit = () => {
    setEditingAltText(false);
    setAltText(selectedImage?.altText || "");
  };

  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <div className="gallery-modal-content max-w-6xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Thư viện ảnh
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Gallery Section */}
          <div className="flex-1 p-6 overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar">
              <Gallery
                images={images}
                selectedImage={selectedImage?.src || ""}
                uploading={uploading}
                onSelect={handleImageSelect}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 p-6 space-y-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Upload ảnh mới
              </h3>
              <div>
                <input
                  onChange={handleOnImageChange}
                  onClick={(e) => {
                    // Reset value để có thể chọn cùng file nhiều lần
                    (e.target as HTMLInputElement).value = '';
                  }}
                  style={{ display: 'none' }}
                  type="file"
                  id="image-input-gallery"
                  accept="image/*"
                />
                <label 
                  htmlFor="image-input-gallery"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Trigger click vào input
                    const input = document.getElementById('image-input-gallery') as HTMLInputElement;
                    if (input) {
                      input.click();
                    }
                  }}
                  className="block cursor-pointer"
                >
                  <div className="w-full border-2 border-dashed border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 flex items-center justify-center space-x-2 p-4 cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <AiOutlineCloudUpload className="w-5 h-5" />
                    <span className="font-medium">Chọn ảnh</span>
                  </div>
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Click để chọn ảnh và nhập mô tả
              </p>
            </div>

            {/* Selected Image Preview */}
            {selectedImage && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Ảnh đã chọn
                </h3>
                
                {/* Image Preview */}
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <Image
                    src={selectedImage.src}
                    layout="fill"
                    objectFit="cover"
                    alt={selectedImage.altText || "Selected image"}
                    className="rounded-lg"
                  />
                </div>



                {/* Alt Text Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Alt Text
                    </label>
                    {!editingAltText ? (
                      <button
                        onClick={handleEditAltText}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    ) : (
                      <div className="flex space-x-1">
                        <button
                          onClick={handleSaveAltText}
                          disabled={savingAltText}
                          className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors disabled:opacity-50"
                        >
                          <FiSave className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <FiX className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Error Message */}
                  {errorMessage && (
                    <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                      {errorMessage}
                    </div>
                  )}
                  
                  {editingAltText ? (
                    <textarea
                      className="w-full h-12 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Nhập mô tả cho ảnh..."
                      value={altText}
                      onChange={({ target }) => setAltText(target.value)}
                    />
                  ) : (
                    <div className="min-h-[4rem] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {selectedImage.altText || (
                        <span className="text-gray-500 dark:text-gray-400 italic">
                          Chưa có mô tả
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Caption Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Chú thích ảnh (Caption - tùy chọn)
                  </label>
                  <textarea
                    className="w-full h-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    placeholder="Nhập chú thích ảnh cho bài viết..."
                    value={caption}
                    onChange={({ target }) => setCaption(target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <button
                    onClick={handleSelection}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    Chọn ảnh này
                  </button>
                  
             
                </div>
              </div>
            )}

            {/* No Image Selected */}
            {!selectedImage && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <FiEdit2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Chọn một ảnh để xem chi tiết và chỉnh sửa
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal - Render outside ModalContainer để tránh z-index conflict */}
      {showUploadModal && (
        <div 
          data-upload-modal="true"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 99999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleUploadCancel();
            }
          }}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upload ảnh mới
              </h3>
              <button
                onClick={handleUploadCancel}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Image Preview */}
              {uploadPreviewUrl && (
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uploadPreviewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {!uploadPreviewUrl && (
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Không có preview</span>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mô tả ảnh (Alt Text)
                </label>
                <textarea
                  className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Nhập mô tả cho ảnh..."
                  value={uploadAltText}
                  onChange={({ target }) => setUploadAltText(target.value)}
                  autoFocus
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleUploadCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUploadConfirm();
                  }}
                  disabled={!uploadFile}
                  className={`flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${
                    !uploadFile ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? "Đang upload..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalContainer>
  );
};

export default GalleryModal;
