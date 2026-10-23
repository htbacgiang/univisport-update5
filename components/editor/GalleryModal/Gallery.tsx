import { FC } from "react";
import { BsCardImage } from "react-icons/bs";
import Image from "./Image";

interface ImageData {
  src: string;
  altText?: string;
  id?: string;
}

interface Props {
  images: ImageData[];
  onSelect(image: ImageData): void;
  uploading?: boolean;
  selectedImage?: string;
  selectedImages?: string[];
}

const Gallery: FC<Props> = ({
  images,
  uploading = false,
  selectedImage = "",
  selectedImages = [],
  onSelect,
}): JSX.Element => {
  if (!images || !Array.isArray(images)) {
    return <p className="text-center w-full text-gray-500 dark:text-gray-400">Invalid image data</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {uploading && images.length === 0 && (
        <div className="aspect-square flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg animate-pulse">
          <BsCardImage size={40} />
          <p className="text-sm mt-2">Uploading...</p>
        </div>
      )}

      {images.length === 0 && !uploading && (
        <div className="col-span-full text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <BsCardImage size={32} className="text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Không có hình ảnh nào</p>
        </div>
      )}

      {uploading && (
        <div className="aspect-video flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg animate-pulse">
          <BsCardImage size={40} />
          <p className="text-sm mt-2">Uploading</p>
        </div>
      )}

      {images.map((image) => (
        <div key={image.src} className="gallery-item">
          <Image
            src={image.src}
            selected={
              selectedImage === image.src || selectedImages.includes(image.src)
            }
            onClick={() => onSelect(image)}
            alt={image.altText || "Gallery image"}
          />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
