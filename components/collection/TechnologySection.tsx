import Image from "next/image";
import { Technology } from "../../data/collection/technologies";
import Reveal from "./Reveal";

interface TechnologySectionProps {
  technologies: Technology[];
}

export default function TechnologySection({ technologies }: TechnologySectionProps) {
  return (
    <section className="bg-primary-dark py-14 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal className="text-center mb-8 md:mb-14">
          <h2 className="font-hero uppercase text-3xl md:text-5xl text-white mb-3">
            Đằng sau mỗi thiết kế
          </h2>
          <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto">
            Chất liệu vải được lựa chọn theo đặc thù vận động của từng bộ môn.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 mb-10">
          {technologies.map((tech, i) => (
            <Reveal
              key={tech.id}
              className="rounded-2xl overflow-hidden bg-white/5 border border-white/10"
              delayMs={(i % 3) * 100}
            >
              <div className="relative w-full aspect-[16/10]">
                <Image
                  src={tech.image}
                  alt={tech.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-5 md:p-6">
                <h3 className="text-white font-hero uppercase text-lg md:text-xl mb-2">{tech.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{tech.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("openContactModal"))}
            className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-white hover:text-brand-light transition-colors"
          >
            Khám phá công nghệ →
          </button>
        </div>
      </div>
    </section>
  );
}
