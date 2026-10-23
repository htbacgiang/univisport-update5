import { FC, useCallback, useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiX, FiMenu } from "react-icons/fi";
import { ReactSortable } from "react-sortablejs";
import ModalContainer, { ModalProps } from "../../common/ModalContainer";
import type { GalleryImage } from "../ImageGallery";

interface Props extends ModalProps {
  onSelect(images: GalleryImage[]): void;
  initialImages?: GalleryImage[];
}

type RatioPreset = "auto" | "1:1" | "4:3" | "3:4" | "16:9" | "custom";

interface GalleryFormImage extends GalleryImage {
  id: string;
  ratio: RatioPreset;
  naturalWidth?: number;
  naturalHeight?: number;
}

const RATIO_DIMENSIONS: Record<
  Exclude<RatioPreset, "auto" | "custom">,
  { width: number; height: number }
> = {
  "1:1": { width: 1, height: 1 },
  "4:3": { width: 4, height: 3 },
  "3:4": { width: 3, height: 4 },
  "16:9": { width: 16, height: 9 },
};

const createEmptyImage = (): GalleryFormImage => ({
  id: Math.random().toString(36).substring(2, 9),
  src: "",
  altText: "",
  width: 0,
  height: 0,
  ratio: "auto",
});

const isFlickrImageUrl = (value: string) => {
  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase();

    return (
      url.protocol === "https:" &&
      (hostname === "live.staticflickr.com" ||
        hostname === "staticflickr.com" ||
        hostname.endsWith(".staticflickr.com"))
    );
  } catch {
    return false;
  }
};

const MultiImageGalleryModal: FC<Props> = ({
  visible,
  onSelect,
  onClose,
  initialImages,
}) => {
  const isEditMode = Boolean(initialImages && initialImages.length > 0);
  const [galleryImages, setGalleryImages] = useState<GalleryFormImage[]>(
    isEditMode
      ? initialImages!.map((img) => ({
          ...img,
          id: Math.random().toString(36).substring(2, 9),
          ratio: (img.ratioMode as RatioPreset) || "auto",
        }))
      : [createEmptyImage(), createEmptyImage()]
  );
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = useCallback(() => {
    if (initialImages && initialImages.length > 0) {
      setGalleryImages(
        initialImages.map((img) => ({
          ...img,
          id: Math.random().toString(36).substring(2, 9),
          ratio: (img.ratioMode as RatioPreset) || "auto",
        }))
      );
    } else {
      setGalleryImages([createEmptyImage(), createEmptyImage()]);
    }
    setErrorMessage("");
  }, [initialImages]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose?.();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (visible) resetForm();
  }, [visible, resetForm]);

  const updateImage = (
    index: number,
    changes: Partial<GalleryFormImage>
  ) => {
    setGalleryImages((current) =>
      current.map((image, imageIndex) =>
        imageIndex === index ? { ...image, ...changes } : image
      )
    );
    setErrorMessage("");
  };

  const handleRatioChange = (index: number, ratio: RatioPreset) => {
    if (ratio === "auto") {
      const image = galleryImages[index];
      updateImage(index, {
        ratio,
        width: image.naturalWidth || 0,
        height: image.naturalHeight || 0,
      });
      return;
    }

    if (ratio === "custom") {
      updateImage(index, { ratio });
      return;
    }

    updateImage(index, {
      ratio,
      ...RATIO_DIMENSIONS[ratio],
    });
  };

  const handleImageLoad = (
    index: number,
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const naturalWidth = event.currentTarget.naturalWidth;
    const naturalHeight = event.currentTarget.naturalHeight;
    const image = galleryImages[index];

    updateImage(index, {
      naturalWidth,
      naturalHeight,
      ...(image.ratio === "auto"
        ? { width: naturalWidth, height: naturalHeight }
        : {}),
    });
  };

  const addImage = () => {
    setGalleryImages((current) => [...current, createEmptyImage()]);
  };

  const removeImage = (index: number) => {
    setGalleryImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );
    setErrorMessage("");
  };

  const handleInsert = () => {
    if (galleryImages.length < 2) {
      setErrorMessage("Gallery cần ít nhất 2 ảnh.");
      return;
    }

    const invalidUrlIndex = galleryImages.findIndex(
      (image) => !isFlickrImageUrl(image.src)
    );
    if (invalidUrlIndex !== -1) {
      setErrorMessage(
        `Ảnh ${invalidUrlIndex + 1} phải là link ảnh trực tiếp từ live.staticflickr.com.`
      );
      return;
    }

    const invalidRatioIndex = galleryImages.findIndex(
      (image) =>
        !Number.isFinite(Number(image.width)) ||
        !Number.isFinite(Number(image.height)) ||
        Number(image.width) <= 0 ||
        Number(image.height) <= 0
    );
    if (invalidRatioIndex !== -1) {
      setErrorMessage(
        `Tỷ lệ của ảnh ${invalidRatioIndex + 1} phải lớn hơn 0.`
      );
      return;
    }

    onSelect(
      galleryImages.map(
        ({
          ratio,
          naturalWidth: _naturalWidth,
          naturalHeight: _naturalHeight,
          ...image
        }) => ({
          ...image,
          src: image.src.trim(),
          altText: image.altText?.trim() || "",
          width: Number(image.width),
          height: Number(image.height),
          ratioMode: ratio,
        })
      )
    );
    handleClose();
  };

  return (
    <ModalContainer visible={visible} onClose={handleClose}>
      <div className="multi-gallery-modal-content flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditMode ? "Chỉnh sửa Gallery" : "Thêm Gallery từ Flickr"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? `Đang chỉnh sửa ${galleryImages.length} ảnh – thêm, xóa hoặc sửa thông tin từng ảnh.`
                : "Dùng link ảnh trực tiếp dạng https://live.staticflickr.com/..."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
            aria-label="Đóng"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-6 custom-scrollbar">
          <ReactSortable
            list={galleryImages}
            setList={setGalleryImages}
            handle=".gallery-drag-handle"
            animation={150}
            className="space-y-4"
          >
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[140px_1fr]"
              >
                <div
                  className="w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                  style={{
                    aspectRatio:
                      Number(image.width) > 0 && Number(image.height) > 0
                        ? `${image.width} / ${image.height}`
                        : "4 / 3",
                  }}
                >
                  {isFlickrImageUrl(image.src) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={image.src.trim()}
                      alt={image.altText || `Xem trước ảnh ${index + 1}`}
                      className="h-full w-full object-cover"
                      onLoad={(event) => handleImageLoad(index, event)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-3 text-center text-xs text-gray-400">
                      Xem trước ảnh {index + 1}
                    </div>
                  )}
                </div>

                <div className="min-w-0 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="gallery-drag-handle cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing p-1"
                        title="Kéo thả để sắp xếp"
                      >
                        <FiMenu className="h-4 w-4" />
                      </button>
                      <h3 className="font-semibold text-gray-900">
                        Ảnh {index + 1}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={galleryImages.length <= 2}
                      className="rounded-md p-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                      title="Xóa ảnh"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Link ảnh Flickr *
                    </label>
                    <input
                      type="url"
                      value={image.src}
                      onChange={(event) =>
                        updateImage(index, {
                          src: event.target.value,
                          naturalWidth: undefined,
                          naturalHeight: undefined,
                          ...(image.ratio === "auto"
                            ? { width: 0, height: 0 }
                            : {}),
                        })
                      }
                      placeholder="https://live.staticflickr.com/65535/..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#105d97] focus:ring-2 focus:ring-[#105d97]/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Thẻ alt
                    </label>
                    <input
                      type="text"
                      value={image.altText || ""}
                      onChange={(event) =>
                        updateImage(index, { altText: event.target.value })
                      }
                      placeholder="Mô tả nội dung ảnh"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#105d97] focus:ring-2 focus:ring-[#105d97]/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Tỷ lệ
                      </label>
                      <select
                        value={image.ratio}
                        onChange={(event) =>
                          handleRatioChange(
                            index,
                            event.target.value as RatioPreset
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#105d97]"
                      >
                        <option value="auto">Tự động theo ảnh</option>
                        <option value="1:1">1:1</option>
                        <option value="4:3">4:3</option>
                        <option value="3:4">3:4</option>
                        <option value="16:9">16:9</option>
                        <option value="custom">Tùy chỉnh</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Rộng
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={image.width || ""}
                        disabled={image.ratio !== "custom"}
                        onChange={(event) =>
                          updateImage(index, {
                            width: Number(event.target.value),
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Cao
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={image.height || ""}
                        disabled={image.ratio !== "custom"}
                        onChange={(event) =>
                          updateImage(index, {
                            height: Number(event.target.value),
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ReactSortable>

          <button
            type="button"
            onClick={addImage}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#105d97]/40 bg-white px-4 py-3 font-medium text-[#105d97] transition-colors hover:bg-blue-50"
          >
            <FiPlus />
            Thêm ảnh Flickr
          </button>
        </div>

        <div className="border-t border-gray-200 bg-white px-6 py-4">
          {errorMessage && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMessage}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleInsert}
              className="rounded-lg bg-[#105d97] px-5 py-2.5 font-medium text-white hover:bg-[#0e4d7a]"
            >
              {isEditMode ? "Cập nhật Gallery" : "Chèn Gallery"}
            </button>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default MultiImageGalleryModal;
