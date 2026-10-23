import Image from "next/image";

export default function CollectionHero() {
  return (
    <section className="relative min-h-[78vh] md:min-h-[88vh] flex items-end overflow-hidden bg-primary-dark">
      {/* Mobile Banner */}
      <Image
        src="/images/banner-bts-mobile.webp"
        alt="Đồng phục thể thao Univi cho đội nhóm Gym, Fitness"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
        className="block md:hidden motion-safe:animate-hero-image-scale"
      />
      {/* Desktop Banner */}
      <Image
        src="/images/banner-bts.webp"
        alt="Đồng phục thể thao Univi cho đội nhóm Gym, Fitness"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center 30%" }}
        className="hidden md:block motion-safe:animate-hero-image-scale"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/40"
        aria-hidden
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6 pb-10 md:pb-16">
        <p className="motion-safe:animate-hero-fade-up-100 text-white/80 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] md:tracking-[0.25em] mb-3 md:mb-4">
          Bộ sưu tập 2026
        </p>
        <h1 style={{ lineHeight: 1.3 }} className="motion-safe:animate-hero-fade-up-200 hero-bst font-hero text-white uppercase text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-4 md:mb-6 max-w-4xl">
          Bộ sưu tập
          <br />
          đồng phục thể thao
        </h1>
        <p className="motion-safe:animate-hero-fade-up-300 text-white/90 text-sm md:text-lg max-w-2xl mb-5 md:mb-8">
          Thiết kế chuyên nghiệp cho từng bộ môn, từng đội nhóm và từng thương hiệu.
        </p>
        <p className="motion-safe:animate-hero-fade-up-300 font-quote text-white/95 text-sm md:text-2xl italic max-w-3xl leading-snug border-l-2 border-brand pl-3 md:pl-5">
          Đồng Phục Univi là <span className="text-brand-light font-semibold not-italic">TIÊN PHONG</span> cung
          cấp giải pháp đồng phục thể thao chuyên nghiệp cho các chuỗi phòng tập và các đội nhóm tập Gym,
          Fitness, Pickleball, Yoga, Running, Pilates, MMA... tại Việt Nam.
        </p>
      </div>
    </section>
  );
}
