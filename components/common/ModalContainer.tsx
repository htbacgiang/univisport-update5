import {
  FC,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useId,
} from "react";

export interface ModalProps {
  visible?: boolean;
  onClose?(): void;
}

interface Props extends ModalProps {
  children: ReactNode;
}

const ModalContainer: FC<Props> = ({
  visible,
  children,
  onClose,
}) => {
  const containerId = useId();
  const handleClose = useCallback(() => onClose && onClose(), [onClose]);

  const handleClick = ({ target }: any) => {
    if (target.id === containerId) handleClose();
  };

  useEffect(() => {
    const closeModal = ({ key }: any) => key === "Escape" && handleClose();

    document.addEventListener("keydown", closeModal);
    return () => document.removeEventListener("keydown", closeModal);
  }, [handleClose]);

  useEffect(() => {
    if (!visible) return;

    const html = document.documentElement;
    const editorScrollContainers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-editor-scroll-container]")
    );
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousEditorOverflow = editorScrollContainers.map((element) => ({
      element,
      overflow: element.style.overflow,
      overflowY: element.style.overflowY,
    }));

    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    editorScrollContainers.forEach((element) => {
      element.style.overflow = "hidden";
      element.style.overflowY = "hidden";
    });

    return () => {
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      previousEditorOverflow.forEach(({ element, overflow, overflowY }) => {
        element.style.overflow = overflow;
        element.style.overflowY = overflowY;
      });
    };
  }, [visible]);

  if (!visible) return null;
  return (
    <div
      id={containerId}
      onClick={handleClick}
      className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  );
};

export default ModalContainer;
