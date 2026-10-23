import React, { useState, useEffect } from "react";
import { HeadingItem } from "../../utils/toc";

interface TableOfContentsProps {
  headings: HeadingItem[];
  onHeadingClick?: () => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings, onHeadingClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScrollActive = () => {
      // Offsets: sticky header is around 80px, let's use 110px offset for trigger margin
      const scrollPosition = window.scrollY + 110;
      
      let currentActiveId = "";
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        const el = document.getElementById(heading.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentActiveId = heading.id;
          } else {
            break; // Headings are ordered, so we stop checking
          }
        }
      }

      // Fallback: If we scrolled to the very bottom, activate the last heading
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        currentActiveId = headings[headings.length - 1].id;
      }
      
      if (currentActiveId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener("scroll", handleScrollActive);
    // Run once initially
    handleScrollActive();

    return () => {
      window.removeEventListener("scroll", handleScrollActive);
    };
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    // Call heading click callback if provided (e.g. to expand parent containers)
    if (onHeadingClick) {
      onHeadingClick();
    }

    const element = document.getElementById(id);
    if (element) {
      // Scroll to element with 100px offset for sticky header
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveId(id);
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <div className="toc-container my-4 border border-[#105d97]/15 rounded-xl bg-gray-50/70 p-3 md:p-4 transition-all duration-300 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-[#105d97]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          <span className="font-bold text-gray-900 text-sm md:text-base">
            Mục lục bài viết
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs font-semibold text-[#105d97] hover:text-[#0e4a7a] focus:outline-none transition-colors duration-200"
          type="button"
        >
          <span>{isExpanded ? "Thu gọn" : "Mở rộng"}</span>
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <div
        className={`toc-content transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[400px] opacity-100 overflow-y-auto pr-1.5" : "max-h-0 opacity-0 overflow-hidden pointer-events-none"
        }`}
      >
        <style jsx>{`
          .toc-content::-webkit-scrollbar {
            width: 4px;
          }
          .toc-content::-webkit-scrollbar-track {
            background: transparent;
          }
          .toc-content::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 2px;
          }
          .toc-content::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>
        <nav className="space-y-1 pl-1">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;

            let levelClass = "";
            let pyClass = "py-1";
            if (heading.level === 1) {
              levelClass = "text-xs md:text-sm font-bold text-gray-900";
            } else if (heading.level === 2) {
              levelClass = "text-xs md:text-sm font-semibold text-gray-800";
            } else if (heading.level === 3) {
              levelClass = "pl-4 text-xs text-gray-600 border-l border-gray-200";
              pyClass = "py-0.5";
            } else if (heading.level === 4) {
              levelClass = "pl-7 text-[11px] text-gray-500 border-l border-gray-200";
              pyClass = "py-0.5";
            } else if (heading.level === 5) {
              levelClass = "pl-10 text-[10px] text-gray-400 border-l border-gray-200";
              pyClass = "py-0.5";
            } else if (heading.level === 6) {
              levelClass = "pl-12 text-[9px] text-gray-400 border-l border-gray-200";
              pyClass = "py-0.5";
            }

            let activeClass = "";
            if (isActive) {
              if (heading.level <= 2) {
                activeClass = "text-[#105d97] font-bold translate-x-0.5";
              } else {
                let paddingClass = "pl-[14px]";
                if (heading.level === 4) {
                  paddingClass = "pl-[26px]";
                } else if (heading.level === 5) {
                  paddingClass = "pl-[38px]";
                } else if (heading.level === 6) {
                  paddingClass = "pl-[46px]";
                }
                activeClass = `text-[#105d97] font-bold border-l-2 border-[#105d97] ${paddingClass} -ml-[1px]`;
              }
            } else {
              activeClass = "hover:text-[#105d97] hover:translate-x-0.5";
            }

            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={(e) => handleScroll(e, heading.id)}
                className={`block transition-all duration-200 leading-6 cursor-pointer transform ${levelClass} ${pyClass} ${activeClass}`}
              >
                {heading.text}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TableOfContents;
