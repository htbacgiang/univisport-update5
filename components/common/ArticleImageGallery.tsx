import Image from "next/image";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import Gallery, { RenderImageProps } from "react-photo-gallery";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

export interface ArticleGalleryImage {
  src: string;
  altText?: string;
  width?: number;
  height?: number;
  ratioMode?: string;
}

interface Props {
  images: ArticleGalleryImage[];
  title?: string;
}

export const parseArticleGalleryImages = (
  value?: string
): ArticleGalleryImage[] => {
  if (!value) return [];

  try {
    const images = JSON.parse(value);
    if (!Array.isArray(images)) return [];

    return images.filter(
      (image) =>
        image &&
        typeof image === "object" &&
        typeof image.src === "string" &&
        Boolean(image.src)
    );
  } catch {
    return [];
  }
};

const ArticleImageGallery: FC<Props> = ({
  images,
  title = "Thư viện hình ảnh",
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [naturalSizes, setNaturalSizes] = useState<
    Record<number, { width: number; height: number }>
  >({});

  useEffect(() => {
    let cancelled = false;
    setNaturalSizes({});

    images.forEach((image, index) => {
      if (image.ratioMode && image.ratioMode !== "auto") return;

      const preview = new window.Image();
      preview.onload = () => {
        if (cancelled || !preview.naturalWidth || !preview.naturalHeight) return;

        setNaturalSizes((current) => ({
          ...current,
          [index]: {
            width: preview.naturalWidth,
            height: preview.naturalHeight,
          },
        }));
      };
      preview.src = image.src;
    });

    return () => {
      cancelled = true;
    };
  }, [images]);

  const photos = useMemo(
    () =>
      images
        .filter((image) => Boolean(image?.src))
        .map((image, index) => {
          const naturalSize = naturalSizes[index];

          return {
            src: image.src,
            width:
              naturalSize?.width ||
              (Number(image.width) > 0 ? Number(image.width) : 4),
            height:
              naturalSize?.height ||
              (Number(image.height) > 0 ? Number(image.height) : 3),
            alt: image.altText || `${title} ${index + 1}`,
          };
        }),
    [images, naturalSizes, title]
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showNext = useCallback(() => {
    setLightboxIndex((current) =>
      current === null ? null : (current + 1) % photos.length
    );
  }, [photos.length]);
  const showPrevious = useCallback(() => {
    setLightboxIndex((current) =>
      current === null
        ? null
        : (current - 1 + photos.length) % photos.length
    );
  }, [photos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrevious();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox, lightboxIndex, showNext, showPrevious]);

  if (photos.length === 0) return null;

  const renderImage = ({
    index,
    photo,
    margin,
    onClick,
  }: RenderImageProps) => (
    <button
      type="button"
      key={`${photo.src}-${index}`}
      className="article-image-gallery-photo"
      style={{
        margin: margin || "0",
        height: photo.height,
        width: photo.width,
      }}
      onClick={(event) => onClick?.(event, { index })}
      aria-label={`Xem ảnh ${index + 1}: ${photo.alt || ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.src} alt={photo.alt || ""} loading="lazy" />
    </button>
  );

  const activePhoto =
    lightboxIndex === null ? null : photos[lightboxIndex] || null;

  return (
    <>
      <section className="not-prose article-image-gallery">
        <div className="article-image-gallery-header">
          <span
            className="article-image-gallery-accent"
            aria-hidden="true"
          />
          <div
            className="article-image-gallery-title"
            role="heading"
            aria-level={3}
          >
            {title}
          </div>
          <span className="article-image-gallery-count">
            {photos.length} ảnh
          </span>
        </div>

        <Gallery
          photos={photos}
          direction="row"
          margin={4}
          targetRowHeight={(containerWidth) =>
            containerWidth < 640 ? 140 : 220
          }
          onClick={(_, details) => setLightboxIndex(details.index)}
          renderImage={renderImage}
        />
      </section>

      {activePhoto && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh Gallery"
        >
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70 md:left-6"
                aria-label="Ảnh trước"
              >
                <FaChevronLeft className="text-xl md:text-2xl" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70 md:right-6"
                aria-label="Ảnh sau"
              >
                <FaChevronRight className="text-xl md:text-2xl" />
              </button>
            </>
          )}

          <div
            className="relative h-[85vh] w-[88vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activePhoto.src}
              alt={activePhoto.alt}
              fill
              className="object-contain"
              unoptimized={activePhoto.src.startsWith("http")}
              priority
            />
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-0 top-0 z-10 rounded-full bg-gray-700 p-2.5 text-white transition-colors hover:bg-red-700 md:-right-8 md:-top-4"
              aria-label="Đóng"
            >
              <FaTimes />
            </button>
          </div>

          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/80">
            {lightboxIndex + 1} / {photos.length}
          </span>
        </div>
      )}
    </>
  );
};

export default ArticleImageGallery;
