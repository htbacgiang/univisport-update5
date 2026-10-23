import Image from "next/image";
import { Layers, Palette, CheckCircle2, MessageCircleHeart } from "lucide-react";

// plus a real garment close-up for Polo Cá Sấu.
const FABRIC_IMAGES = {
  "polo-ca-sau": "/images/bang-mau/polo-fabric.webp",
  quickdry: "/images/bang-mau/quickdry-fabric.webp",
  supercool: "/images/bang-mau/supercool-fabric.webp",
  uniair: "/images/bang-mau/uniair-fabric.webp",
};

const FABRIC_ACCENTS = {
  "polo-ca-sau": "#0E6C74",
  quickdry: "#0B1330",
  supercool: "#7A97B4",
  uniair: "#0E9488",
};

const STATS = [
  { icon: Layers, label: "5 dòng chất liệu", sub: "Cao cấp" },
  { icon: Palette, label: "100+ màu vải", sub: "Đa dạng" },
  { icon: CheckCircle2, label: "Màu thực tế", sub: "Theo từng chất liệu" },
  { icon: MessageCircleHeart, label: "Tư vấn màu", sub: "Miễn phí" },
];

const DEFAULT_FABRICS = [
  { slug: "uniair", name: "UNI AIR - UNIA12", composition: "90% Polyester / 10% Elastane" },
  { slug: "supercool", name: "UNI SUPERCOOL - UNIA02", composition: "89% Polyamide / 11% Elastane" },
  { slug: "quickdry", name: "UNI QUICKDRY - UNIA01", composition: "88% Polyester / 12% Elastane" },
  { slug: "polo-ca-sau", name: "UNI COOL PIQUÉ - UNIA114", composition: "86% Polyamide / 14% Elastane" },
];

export default function BangMauHero({ fabrics = DEFAULT_FABRICS }) {
  const fabricList = Array.isArray(fabrics) && fabrics.length > 0 ? fabrics : DEFAULT_FABRICS;
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a2f4d] via-[#0e4676] to-[#105d97]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 14px)",
        }}
        aria-hidden="true"
      />

      <div className="relative container mx-auto px-4 py-14 md:py-18">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Left: copy */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              Univi Material &amp; Color Library
            </p>
            <p
              aria-label="Bảng màu vải Univi"
              className="mt-3 text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              <span aria-hidden="true">
                Bảng màu
                <span className="text-[#7fd4d9]"> vải Univi</span>
              </span>
            </p>
            <p className="mt-5 max-w-xl text-sm leading-6 text-white/80 md:text-base">
              Khám phá hệ thống màu vải dành cho đồng phục thể thao, đồng phục doanh nghiệp và các
              bộ sưu tập đồng phục Univi.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              {STATS.map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/15 bg-white/5 p-3.5 backdrop-blur-sm"
                >
                  <Icon className="h-5 w-5 text-[#7fd4d9]" aria-hidden="true" />
                  <dt className="mt-2 text-sm font-semibold text-white">{label}</dt>
                  <dd className="text-xs text-white/60">{sub}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: fabric cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {fabricList.map((fabric) => {
              const photo = FABRIC_IMAGES[fabric.slug];
              return (
                <a
                  key={fabric.slug}
                  href={`#${fabric.slug}`}
                  className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl p-4 shadow-lg transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{ backgroundColor: FABRIC_ACCENTS[fabric.slug] || "#0e4676" }}
                >
                  {photo ? (
                    <Image
                      src={photo}
                      alt={`Mẫu vải ${fabric.name} thực tế`}
                      fill
                      sizes="(max-width: 640px) 45vw, 220px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span
                      className="pointer-events-none absolute inset-0 opacity-30 transition-opacity duration-200 group-hover:opacity-45"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, rgba(255,255,255,0.25) 0px, rgba(255,255,255,0.25) 1px, transparent 1px, transparent 8px)",
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <span className="relative text-sm font-bold uppercase tracking-wide text-white">
                    {fabric.name}
                  </span>
                  <span className="relative mt-1 text-[11px] leading-4 text-white/80">
                    {fabric.composition}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
