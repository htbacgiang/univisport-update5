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

  return (
    <button
      type="button"
      onMouseDown={onMouseDown}
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
