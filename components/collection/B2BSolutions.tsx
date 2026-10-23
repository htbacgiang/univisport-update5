import Image from "next/image";
import Link from "next/link";
import { Solution } from "../../data/collection/solutions";
import Reveal from "./Reveal";

interface B2BSolutionsProps {
  solutions: Solution[];
}

function SolutionCTA({ solution }: { solution: Solution }) {
  const className =
    "inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-brand hover:text-brand-dark transition-colors";

  if (solution.ctaHref === "contact") {
    return (
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("openContactModal"))}
        className={className}
      >
        {solution.ctaLabel}
      </button>
    );
  }

  return (
    <Link href={solution.ctaHref} className={className}>
      {solution.ctaLabel}
    </Link>
  );
}

export default function B2BSolutions({ solutions }: B2BSolutionsProps) {
  return (
    <section className="container mx-auto px-4 md:px-6 py-14 md:py-24">
      <Reveal className="text-center mb-9 md:mb-16">
        <h2 className="font-hero uppercase text-3xl md:text-5xl text-primary-dark mb-3">
          Giải pháp đồng phục cho
        </h2>
        <p className="text-secondary-dark text-sm md:text-base max-w-xl mx-auto">
          Univi đồng hành cùng phòng tập, doanh nghiệp và đội nhóm thể thao trên toàn quốc.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {solutions.map((solution, i) => (
          <Reveal key={solution.id} className="flex flex-col" delayMs={(i % 3) * 100}>
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl mb-5">
              <Image
                src={solution.image}
                alt={solution.imageAlt}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <span className="text-brand font-hero text-2xl mb-2">{solution.number}</span>
            <h3 className="font-hero uppercase text-xl md:text-2xl text-primary-dark mb-3">
              {solution.title}
            </h3>
            <p className="text-secondary-dark text-sm leading-relaxed mb-4">{solution.description}</p>
            <ul className="flex flex-wrap gap-2 mb-5">
              {solution.items.map((item) => (
                <li
                  key={item}
                  className="text-xs font-medium text-primary-dark bg-secondary-light/60 rounded-full px-3 py-1"
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <SolutionCTA solution={solution} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
