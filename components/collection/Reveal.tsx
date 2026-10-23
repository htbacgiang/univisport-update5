import { ReactNode } from "react";
import { useInView } from "../../hooks/useInView";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

// Thin scroll-reveal wrapper reusing the project's existing fade-up keyframe
// (tailwind.config.js) and motion-safe: convention — no animation library added.
// Always renders a <div>; wrap it in whatever semantic element the caller needs.
export default function Reveal({ children, className = "", delayMs = 0 }: RevealProps) {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-reveal
      className={`${className} ${isInView ? "motion-safe:animate-fade-up" : "motion-safe:opacity-0"}`}
      style={isInView && delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
