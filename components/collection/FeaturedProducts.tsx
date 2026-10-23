import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

export interface FeaturedProduct {
  id: string | number;
  maSanPham?: string;
  name: string;
  image: string;
  slug: string;
  categoryNameVN?: string;
}

interface FeaturedProductsProps {
  products: FeaturedProduct[];
}

function getImageUrl(imagePath?: string) {
  if (!imagePath) return "/images/placeholder.jpg";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  if (imagePath.startsWith("/")) return imagePath;
  return `/${imagePath}`;
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-secondary-light/30 py-14 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal className="text-center mb-8 md:mb-14">
          <h2 className="font-hero uppercase text-3xl md:text-5xl text-primary-dark mb-3">
            Sản phẩm nổi bật
          </h2>
          <p className="text-secondary-dark text-sm md:text-base max-w-xl mx-auto">
            Một số mẫu tiêu biểu trong các bộ sưu tập của Univi.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <Reveal key={product.id} delayMs={(i % 4) * 80}>
              <Link href={`/san-pham/${product.slug}`} className="group flex flex-col gap-3">
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-white">
                  <Image
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 45vw, 22vw"
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div>
                  {product.maSanPham && (
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-brand mb-1">
                      {product.maSanPham}
                    </span>
                  )}
                  <h3 className="text-sm md:text-base font-bold text-primary-dark line-clamp-2 mb-1 group-hover:text-brand transition-colors">
                    {product.name}
                  </h3>
                  {product.categoryNameVN && (
                    <span className="block text-xs text-secondary-dark mb-1.5">
                      {product.categoryNameVN}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary-dark group-hover:text-brand transition-colors">
                    Xem chi tiết →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
