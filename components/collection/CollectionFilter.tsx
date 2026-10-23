import { CollectionFilter as FilterType } from "../../data/collection/filters";

interface CollectionFilterProps {
  filters: FilterType[];
  activeId: string;
  onChange: (id: string) => void;
}

export default function CollectionFilter({ filters, activeId, onChange }: CollectionFilterProps) {
  return (
    <div
      role="group"
      aria-label="Lọc bộ sưu tập theo bộ môn"
      className="flex items-center gap-2.5 overflow-x-auto scrollbar-none px-4 md:px-0 md:flex-wrap md:justify-center py-1 -mx-4 md:mx-0"
    >
      {filters.map((filter) => {
        const isActive = filter.id === activeId;
        return (
          <button
            key={filter.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(filter.id)}
            className={`shrink-0 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wide whitespace-nowrap transition-colors duration-200 border ${
              isActive
                ? "bg-brand border-brand text-white shadow-sm"
                : "bg-white border-secondary-light text-primary-dark hover:border-brand hover:text-brand"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
