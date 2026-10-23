import Image from "next/image";
import Link from "next/link";
import { CollectionEntry } from "../../data/collection/collections";
import Reveal from "./Reveal";

interface CollectionShowcaseProps {
  collections: CollectionEntry[];
}

function SplitRow({ entry }: { entry: CollectionEntry }) {
  const reverse = entry.variant === "image-right";

  const image = (
    <div className="relative w-full aspect-[4/3] md:aspect-[5/4] overflow-hidden rounded-2xl">
      <Image
        src={entry.image}
        alt={entry.imageAlt}
        fill
        loading="lazy"
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: "cover" }}
      />
    </div>
  );

  const text = (
    <div className={reverse ? "md:pl-4" : "md:pr-4"}>
      <span className="block text-brand font-hero text-3xl md:text-4xl mb-3">{entry.number}</span>
      <h3 className="font-hero uppercase text-2xl md:text-4xl text-primary-dark mb-4">{entry.title}</h3>
      <p className="text-secondary-dark text-sm md:text-base leading-relaxed mb-6 max-w-md">
        {entry.description}
      </p>
      <Link
        href={entry.ctaHref}
        className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-brand hover:text-brand-dark transition-colors"
      >
        {entry.ctaLabel}
      </Link>
    </div>
  );

  return (
    <Reveal className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-14">
      {reverse ? (
        <>
          {text}
          {image}
        </>
      ) : (
        <>
          {image}
          {text}
        </>
      )}
    </Reveal>
  );
}

function FullBleedRow({ entry }: { entry: CollectionEntry }) {
  return (
    <Reveal className="relative w-full min-h-[60vh] md:min-h-[75vh] rounded-2xl overflow-hidden flex items-end">
      <Image
        src={entry.image}
        alt={entry.imageAlt}
        fill
        loading="lazy"
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden />
      <div className="relative z-10 p-6 md:p-12 max-w-xl">
        <span className="block text-white/80 font-hero text-2xl md:text-3xl mb-2">{entry.number}</span>
        <h3 className="font-hero uppercase text-2xl md:text-4xl text-white mb-3">{entry.title}</h3>
        <p className="text-white text-sm md:text-base leading-relaxed mb-5">{entry.description}</p>
        <Link
          href={entry.ctaHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-white hover:text-brand-light transition-colors"
        >
          {entry.ctaLabel}
        </Link>
      </div>
    </Reveal>
  );
}

export default function CollectionShowcase({ collections }: CollectionShowcaseProps) {
  return (
    <section id="bo-suu-tap-collections" className="container mx-auto px-4 md:px-6 py-14">
      <Reveal className="text-center mb-10 md:mb-20">
        <h2 className="font-hero uppercase text-3xl md:text-5xl text-primary-dark">
          Bộ sưu tập Đồng phục thể thao
        </h2>
      </Reveal>
      <div className="flex flex-col gap-12 md:gap-24">
        {collections.map((entry) =>
          entry.variant === "full-bleed" ? (
            <FullBleedRow key={entry.id} entry={entry} />
          ) : (
            <SplitRow key={entry.id} entry={entry} />
          )
        )}
      </div>
    </section>
  );
}
