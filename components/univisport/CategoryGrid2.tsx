import Image from "next/image";
import Link from "next/link";

export interface Category {
  name: string;
  slug: string;
  image: string;
  count?: number;
}

const categories: Category[] = [
  {
    name: "Đồng phục Gym",
    slug: "/dong-phuc-gym",
    image: "/product/dong-phuc-pt-gym.jpg",
    count: 7,
  },
  {
    name: "Đồng phục Yoga",
    slug: "/dong-phuc-yoga-pilates",
    image: "/product/dong-phuc-yoga-pillates.jpg",
    count: 5,
  },
  {
    name: "Đồng phục Áo gió",
    slug: "/dong-phuc-ao-gio",
    image: "/product/ao-gio.jpg",
    count: 4,
  },
  {
    name: "Pickleball",
    slug: "/dong-phuc-pickleball",
    image: "/product/pickleball.jpg",
    count: 4,
  },
  {
    name: "MMA Đồng phục",
    slug: "/dong-phuc-mma",
    image: "/product/mma-dong-phuc.webp",
    count: 3,
  },
  {
    name: "Golf - Tennis",
    slug: "/dong-phuc-golf-tennis",
    image: "/product/goft-tennis.jpg",
    count: 8,
  },
  {
    name: "Polo Doanh nghiệp",
    slug: "/dong-phuc-polo",
    image: "/product/ao-polo.webp",
    count: 6,
  },
  {
    name: "Đồng phục Sơ mi",
    slug: "/dong-phuc-so-mi",
    image: "/product/cong-so.webp",
    count: 5,
  },
  {
    name: "Vest công sở",
    slug: "/dong-phuc-vest-cong-so",
    image: "/product/dong-phuc-vest-cong-so.webp",
    count: 4,
  },
  {
    name: "Teambuilding",
    slug: "/dong-phuc-teambuilding",
    image: "/product/team-building.webp",
    count: 6,
  },
  {
    name: "Bảo hộ lao động",
    slug: "/bao-ho-lao-dong",
    image: "/images/dong-phuc-cong-ty.webp",
    count: 5,
  },
  {
    name: "Quà tặng - Phụ kiện",
    slug: "/phu-kien-qua-tang-doanh-nghiep",
    image: "/product/qua-tang-doanh-nghiep.png",
    count: 5,
  },
];

interface CategoryGrid2Props {
  categoryList?: Category[];
}

export default function CategoryGrid2({ categoryList = categories }: CategoryGrid2Props) {
  const items = categoryList;

  // Split categories for 5-col grid structure matching the visual reference layout:
  // Row 1: 3 cards + 1 banner (col-span-2)
  // Row 2: 1 card + 1 banner (col-span-2) + 2 cards
  // Row 3: 5 cards (or remaining)
  const row1Cards = items.slice(0, 3);
  const row2CardFirst = items[3];
  const row2CardsLast = items.slice(4, 6);
  const row3Cards = items.slice(6);

  return (
    <section className="container mx-auto py-6 sm:py-10 px-4">
      <div className="flex flex-col gap-4 sm:gap-5">
        {/* ROW 1: 3 regular cards + 1 feature banner card */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {row1Cards.map((c) => (
            <CategoryCard key={c.slug} item={c} />
          ))}

          {/* Featured Banner 1 */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 bg-[#f3f4f6] rounded-[20px] p-6 sm:p-8 flex flex-col justify-between sm:flex-row items-center relative overflow-hidden group min-h-[280px] sm:min-h-[340px] transition-all duration-300 hover:shadow-lg">
            <div className="z-10 flex flex-col items-start max-w-full sm:max-w-[55%] mb-4 sm:mb-0">
              <span className="inline-block bg-[#16a34a] text-white text-[10px] sm:text-xs font-extrabold uppercase px-2.5 py-1 rounded tracking-wider mb-3">
                EXCLUSIVE
              </span>
              <p className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                NEW ARRIVALS
              </p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
                Stylish &amp; Trending
              </h3>
              <Link
                href={items[0]?.slug || "/dong-phuc-gym"}
                className="inline-flex items-center gap-2 bg-white hover:bg-black hover:text-white text-gray-900 font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-sm transition-all duration-300"
              >
                See Collection
              </Link>
            </div>
            <div className="relative w-full sm:w-[45%] h-44 sm:h-full min-h-[160px] sm:min-h-[240px] flex items-center justify-center">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={items[0]?.image || "/product/dong-phuc-pt-gym.jpg"}
                  alt="Stylish & Trending Collection"
                  fill
                  quality={95}
                  style={{ objectFit: "cover", objectPosition: "top" }}
                  className="transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: 1 card + 1 feature banner card + 2 regular cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {row2CardFirst && <CategoryCard item={row2CardFirst} />}

          {/* Featured Banner 2 */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 bg-[#f3f4f6] rounded-[20px] p-6 sm:p-8 flex flex-col justify-between sm:flex-row items-center relative overflow-hidden group min-h-[280px] sm:min-h-[340px] transition-all duration-300 hover:shadow-lg">
            <div className="z-10 flex flex-col items-start max-w-full sm:max-w-[55%] mb-4 sm:mb-0">
              <span className="inline-block bg-[#2563eb] text-white text-[10px] sm:text-xs font-extrabold uppercase px-2.5 py-1 rounded tracking-wider mb-3">
                TRENDING
              </span>
              <p className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                ONLINE EXCLUSIVE
              </p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
                Made for Comfort
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={items[3]?.slug || "/dong-phuc-pickleball"}
                  className="inline-flex items-center bg-white hover:bg-black hover:text-white text-gray-900 font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-sm transition-all duration-300"
                >
                  Collection
                </Link>
                <Link
                  href="/bo-suu-tap"
                  className="hidden md:inline-block text-xs sm:text-sm font-semibold text-gray-700 hover:text-black transition-colors underline underline-offset-4"
                >
                  View All Trending
                </Link>
              </div>
            </div>
            <div className="relative w-full sm:w-[45%] h-44 sm:h-full min-h-[160px] sm:min-h-[240px] flex items-center justify-center">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={items[3]?.image || "/product/pickleball.jpg"}
                  alt="Made for Comfort Collection"
                  fill
                  quality={95}
                  style={{ objectFit: "cover", objectPosition: "top" }}
                  className="transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                />
              </div>
            </div>
          </div>

          {row2CardsLast.map((c) => (
            <CategoryCard key={c.slug} item={c} />
          ))}
        </div>

        {/* ROW 3: Remaining categories (5 cards) */}
        {row3Cards.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {row3Cards.map((c) => (
              <CategoryCard key={c.slug} item={c} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryCard({ item }: { item: Category }) {
  return (
    <div className="group relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-[20px] overflow-hidden bg-[#f3f4f6] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={item.slug || "/" + item.name.toLowerCase().replace(/\s+/g, "-")}
        className="block w-full h-full relative"
        aria-label={item.name}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          quality={95}
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />

        {/* Bottom Pill Badge Button */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 w-[85%] sm:w-[88%] text-center pointer-events-none z-10">
          <span className="inline-block w-full bg-white group-hover:bg-black group-hover:text-white text-gray-900 font-semibold text-xs sm:text-sm py-2 sm:py-2.5 px-3 rounded-full shadow-md transition-all duration-300 truncate pointer-events-auto">
            {item.name}
          </span>
        </div>
      </Link>
    </div>
  );
}
