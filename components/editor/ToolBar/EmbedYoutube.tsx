import { FC, useCallback, useRef, useState } from "react";
import { BsYoutube } from "react-icons/bs";
import Button from "../ToolBar/Button";
import useOutsideClick from "./useOutsideClick";

interface Props {
  onSubmit(link: string): void;
  onToggle?(isOpen: boolean): void;
}

const EmbedYoutube: FC<Props> = ({ onSubmit, onToggle }): JSX.Element => {
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
        <BsYoutube />
      </Button>

      {visible && (
        <div className="absolute top-full mt-4 right-0 z-50">
          <div className="flex space-x-2">
            <input
              autoFocus
              type="text"
              className="bg-white dark:bg-gray-800 rounded border-2 border-secondary-dark focus:border-primary-dark dark:focus:border-primary transition p-2 text-primary-dark dark:text-primary"
              placeholder="https://youtube.com"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
            <button
              onClick={handleSubmit}
              className="bg-action p-2 text-primary rounded text-sm"
            >
              Embed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmbedYoutube;
