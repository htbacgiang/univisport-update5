import Link from "next/link";
import Reveal from "./Reveal";

export default function CollectionCTA() {
  return (
    <section className="bg-brand py-14 md:py-24">
      <Reveal className="container mx-auto px-4 md:px-6 text-center max-w-5xl">
        <h2 className="font-hero uppercase text-white text-3xl md:text-5xl leading-tight mb-4 md:mb-5">
          Thiết kế riêng
          cho thương hiệu của bạn
        </h2>
        <p className="text-white text-sm md:text-base mb-7 md:mb-9">
          Từ ý tưởng, thiết kế đến sản xuất và hoàn thiện - Univi đồng hành cùng bạn trong toàn bộ quá
          trình.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("openContactModal"))}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-brand font-semibold uppercase tracking-wide text-sm rounded-full hover:bg-white/90 transition-colors"
          >
            Nhận tư vấn
          </button>
          <Link
            href="/lien-he"
            className="w-full sm:w-auto px-8 py-3.5 border border-white/70 text-white font-semibold uppercase tracking-wide text-sm rounded-full hover:bg-white/10 transition-colors"
          >
            Gửi yêu cầu thiết kế
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
