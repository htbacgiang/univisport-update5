import { RefObject, useEffect } from "react";

const useOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onOutsideClick: () => void,
  extraRef?: RefObject<HTMLElement | null>
) => {
  useEffect(() => {
    if (!active) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (ref.current?.contains(target)) return;
      if (extraRef?.current?.contains(target)) return;

      onOutsideClick();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [active, onOutsideClick, ref, extraRef]);
};

export default useOutsideClick;
