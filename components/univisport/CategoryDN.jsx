import React from "react";
import Image from "next/image";
import Link from "next/link";

const categories = [
    {
        name: "Đồng phục công ty",
        eyebrow: "ĐỒNG PHỤC DOANH NGHIỆP",
        slug: "/dong-phuc-cong-ty",
        image: "/images/dong-phuc-cong-ty.webp",
        count: 12,
        layout: "col-span-4 row-span-2",
        content: "items-end justify-center text-center",
        copy: "max-w-[250px] items-center",
        imagePosition: "object-center",
        overlay: "bg-gradient-to-br from-black/50 via-black/20 to-transparent",
        titleColor: "text-white",
        eyebrowColor: "text-white/50",
        button: "bg-gradient-to-r from-[#105d97] to-[#0c4d7d] text-white hover:from-[#0c4d7d] hover:to-[#105d97]",
    },
    {
        name: "Đồng phục công sở",
        eyebrow: "ĐỒNG PHỤC CÔNG SỞ",
        slug: "/dong-phuc-cong-so",
        image: "/product/cong-so.jpg",
        count: 15,
        layout: "col-span-4",
        content: "items-end justify-center text-center",
        copy: "max-w-[230px] items-center",
        imagePosition: "object-center",
        overlay: "bg-gradient-to-l from-black/50 via-black/20 to-transparent",
        titleColor: "text-white",
        eyebrowColor: "text-white/75",
        button: "bg-gradient-to-r from-[#105d97] to-[#0c4d7d] text-white hover:from-[#0c4d7d] hover:to-[#105d97]",
    },
    {
        name: "Đồng phục áo khoác",
        eyebrow: "ÁO KHOÁC ĐỒNG PHỤC",
        slug: "/dong-phuc-ao-khoac",
        image: "/images/dong-phuc-ao-khoac.png",
        count: 6,
        layout: "col-span-4",
        content: "items-end justify-center text-center",
        copy: "max-w-[230px] items-center",
        imagePosition: "object-center",
        overlay: "bg-black/20",
        titleColor: "text-white",
        eyebrowColor: "text-white/75",
        button: "bg-gradient-to-r from-[#105d97] to-[#0c4d7d] text-white hover:from-[#0c4d7d] hover:to-[#105d97]",
    },
    {
        name: "Đồng phục Teambuilding",
        eyebrow: "ĐỒNG PHỤC TEAMBUILDING",
        slug: "/dong-phuc-teambuilding",
        image: "https://live.staticflickr.com/65535/55223495363_430b63f911_b.jpg",
        count: 8,
        layout: "col-span-5",
        content: "items-end justify-center text-center",
        copy: "max-w-[260px] items-center",
        imagePosition: "object-center",
        overlay: "bg-gradient-to-l from-black/50 via-black/20 to-transparent",
        titleColor: "text-white",
        eyebrowColor: "text-white/75",
        button: "bg-gradient-to-r from-[#105d97] to-[#0c4d7d] text-white hover:from-[#0c4d7d] hover:to-[#105d97]",
    },
    {
        name: "Đồng phục Áo Polo",
        eyebrow: "QUÀ TẶNG DOANH NGHIỆP",
        slug: "/dong-phuc-ao-polo",
        image: "/images/qua-tang-doanh-nghiep.png",
        count: 10,
        layout: "col-span-3",
        content: "items-end justify-center text-center",
        copy: "max-w-[230px] items-center",
        imagePosition: "object-center",
        overlay: "bg-gradient-to-l from-black/50 via-black/20 to-transparent",
        titleColor: "text-white",
        eyebrowColor: "text-white/75",
        button: "bg-gradient-to-r from-[#105d97] to-[#0c4d7d] text-white hover:from-[#0c4d7d] hover:to-[#105d97]",
    },
];

export default function CategoryDN() {
    return (
        <section className="mx-auto container py-8 md:py-10">
            <div className="grid grid-cols-12 auto-rows-[92px] gap-2 sm:auto-rows-[170px] sm:gap-3 md:auto-rows-[240px] md:gap-5 lg:auto-rows-[300px] xl:auto-rows-[340px]">
                {categories.map((c, i) => (
                    <Link
                        key={i}
                        href={`${c.slug || '/' + c.name.toLowerCase().replace(/\s+/g, "-")}`}
                        aria-label={`Xem danh mục ${c.name}`}
                        className={`category-grid-card group relative isolate block overflow-hidden bg-gray-100 shadow-sm ${c.layout}`}
                        style={{ animationDelay: `${i * 120}ms` }}
                    >
                        <Image
                            src={c.image}
                            alt={c.name}
                            fill
                            quality={95}
                            className={`object-cover ${c.imagePosition} transition-transform duration-700 ease-out group-hover:scale-105`}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className={`absolute inset-0 z-0 ${c.overlay}`} />

                        <div className={`absolute inset-0 z-10 flex p-2 sm:p-4 md:p-6 lg:p-8 ${c.content}`}>
                            <div className={`flex flex-col ${c.copy}`}>
                                <h3 className={`mb-1 text-[8px] font-black uppercase leading-6 tracking-[0.08em] sm:mb-1.5 sm:text-[10px] md:text-xs lg:mb-2 lg:text-sm ${c.eyebrowColor}`}>
                                    {c.eyebrow}
                                </h3>
                                <span className={`mt-0.5 hidden md:block h-7 max-w-full min-w-0 items-center justify-center whitespace-nowrap px-2 text-[9px] font-black leading-none transition-colors duration-200 sm:h-9 sm:px-3 sm:text-[11px] md:h-10 md:px-4 md:text-xs lg:mt-1 lg:h-12 lg:min-w-[116px] lg:px-6 lg:text-sm ${c.button}`}>
                                    Xem ngay
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <style jsx>{`
        .category-grid-card {
          opacity: 0;
          transform: translateY(22px) scale(0.98);
          animation: categoryGridEnter 720ms cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
          will-change: opacity, transform;
        }

        @keyframes categoryGridEnter {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .category-grid-card {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
        </section>
    );
}
