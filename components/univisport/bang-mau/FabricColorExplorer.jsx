import { useMemo, useState } from "react";
import { Search, ChevronRight, SearchX } from "lucide-react";
import ContactForm from "../../header/ContactForm";
import ColorSwatchCard from "./ColorSwatchCard";
import ColorDetailModal from "./ColorDetailModal";
import { colorFamilies, searchColors } from "../../../data/fabric-colors";

function FabricPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#105d97] focus-visible:ring-offset-2 ${active
        ? "bg-[#105d97] text-white shadow-sm"
        : "bg-white text-gray-600 border border-gray-200 hover:border-[#105d97] hover:text-[#105d97]"
        }`}
    >
      {children}
    </button>
  );
}

function FamilyChip({ active, label, swatch, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 flex-col items-center gap-1.5 rounded-xl px-2.5 py-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#105d97] ${active ? "bg-[#eaf2fb]" : "hover:bg-gray-50"
        }`}
    >
      <span
        className={`h-8 w-8 rounded-full ${swatch === "#FFFFFF" ? "border border-gray-300" : "border border-black/5"} ${active ? "ring-2 ring-[#105d97] ring-offset-2" : ""}`}
        style={{ backgroundColor: swatch }}
        aria-hidden="true"
      />
      <span className={`text-[11px] font-medium ${active ? "text-[#105d97]" : "text-gray-600"}`}>{label}</span>
    </button>
  );
}

function FabricTabCard({ fabric, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-2xl border-2 p-4 text-left transition-colors duration-150 ${active ? "border-[#105d97] bg-[#eaf2fb]" : "border-gray-100 bg-white hover:border-gray-300"
        }`}
    >
      <p className={`text-sm font-bold uppercase tracking-wide ${active ? "text-[#105d97]" : "text-gray-900"}`}>
        {fabric.name}
      </p>
      <p className="mt-1 text-xs leading-5 text-gray-500">{fabric.composition}</p>
      <p className="text-xs leading-5 text-gray-500">{fabric.weight}</p>
      <p className="mt-2 text-[11px] font-semibold text-[#105d97]">{fabric.colorCount} màu</p>
    </button>
  );
}

export default function FabricColorExplorer({ fabrics, colors, featuredColors }) {
  const [selectedFabric, setSelectedFabric] = useState("all");
  const [selectedFamily, setSelectedFamily] = useState("all");
  const [search, setSearch] = useState("");
  const [activeColor, setActiveColor] = useState(null);
  const [contactModal, setContactModal] = useState({ open: false, source: "" });

  const fabricBySlug = useMemo(() => {
    const map = new Map();
    fabrics.forEach((f) => map.set(f.slug, f));
    return map;
  }, [fabrics]);

  const visibleFabrics = selectedFabric === "all" ? fabrics : fabrics.filter((f) => f.slug === selectedFabric);

  const filteredByFabric = useMemo(() => {
    const result = new Map();
    visibleFabrics.forEach((fabric) => {
      let list = colors.filter((c) => c.fabricSlug === fabric.slug);
      if (selectedFamily !== "all") list = list.filter((c) => c.family === selectedFamily);
      list = searchColors(list, search);
      result.set(fabric.slug, list);
    });
    return result;
  }, [visibleFabrics, colors, selectedFamily, search]);

  const totalFilteredCount = Array.from(filteredByFabric.values()).reduce((sum, list) => sum + list.length, 0);

  const openColorDetail = (color) => setActiveColor(color);
  const closeColorDetail = () => setActiveColor(null);

  const handleRequestSample = (color, fabric) => {
    setActiveColor(null);
    setContactModal({
      open: true,
      source: `Bảng màu - Yêu cầu mẫu vải: ${fabric ? `${fabric.name} — ` : ""}${color.name} No.${color.code}`,
    });
  };

  const handleRequestConsult = (color, fabric) => {
    setActiveColor(null);
    setContactModal({
      open: true,
      source: `Bảng màu - Tư vấn màu: ${fabric ? `${fabric.name} — ` : ""}${color.name} No.${color.code}`,
    });
  };

  const resetToFullLibrary = () => {
    setSelectedFabric("all");
    setSelectedFamily("all");
    setSearch("");
  };

  return (
    <section className="bg-gray-50 pb-14 md:pb-20">
      <div className="container mx-auto px-4">
        {/* ── Filter panel ─────────────────────────────────────── */}
        <div className="relative z-10 -mt-10 rounded-3xl border border-gray-100 bg-white p-5 shadow-lg md:-mt-10 md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <p id="fabric-filter-label" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Chọn chất liệu
              </p>
              <div role="group" aria-labelledby="fabric-filter-label" className="mt-3 flex flex-wrap gap-2">
                <FabricPill active={selectedFabric === "all"} onClick={() => setSelectedFabric("all")}>
                  Tất cả
                </FabricPill>
                {fabrics.map((fabric) => (
                  <FabricPill
                    key={fabric.slug}
                    active={selectedFabric === fabric.slug}
                    onClick={() => setSelectedFabric(fabric.slug)}
                  >
                    {fabric.name}
                  </FabricPill>
                ))}
              </div>
            </div>

            <div className="w-full lg:max-w-xs">
              <label htmlFor="color-search" className="sr-only">
                Tìm theo tên hoặc mã màu
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="color-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm theo tên hoặc mã màu..."
                  className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 transition-colors focus:border-[#105d97] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#105d97]/30"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <p id="family-filter-label" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Chọn nhóm màu
            </p>
            <div
              role="group"
              aria-labelledby="family-filter-label"
              className="-mx-1 mt-3 flex gap-1 overflow-x-auto px-1 pb-1"
              style={{ scrollbarWidth: "thin" }}
            >
              <FamilyChip
                active={selectedFamily === "all"}
                label="Tất cả"
                swatch="#e5e7eb"
                onClick={() => setSelectedFamily("all")}
              />
              {colorFamilies.map((family) => (
                <FamilyChip
                  key={family.slug}
                  active={selectedFamily === family.slug}
                  label={family.label}
                  swatch={family.swatch}
                  onClick={() => setSelectedFamily(family.slug)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Featured colors ──────────────────────────────────── */}
        <div className="mt-10 md:mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-gray-900 md:text-2xl">Màu tiêu biểu</h2>
              <p className="mt-1 text-sm text-gray-500">
                Những màu được sử dụng phổ biến trong các chất liệu
              </p>
            </div>
            <button
              type="button"
              onClick={resetToFullLibrary}
              className="flex items-center gap-1 text-sm font-semibold text-[#105d97] hover:underline"
            >
              Xem tất cả <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-8">
            {featuredColors.map((color) => (
              <ColorSwatchCard
                key={color.id}
                color={color}
                fabricName={fabricBySlug.get(color.fabricSlug)?.name}
                onClick={() => openColorDetail(color)}
              />
            ))}
          </div>
        </div>

        {/* ── Fabric color library ─────────────────────────────── */}
        <div id="bang-mau-theo-chat-lieu" className="mt-14 scroll-mt-24 md:mt-20">
          <h2 className="text-xl font-bold uppercase tracking-tight text-gray-900 md:text-2xl">
            Bảng màu theo chất liệu
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Chọn một chất liệu để xem đầy đủ màu vải tương ứng, hoặc xem tất cả bên dưới.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {fabrics.map((fabric) => (
              <FabricTabCard
                key={fabric.slug}
                fabric={fabric}
                active={selectedFabric === fabric.slug}
                onClick={() => setSelectedFabric(fabric.slug)}
              />
            ))}
          </div>

          <div className="mt-10 space-y-14">
            {visibleFabrics.map((fabric) => {
              const list = filteredByFabric.get(fabric.slug) || [];
              return (
                <div key={fabric.slug} id={fabric.slug} className="scroll-mt-24">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Vải {fabric.name}</h3>
                      <p className="text-xs text-gray-500">
                        {fabric.composition} · {fabric.weight}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#eaf2fb] px-3 py-1 text-xs font-semibold text-[#105d97]">
                      {list.length} màu
                    </span>
                  </div>

                  {list.length === 0 ? (
                    <p className="mt-6 text-sm text-gray-400">
                      Không có màu nào khớp với bộ lọc hiện tại trong vải {fabric.name}.
                    </p>
                  ) : (
                    <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4 lg:grid-cols-8">
                      {list.map((color) => (
                        <ColorSwatchCard key={color.id} color={color} onClick={() => openColorDetail(color)} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {totalFilteredCount === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-gray-200 bg-white py-14 text-center">
                <SearchX className="h-8 w-8 text-gray-300" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-500">
                  Không tìm thấy màu phù hợp. Thử từ khoá khác hoặc bỏ bớt bộ lọc.
                </p>
                <button
                  type="button"
                  onClick={resetToFullLibrary}
                  className="text-sm font-semibold text-[#105d97] hover:underline"
                >
                  Xoá bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeColor && (
        <ColorDetailModal
          color={activeColor}
          fabric={fabricBySlug.get(activeColor.fabricSlug)}
          onClose={closeColorDetail}
          onRequestSample={handleRequestSample}
          onRequestConsult={handleRequestConsult}
        />
      )}

      <ContactForm
        isModal
        isOpen={contactModal.open}
        source={contactModal.source}
        onClose={() => setContactModal({ open: false, source: "" })}
      />
    </section>
  );
}
