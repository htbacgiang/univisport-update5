import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

const pillars = [
  { id: "form", label: "Form", title: "Thiết kế" },
  { id: "function", label: "Function", title: "Công năng" },
  { id: "identity", label: "Identity", title: "Nhận diện" },
];

export default function TheUniviLook() {
  return (
    <section className="container mx-auto px-4 md:px-6 py-14 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-14">
        <Reveal className="relative w-full aspect-[4/3] md:aspect-[5/4] overflow-hidden rounded-2xl order-1">
          <Image
            src="https://live.staticflickr.com/65535/55260155236_1052c9e90c_b.jpg"
            alt="Quy trình thiết kế và lên màu đồng phục tại Univi"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </Reveal>

        <Reveal className="order-2">
          <h2 className="font-hero uppercase text-3xl md:text-5xl text-primary-dark mb-2">
            The Univi Look
          </h2>
          <p className="text-brand font-semibold uppercase tracking-wide text-sm md:text-base mb-8">
            Your uniform, your brand!
          </p>

          <div className="flex flex-col gap-5 mb-8">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="flex items-baseline gap-4 border-b border-secondary-light pb-4">
                <span className="font-hero text-brand text-lg md:text-xl uppercase w-28 shrink-0">
                  {pillar.label}
                </span>
                <span className="text-primary-dark text-sm md:text-base">{pillar.title}</span>
              </div>
            ))}
          </div>

          <Link
            href="/gioi-thieu"
            className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-brand hover:text-brand-dark transition-colors"
          >
            Khám phá thiết kế →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
