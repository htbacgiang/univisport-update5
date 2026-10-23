import { FC } from "react";
import { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import { AiFillCaretDown } from "react-icons/ai";
import { RiDoubleQuotesL } from "react-icons/ri";
import {
  BsTypeStrikethrough,
  BsBraces,
  BsCode,
  BsListOl,
  BsListUl,
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
  BsImageFill,
  BsImages,
} from "react-icons/bs";
import { MdFormatAlignCenter, MdFormatAlignRight, MdFormatAlignLeft, MdAspectRatio } from "react-icons/md";
import { MdTableRows, MdTableView, MdDeleteOutline } from "react-icons/md";

import Button from "./Button";
import { getFocusedEditor } from "../EditorUtils";
import DropdownOptions from "../../common/DropdownOptions";
import InsertLink from "../Link/InsertLink";
import { linkOption } from "../Link/LinkForm";
import { getEditorLinkAttributes } from "../../../utils/internalLinks";
import EmbedYoutube from "./EmbedYoutube";
import EmbedImage from "./EmbedImage";
import InsertTable from "./InsertTable";
import EmbedFacebookReels from "./EmbedFacebookReels";
import EmbedCloudinaryVideo from "./EmbedCloudinaryVideo";
import InsertAdBanner from "./InsertAdBanner";
import InsertComponent from "./InsertComponent";
import FindReplace from "./FindReplace";
import { FiPhoneCall } from "react-icons/fi";
import { toast } from "react-toastify";

interface Props {
  editor: Editor | null;
  onOpenImageClick?(): void;
  onOpenGalleryClick?(): void;
  onOpenR2ModalClick?(): void;
  onOpenR2GalleryClick?(): void;
  onDropdownToggle?(isOpen: boolean): void;
}

const ToolBar: FC<Props> = ({
  editor,
  onOpenImageClick,
  onOpenGalleryClick,
  onOpenR2ModalClick,
  onOpenR2GalleryClick,
  onDropdownToggle,
}): JSX.Element | null => {
  const [textColor, setTextColor] = useState<string>("#000000");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCloudinaryVideo, setSelectedCloudinaryVideo] = useState<{
    src?: string;
    aspectRatio?: "square" | "vertical" | "horizontal";
  } | null>(null);

  // Trạng thái ảnh đang được chọn trong editor
  const [selectedImage, setSelectedImage] = useState<{
    src?: string;
    width?: string;
    aspectRatio?: string;
    alignment?: "left" | "center" | "right";
  } | null>(null);

  useEffect(() => {
    if (!editor) {
      setSelectedCloudinaryVideo(null);
      setSelectedImage(null);
      return;
    }

    const syncSelectedVideo = () => {
      setSelectedCloudinaryVideo(
        editor.isActive("cloudinaryVideo")
          ? (editor.getAttributes("cloudinaryVideo") as { src?: string; aspectRatio?: "square" | "vertical" | "horizontal" })
          : null
      );
    };

    const syncSelectedImage = () => {
      if (editor.isActive("image")) {
        const attrs = editor.getAttributes("image");
        setSelectedImage({
          src: attrs.src || "",
          width: attrs.width || "100%",
          aspectRatio: attrs.aspectRatio || "auto",
          alignment: (attrs.alignment as "left" | "center" | "right") || "center",
        });
      } else {
        setSelectedImage(null);
      }
    };

    editor.on("selectionUpdate", syncSelectedVideo);
    editor.on("selectionUpdate", syncSelectedImage);
    editor.on("transaction", syncSelectedImage);
    syncSelectedVideo();
    syncSelectedImage();
    return () => {
      editor.off("selectionUpdate", syncSelectedVideo);
      editor.off("selectionUpdate", syncSelectedImage);
      editor.off("transaction", syncSelectedImage);
    };
  }, [editor]);

  const handleUpdateImage = (updates: {
    width?: string;
    aspectRatio?: string;
    alignment?: "left" | "center" | "right";
  }) => {
    if (!editor) return;
    editor.chain().focus().updateAttributes("image", updates).run();
  };

  useEffect(() => {
    if (!dropdownOpen) return;

    const html = document.documentElement;
    const containers = Array.from(document.querySelectorAll<HTMLElement>(".custom-scrollbar, [data-editor-scroll-container]"));
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: document.body.style.overflow,
      containers: containers.map((element) => ({
        element,
        overflow: element.style.overflow,
        overflowY: element.style.overflowY,
        overscrollBehavior: element.style.overscrollBehavior,
      })),
    };

    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    containers.forEach((element) => {
      element.style.overflow = "hidden";
      element.style.overflowY = "hidden";
      element.style.overscrollBehavior = "none";
    });

    return () => {
      html.style.overflow = previous.htmlOverflow;
      document.body.style.overflow = previous.bodyOverflow;
      previous.containers.forEach(({ element, overflow, overflowY, overscrollBehavior }) => {
        element.style.overflow = overflow;
        element.style.overflowY = overflowY;
        element.style.overscrollBehavior = overscrollBehavior;
      });
    };
  }, [dropdownOpen]);

  const handleDropdownToggle = (isOpen: boolean) => {
    setDropdownOpen(isOpen);
    onDropdownToggle?.(isOpen);
  };

  const handleTextColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;
    
    const selectedColor = event.target.value;
    setTextColor(selectedColor);
    getFocusedEditor(editor).setColor(selectedColor).run();
  };

  const options = [
    {
      label: "Đoạn văn",
      onClick: () => {
        if (!editor) return;
        getFocusedEditor(editor).setParagraph().run();
      },
    },
    {
      label: "Tiêu đề 1",
      onClick: () => {
        if (!editor) return;
        getFocusedEditor(editor).toggleHeading({ level: 1 }).run();
      },
    },
    {
      label: "Tiêu đề 2",
      onClick: () => {
        if (!editor) return;
        getFocusedEditor(editor).toggleHeading({ level: 2 }).run();
      },
    },
    {
      label: "Tiêu đề 3",
      onClick: () => {
        if (!editor) return;
        getFocusedEditor(editor).toggleHeading({ level: 3 }).run();
      },
    },
  ];

  const getLabel = (): string => {
    if (!editor) return "Đoạn văn";
    
    if (editor.isActive("heading", { level: 1 })) return "Tiêu đề 1";
    if (editor.isActive("heading", { level: 2 })) return "Tiêu đề 2";
    if (editor.isActive("heading", { level: 3 })) return "Tiêu đề 3";

    return "Đoạn văn";
  };

  const handleLinkSubmit = ({ url, openInNewTab }: linkOption) => {
    if (!editor) return;
    
    const { commands } = editor;
    commands.setLink(getEditorLinkAttributes(url, openInNewTab));
  };

  const handleEmbedYoutube = (url: string) => {
    if (!editor) return;
    
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const handleEmbedFacebookReels = (url: string) => {
    if (!editor) return;

    let normalizedUrl = url.trim();

    if (!normalizedUrl.includes("facebook.com")) {
      alert("Vui lòng nhập URL Facebook Reels hợp lệ");
      return;
    }

    const encodedUrl = encodeURIComponent(normalizedUrl);
    const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=500&height=281`;

    editor.chain().focus().setFacebookReel({ src: embedUrl }).run();
  };

  const handleEmbedCloudinaryVideo = (video: {
    src: string;
    name?: string;
    aspectRatio?: "square" | "vertical" | "horizontal";
  }) => {
    if (!editor) return;

    const options = {
      src: video.src,
      title: video.name || "Video Univi",
      aspectRatio: video.aspectRatio || "horizontal",
    };

    if (selectedCloudinaryVideo) {
      (editor.chain().focus() as any).updateAttributes("cloudinaryVideo", options).run();
      return;
    }

    (editor.chain().focus() as any).setCloudinaryVideo(options).run();
  };

  const handleEmbedImage = (url: string, altText?: string, caption?: string) => {
    if (!editor) return;
    
    (editor.chain().focus() as any).setImage({ src: url, alt: altText || "", caption: caption || "" }).run();
  };

  const handleInsertTable = (rows: number, cols: number, withHeaderRow: boolean) => {
    if (!editor) return;
    
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow })
      .run();
  };

  const handleInsertAdBanner = (options: { src: string; href: string; alt?: string }) => {
    if (!editor) return;
    editor.chain().focus().setAdBanner(options).run();
  };

  const handleInsertComponent = (name: string, props?: Record<string, string>) => {
    if (!editor) return;
    editor.chain().focus().setEmbedComponent({ name, props: props ? JSON.stringify(props) : "{}" }).run();
  };

  const handleInsertContactCTA = () => {
    if (!editor) return;

    const ctaHtml = `<p><strong>UNIVI SPORTS UNIFORM — YOUR UNIFORM, YOUR BRAND!</strong><br /><strong>Văn phòng giao dịch:</strong> Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, thành phố Hà Nội<br /><strong>Hotline:</strong> <a href="tel:0834204999">0834.204.999</a> · <a href="tel:0961567997">0961.567.997</a><br /><strong>Giờ làm việc:</strong> 08:00 - 18:00, Thứ 2 - Chủ nhật<br /><strong>Website:</strong> <a href="https://dongphucunivi.com" target="_blank" rel="noopener noreferrer">https://dongphucunivi.com</a><br /><strong>Email:</strong> <a href="mailto:dongphucunivi@gmail.com">dongphucunivi@gmail.com</a><br /><strong>Phạm vi phục vụ:</strong> Toàn quốc</p>`;

    const doc = editor.state.doc;
    const lastNode = doc.lastChild;

    // Nếu khối cuối cùng là paragraph rỗng thì thay thế trực tiếp, tránh tạo khoảng cách/dòng trống thừa ở trên
    if (lastNode && lastNode.isTextblock && lastNode.textContent.trim() === "") {
      const from = Math.max(0, doc.content.size - lastNode.nodeSize);
      const to = doc.content.size;
      editor.chain().focus().deleteRange({ from, to }).insertContent(ctaHtml).run();
    } else {
      editor.chain().focus("end").insertContent(ctaHtml).run();
    }

    toast.success("Đã chèn đoạn CTA thông tin liên hệ vào cuối bài viết!");
  };

  const Head = () => {
    return (
      <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
        <span className="text-sm">{getLabel()}</span>
        <AiFillCaretDown size={12} />
      </div>
    );
  };

  // Early return after all hooks
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 p-3 bg-white dark:bg-gray-800 border-b border-[#105d97]/20 dark:border-gray-700 min-h-[60px]">
      {/* Text Formatting Group */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <DropdownOptions options={options} head={<Head />} />
        
        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <Button
          active={editor.isActive("bold")}
          onClick={() => getFocusedEditor(editor).toggleBold().run()}
        >
          <BsTypeBold />
        </Button>

        <Button
          active={editor.isActive("italic")}
          onClick={() => getFocusedEditor(editor).toggleItalic().run()}
        >
          <BsTypeItalic />
        </Button>

        <Button
          active={editor.isActive("underline")}
          onClick={() => getFocusedEditor(editor).toggleUnderline().run()}
        >
          <BsTypeUnderline />
        </Button>

        <Button
          active={editor.isActive("strike")}
          onClick={() => getFocusedEditor(editor).toggleStrike().run()}
        >
          <BsTypeStrikethrough />
        </Button>

        {/* Color Picker */}
        <div className="flex items-center gap-1 ml-1">
          <input
            type="color"
            value={textColor}
            onChange={handleTextColorChange}
            title="Chọn màu chữ"
            className="w-6 h-6 p-0 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Alignment Group */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <Button
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <MdFormatAlignLeft />
        </Button>

        <Button
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <MdFormatAlignCenter />
        </Button>

        <Button
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <MdFormatAlignRight />
        </Button>
      </div>

      {/* Content Formatting Group */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <Button
          active={editor.isActive("blockquote")}
          onClick={() => getFocusedEditor(editor).toggleBlockquote().run()}
        >
          <RiDoubleQuotesL />
        </Button>

        <Button
          active={editor.isActive("code")}
          onClick={() => getFocusedEditor(editor).toggleCode().run()}
        >
          <BsCode />
        </Button>

        <Button
          active={editor.isActive("codeBlock")}
          onClick={() => getFocusedEditor(editor).toggleCodeBlock().run()}
        >
          <BsBraces />
        </Button>

        <InsertLink onSubmit={handleLinkSubmit} onToggle={handleDropdownToggle} />
        <FindReplace editor={editor} onToggle={handleDropdownToggle} />

        <Button
          active={editor.isActive("orderedList")}
          onClick={() => getFocusedEditor(editor).toggleOrderedList().run()}
        >
          <BsListOl />
        </Button>

        <Button
          active={editor.isActive("bulletList")}
          onClick={() => getFocusedEditor(editor).toggleBulletList().run()}
        >
          <BsListUl />
        </Button>
      </div>

      {/* Media & Tools Group */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <EmbedYoutube onSubmit={handleEmbedYoutube} onToggle={handleDropdownToggle} />
        <EmbedFacebookReels onSubmit={handleEmbedFacebookReels} onToggle={handleDropdownToggle} />
        <EmbedCloudinaryVideo
          onSubmit={handleEmbedCloudinaryVideo}
          onToggle={handleDropdownToggle}
          selectedVideo={selectedCloudinaryVideo}
          centered
        />
        <EmbedImage onSubmit={handleEmbedImage} onToggle={handleDropdownToggle} />
        <InsertAdBanner onSubmit={handleInsertAdBanner} onToggle={handleDropdownToggle} />
        <InsertComponent onSubmit={handleInsertComponent} onToggle={handleDropdownToggle} />

        <Button onClick={handleInsertContactCTA}>
          <div
            className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
            title="Chèn đoạn CTA thông tin liên hệ Univi vào cuối bài viết"
          >
            <FiPhoneCall className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-bold tracking-tight whitespace-nowrap">CTA Liên hệ</span>
          </div>
        </Button>

        <Button onClick={onOpenImageClick}>
          <BsImageFill title="Chèn một ảnh (Cloudinary)" />
        </Button>

        {onOpenR2ModalClick && (
          <Button onClick={onOpenR2ModalClick}>
            <div className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400 font-semibold" title="Kho ảnh Cloudflare R2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
              <span className="text-[10px] font-bold tracking-tight">R2</span>
            </div>
          </Button>
        )}

        {onOpenR2GalleryClick && (
          <Button onClick={onOpenR2GalleryClick}>
            <div className="flex items-center gap-1 text-[#105d97] dark:text-sky-400 font-semibold" title="Kho Album Gallery từ Cloudflare R2 (Lưu & Chọn nhanh)">
              <BsImages className="w-4 h-4" />
              <span className="text-[9px] font-bold tracking-tight bg-sky-100 dark:bg-sky-950/60 px-1 py-0.2 rounded text-[#105d97] dark:text-sky-300">R2</span>
            </div>
          </Button>
        )}

        {onOpenGalleryClick && (
          <Button onClick={onOpenGalleryClick}>
            <BsImages title="Chèn Gallery ảnh (Flickr)" />
          </Button>
        )}

        {/* Nhóm chức năng Resize & Tỷ lệ ảnh khi đang chọn ảnh trong Editor */}
        {selectedImage && (
          <div className="flex items-center gap-1.5 bg-sky-50 dark:bg-sky-950/50 px-2 py-1 rounded-lg border border-[#105d97]/40 dark:border-sky-500/40 animate-in fade-in flex-shrink-0">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#105d97] dark:text-sky-300">
              <BsImageFill size={12} />
              <span>Ảnh ({selectedImage.width}):</span>
            </div>

            {/* Resize pills */}
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-md p-0.5 border border-gray-200 dark:border-gray-600 text-[10px]">
              {["25%", "50%", "75%", "100%"].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleUpdateImage({ width: sz })}
                  className={`px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                    (selectedImage.width || "100%") === sz
                      ? "bg-[#105d97] text-white shadow-xs"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  title={`Resize ảnh thành ${sz}`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Ratio dropdown */}
            <div className="flex items-center gap-1 text-[11px] bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded-md border border-gray-200 dark:border-gray-600">
              <MdAspectRatio className="text-[#105d97] dark:text-sky-300" size={13} />
              <select
                value={selectedImage.aspectRatio || "auto"}
                onChange={(e) => handleUpdateImage({ aspectRatio: e.target.value })}
                className="bg-transparent text-gray-700 dark:text-gray-200 text-[11px] font-semibold focus:outline-none cursor-pointer"
                title="Chỉnh tỷ lệ khung hình ảnh"
              >
                <option value="auto">Gốc (Auto)</option>
                <option value="16/9">16:9 (Ngang)</option>
                <option value="4/3">4:3 (Chuẩn)</option>
                <option value="1/1">1:1 (Vuông)</option>
                <option value="3/2">3:2 (Nhiếp ảnh)</option>
                <option value="9/16">9:16 (Dọc)</option>
              </select>
            </div>

            {/* Align pills */}
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-md p-0.5 border border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={() => handleUpdateImage({ alignment: "left" })}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  selectedImage.alignment === "left"
                    ? "bg-[#105d97] text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
                }`}
                title="Căn trái ảnh"
              >
                <MdFormatAlignLeft size={13} />
              </button>
              <button
                type="button"
                onClick={() => handleUpdateImage({ alignment: "center" })}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  (selectedImage.alignment || "center") === "center"
                    ? "bg-[#105d97] text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
                }`}
                title="Căn giữa ảnh"
              >
                <MdFormatAlignCenter size={13} />
              </button>
              <button
                type="button"
                onClick={() => handleUpdateImage({ alignment: "right" })}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  selectedImage.alignment === "right"
                    ? "bg-[#105d97] text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
                }`}
                title="Căn phải ảnh"
              >
                <MdFormatAlignRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table Tools Group */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Insert table với form chọn số hàng/cột */}
        <InsertTable onSubmit={handleInsertTable} onToggle={handleDropdownToggle} />

        {/* Thêm hàng */}
        <Button
          onClick={() => editor.chain().focus().addRowAfter().run()}
        >
          <MdTableRows title="Thêm hàng bên dưới" />
        </Button>

        {/* Xóa hàng */}
        <Button
          onClick={() => editor.chain().focus().deleteRow().run()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <title>Xóa hàng hiện tại</title>
            <rect x="1" y="2" width="14" height="12" rx="1"/>
            <line x1="1" y1="6" x2="15" y2="6"/>
            <line x1="1" y1="10" x2="15" y2="10"/>
            <line x1="5" y1="7.2" x2="11" y2="8.8"/>
            <line x1="11" y1="7.2" x2="5" y2="8.8"/>
          </svg>
        </Button>

        {/* Thêm cột */}
        <Button
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        >
          <MdTableView title="Thêm cột bên phải" />
        </Button>

        {/* Xóa cột */}
        <Button
          onClick={() => editor.chain().focus().deleteColumn().run()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <title>Xóa cột hiện tại</title>
            <rect x="1" y="2" width="14" height="12" rx="1"/>
            <line x1="6" y1="2" x2="6" y2="14"/>
            <line x1="10" y1="2" x2="10" y2="14"/>
            <line x1="7.2" y1="5" x2="8.8" y2="11"/>
            <line x1="8.8" y1="5" x2="7.2" y2="11"/>
          </svg>
        </Button>

        {/* Xóa bảng */}
        <Button
          onClick={() => editor.chain().focus().deleteTable().run()}
        >
          <MdDeleteOutline title="Xóa bảng" />
        </Button>
      </div>
    </div>
  );
};

export default ToolBar;
