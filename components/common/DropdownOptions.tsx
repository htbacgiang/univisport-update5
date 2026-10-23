import { FC, ReactNode, useEffect, useRef, useState } from "react";

export type dropDownOptions = { label: string; onClick(): void }[];

interface Props {
  options: dropDownOptions;
  head: ReactNode;
}

const DropdownOptions: FC<Props> = ({ head, options }): JSX.Element => {
  const containerRef = useRef<HTMLButtonElement>(null);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (!showOptions) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (containerRef.current?.contains(target)) return;

      setShowOptions(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [showOptions]);

  return (
    <button
      ref={containerRef}
      type="button"
      onBlur={() => setShowOptions(false)}
      onMouseDown={() => setShowOptions(!showOptions)}
      className="relative"
    >
      {head}
      {showOptions && (
        <div className="min-w-max absolute top-full mt-4 right-2 z-40 border-2 border-primary-dark dark:border-primary rounded text-left bg-primary dark:bg-primary-dark">
          <ul className="p-3 space-y-3">
            {options.map(({ label, onClick }, index) => {
              return (
                <li
                  className="text-primary-dark dark:text-primary"
                  key={label + index}
                  onMouseDown={onClick}
                >
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </button>
  );
};

export default DropdownOptions;
