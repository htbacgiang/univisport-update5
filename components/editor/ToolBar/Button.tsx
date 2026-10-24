import { FC, MouseEventHandler, ReactNode } from "react";

interface Props {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onMouseDown?: MouseEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onBlur?: () => void;
  className?: string;
}

const Button: FC<Props> = ({
  children,
  active,
  disabled,
  onMouseDown,
  onClick,
  onBlur,
  className = "",
}) => {
  const activeClass = active ? "active" : "";
  const combinedClasses = `toolbar-button ${activeClass} ${className}`.trim();

  const handleMouseDown: MouseEventHandler<HTMLButtonElement> = (e) => {
    // Ngăn chặn toolbar button làm mất focus / mất con trỏ chuột trong editor
    e.preventDefault();
    if (onMouseDown) {
      onMouseDown(e);
    }
  };

  return (
    <button
      type="button"
      onMouseDown={handleMouseDown}
      onClick={onClick}
      onBlur={onBlur}
      className={combinedClasses}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
