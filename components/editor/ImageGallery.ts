import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

export interface GalleryImage {
  src: string;
  altText?: string;
  width?: number;
  height?: number;
  ratioMode?: string;
}

export interface ImageGalleryOptions {
  HTMLAttributes: Record<string, any>;
  onEditRequest?: (images: GalleryImage[], getPos: () => number, title?: string) => void;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageGallery: {
      setImageGallery: (options: {
        images: GalleryImage[];
        title?: string;
      }) => ReturnType;
    };
  }
}

const normalizeImages = (images: unknown): GalleryImage[] => {
  if (!Array.isArray(images)) return [];

  return images
    .filter(
      (image): image is GalleryImage =>
        Boolean(image) &&
        typeof image === "object" &&
        typeof (image as GalleryImage).src === "string" &&
        Boolean((image as GalleryImage).src.trim())
    )
    .map((image) => ({
      src: image.src,
      altText: image.altText || "",
      width: Number(image.width) > 0 ? Number(image.width) : 4,
      height: Number(image.height) > 0 ? Number(image.height) : 3,
      ratioMode: image.ratioMode || "auto",
    }));
};

const parseImagesAttribute = (value: string | null): GalleryImage[] => {
  if (!value) return [];

  try {
    return normalizeImages(JSON.parse(value));
  } catch {
    return [];
  }
};

export const ImageGallery = Node.create<ImageGalleryOptions>({
  name: "imageGallery",

  addOptions() {
    return {
      HTMLAttributes: {
        class: "article-image-gallery",
      },
      onEditRequest: undefined as ((images: GalleryImage[], getPos: () => number, title?: string) => void) | undefined,
    };
  },

  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      title: {
        default: "Thư viện hình ảnh",
        parseHTML: (element) =>
          element.getAttribute("data-title") || "Thư viện hình ảnh",
      },
      images: {
        default: [],
        parseHTML: (element) => {
          const storedImages = parseImagesAttribute(
            element.getAttribute("data-images")
          );

          if (storedImages.length > 0) return storedImages;

          return Array.from(element.querySelectorAll("img")).map((image) => ({
            src: image.getAttribute("src") || "",
            altText: image.getAttribute("alt") || "",
            width: Number(image.getAttribute("width")) || 4,
            height: Number(image.getAttribute("height")) || 3,
            ratioMode: image.getAttribute("data-ratio-mode") || "auto",
          }));
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-article-gallery="true"]',
      },
    ];
  },

  renderHTML({ node }) {
    const images = normalizeImages(node.attrs.images);
    const title = node.attrs.title || "Thư viện hình ảnh";

    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-article-gallery": "true",
        "data-images": JSON.stringify(images),
        "data-title": title,
        "data-count": String(images.length),
      }),
      [
        "div",
        { class: "article-image-gallery-header" },
        ["span", { class: "article-image-gallery-accent", "aria-hidden": "true" }],
        [
          "div",
          {
            class: "article-image-gallery-title",
            role: "heading",
            "aria-level": "3",
          },
          title,
        ],
        [
          "span",
          { class: "article-image-gallery-count" },
          `${images.length} ảnh`,
        ],
      ],
      [
        "div",
        { class: "article-image-gallery-grid" },
        ...images.map((image, index) => [
          "div",
          {
            class: "article-image-gallery-item",
            style: `aspect-ratio: ${image.width || 4} / ${image.height || 3};`,
          },
          [
            "img",
            {
              src: image.src,
              alt: image.altText || `${title} ${index + 1}`,
              width: image.width || 4,
              height: image.height || 3,
              "data-ratio-mode": image.ratioMode || "auto",
              loading: "lazy",
            },
          ],
        ]),
      ],
    ];
  },

  addCommands() {
    return {
      setImageGallery:
        ({ images, title = "Thư viện hình ảnh" }) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: {
              title,
              images: normalizeImages(images),
            },
          }),
    };
  },

  addNodeView() {
    const { onEditRequest } = this.options;
    // Lazy import to avoid circular deps & keep .ts extension valid
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ImageGalleryView = require("./ImageGalleryView").default;
    return ReactNodeViewRenderer((props: any) =>
      ImageGalleryView({ ...props, onEditRequest })
    );
  },
});
