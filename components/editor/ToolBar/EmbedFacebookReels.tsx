import { FC, useCallback, useRef, useState } from "react";
import { BsFacebook } from "react-icons/bs";
import Button from "../ToolBar/Button";
import useOutsideClick from "./useOutsideClick";

interface Props {
  onSubmit(link: string): void;
  onToggle?(isOpen: boolean): void;
}

const EmbedFacebookReels: FC<Props> = ({ onSubmit, onToggle }): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = () => {
    if (!url.trim()) return hideForm();

    onSubmit(url);
    setUrl("");
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
        <BsFacebook />
      </Button>

      {visible && (
        <div className="absolute top-full mt-4 right-0 z-50">
          <div className="flex space-x-2">
            <input
              autoFocus
              type="text"
              className="bg-white dark:bg-gray-800 rounded border-2 border-secondary-dark focus:border-primary-dark dark:focus:border-primary transition p-2 text-primary-dark dark:text-primary"
              placeholder="https://www.facebook.com/reel/..."
              value={url}
              onChange={({ target }) => setUrl(target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubmit();
                }
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 text-white rounded text-sm font-medium transition-colors shadow-sm"
            >
              Embed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmbedFacebookReels;

