import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LookbookItem, LookbookSize } from "../../data/collection/lookbookItems";
import { CollectionFilter } from "../../data/collection/filters";
import { useInView } from "../../hooks/useInView";
import Reveal from "./Reveal";
import LookbookLightbox from "./LookbookLightbox";

interface EditorialLookbookProps {
  items: LookbookItem[];
  filters: CollectionFilter[];
  activeFilter: string;
}

const sizeClasses: Record<LookbookSize, string> = {
  md: "col-span-1 row-span-1",
  tall: "col-span-1 row-span-2",
  lg: "col-span-2 row-span-2",
};

const FLY_CLASSES = [
  "anim-fly-left",
  "anim-fly-right",
  "anim-fly-top",
  "anim-fly-bottom",
  "anim-fly-top-left",
  "anim-fly-bottom-right",
  "anim-fly-top-right",
  "anim-fly-bottom-left",
];

interface LookbookCardProps {
  item: LookbookItem;
  effectiveSize?: LookbookSize;
  index: number;
  onOpen: () => void;
}

function LookbookCard({ item, effectiveSize, index, onOpen }: LookbookCardProps) {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const flyClass = FLY_CLASSES[index % FLY_CLASSES.length];
  const size = effectiveSize || item.size;

  return (
    <div
      ref={ref}
      className={`${sizeClasses[size]} ${isInView ? flyClass : "opacity-0"}`}
      style={isInView ? { animationDelay: `${(index % 4) * 100}ms` } : undefined}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Xem ảnh lớn: ${item.alt}`}
        className="group relative w-full h-full overflow-hidden bg-secondary-light/40 cursor-zoom-in shadow-sm hover:shadow-md transition-all duration-300 block"
      >
        <Image
          src={item.image}
          alt={item.alt}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 50vw, 25vw"
          style={{ objectFit: "cover" }}
          className="transition-transform duration-700 ease-out group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end justify-between p-3 md:p-4">
          <span className="text-white text-xs md:text-sm font-medium line-clamp-1 drop-shadow-sm text-left">
            {item.alt}
          </span>
          <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center shrink-0 ml-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </span>
        </div>
      </button>
    </div>
  );
}

export default function EditorialLookbook({ items, filters, activeFilter }: EditorialLookbookProps) {
  const visibleItems = items.filter(
    (item) => activeFilter === "all" || item.filterIds.includes(activeFilter)
  );
  const activeFilterMeta = filters.find((f) => f.id === activeFilter);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Bộ lọc đổi => danh sách ảnh đang mở lightbox không còn khớp, đóng lại cho an toàn.
  useEffect(() => {
    setLightboxIndex(null);
  }, [activeFilter]);

  // Thuật toán sắp xếp tự động chuẩn hóa ô vuông:
  // 1. Nhóm các ảnh nhỏ (md) thành từng cặp 2 ô xếp chồng lên nhau (chiều cao 2 hàng).
  // 2. Nếu có ô md lẻ, tự động nâng chiều cao thành "tall" (2 hàng) để không bỏ trống ô bên dưới.
  // 3. Đảm bảo tổng số cột hiển thị luôn là bội số của 4 (trên desktop 4 cột), triệt tiêu khoảng trắng cuối lưới.
  const processedItems = useMemo(() => {
    const lgItems: LookbookItem[] = [];
    const tallItems: LookbookItem[] = [];
    const mdItems: LookbookItem[] = [];

    visibleItems.forEach((item) => {
      if (item.size === "lg") lgItems.push(item);
      else if (item.size === "tall") tallItems.push(item);
      else mdItems.push(item);
    });

    const mdUnits: { item: LookbookItem; effectiveSize: LookbookSize }[][] = [];
    let mdIdx = 0;
    while (mdIdx < mdItems.length) {
      if (mdIdx + 1 < mdItems.length) {
        mdUnits.push([
          { item: mdItems[mdIdx], effectiveSize: "md" },
          { item: mdItems[mdIdx + 1], effectiveSize: "md" },
        ]);
        mdIdx += 2;
      } else {
        // Ô md lẻ: chuyển thành tall (2 hàng) để khớp chiều cao vuông vắn
        mdUnits.push([{ item: mdItems[mdIdx], effectiveSize: "tall" }]);
        mdIdx += 1;
      }
    }

    const colUnits: { items: { item: LookbookItem; effectiveSize: LookbookSize }[]; width: number }[] = [];

    // Ghép lần lượt lg, tall và mdUnits
    lgItems.forEach((item) => colUnits.push({ items: [{ item, effectiveSize: "lg" }], width: 2 }));
    tallItems.forEach((item) => colUnits.push({ items: [{ item, effectiveSize: "tall" }], width: 1 }));
    mdUnits.forEach((unit) => colUnits.push({ items: unit, width: 1 }));

    // Cân bằng tổng chiều rộng cột để lấp đầy số cột (bội số 4)
    let totalCols = colUnits.reduce((acc, u) => acc + u.width, 0);
    const remainder = totalCols % 4;

    if (remainder !== 0) {
      const needed = 4 - remainder;
      let added = 0;
      for (let i = colUnits.length - 1; i >= 0 && added < needed; i--) {
        if (colUnits[i].width === 1 && colUnits[i].items.length === 1) {
          colUnits[i].width = 2;
          colUnits[i].items[0].effectiveSize = "lg";
          added += 1;
        }
      }
    }

    const result: { item: LookbookItem; effectiveSize: LookbookSize }[] = [];
    colUnits.forEach((u) => {
      u.items.forEach((entry) => result.push(entry));
    });

    return result;
  }, [visibleItems]);

  const rawVisibleItems = useMemo(() => processedItems.map((p) => p.item), [processedItems]);

  return (
    <section className="container mx-auto px-4 md:px-6 py-10 md:py-24 overflow-hidden">
      <Reveal className="text-center mb-6 md:mb-10">
        <h2 className="font-hero uppercase text-3xl md:text-5xl text-primary-dark mb-3">
          Editorial Lookbook
        </h2>
        <p className="text-secondary-dark text-sm md:text-base max-w-2xl mx-auto">
          Góc nhìn thực tế về đồng phục Univi trên sân tập, sàn đấu và trong từng đội nhóm.
        </p>
      </Reveal>

      {activeFilter !== "all" && activeFilterMeta?.href && (
        <div className="text-center mb-8">
          <Link
            href={activeFilterMeta.href}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            Xem tất cả bộ sưu tập {activeFilterMeta.label} →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 grid-flow-dense auto-rows-[160px] sm:auto-rows-[190px] md:auto-rows-[220px] lg:auto-rows-[240px]">
        {processedItems.map(({ item, effectiveSize }, i) => (
          <LookbookCard
            key={`${activeFilter}-${item.id}`}
            item={item}
            effectiveSize={effectiveSize}
            index={i}
            onOpen={() => setLightboxIndex(i)}
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <LookbookLightbox
          items={rawVisibleItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}
