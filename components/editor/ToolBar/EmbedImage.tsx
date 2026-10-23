import { FC, useCallback, useRef, useState } from "react";
import { BsLink45Deg } from "react-icons/bs";
import Button from "../ToolBar/Button";
import useOutsideClick from "./useOutsideClick";

interface Props {
  onSubmit(imageUrl: string, altText?: string, caption?: string): void;
  onToggle?(isOpen: boolean): void;
}

const EmbedImage: FC<Props> = ({ onSubmit, onToggle }): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = () => {
    if (!url.trim()) return hideForm();

    onSubmit(url, altText, caption);
    setUrl("");
    setAltText("");
    setCaption("");
    hideForm();
  };

  const hideForm = useCallback(() => {
    setVisible(false);
    onToggle?.(false);
  }, [onToggle]);

  useOutsideClick(containerRef, visible, hideForm);
  
  const showForm = () => {
    setVisible(true);
    onToggle?.(true);
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={({ key }) => {
        if (key === "Escape") hideForm();
      }}
      className="relative"
    >
      <Button onClick={visible ? hideForm : showForm}>
        <BsLink45Deg />
      </Button>

      {visible && (
        <div className="absolute top-full mt-4 right-0 z-50 bg-white dark:bg-gray-800 border-2 border-secondary-dark dark:border-gray-600 rounded p-3 shadow-lg">
          <div className="flex flex-col space-y-2 min-w-[300px]">
            <input
              autoFocus
              type="text"
              className="bg-white dark:bg-gray-800 rounded border-2 border-secondary-dark focus:border-primary-dark dark:focus:border-primary transition p-2 text-primary-dark dark:text-primary"
              placeholder="URL ảnh (ví dụ: https://example.com/image.jpg)"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
            <input
              type="text"
              className="bg-white dark:bg-gray-800 rounded border-2 border-secondary-dark focus:border-primary-dark dark:focus:border-primary transition p-2 text-primary-dark dark:text-primary"
              placeholder="Alt text (mô tả ảnh)"
              value={altText}
              onChange={({ target }) => setAltText(target.value)}
            />
            <input
              type="text"
              className="bg-white dark:bg-gray-800 rounded border-2 border-secondary-dark focus:border-primary-dark dark:focus:border-primary transition p-2 text-primary-dark dark:text-primary"
              placeholder="Chú thích ảnh (Caption - tùy chọn)"
              value={caption}
              onChange={({ target }) => setCaption(target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
            <div className="flex space-x-2 justify-end">
              <button
                onClick={hideForm}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-3 py-1 bg-action text-primary rounded text-sm hover:opacity-90 transition"
              >
                Chèn ảnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmbedImage;
