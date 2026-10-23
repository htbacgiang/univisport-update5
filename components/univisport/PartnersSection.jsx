import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const FALLBACK_PARTNERS = [
  { _id: '3', name: 'Partner 18', logo: '/khach-hang/18.png' },
  { _id: '1', name: 'Partner 16', logo: '/khach-hang/16.jpg' },
  { _id: '2', name: 'Partner 17', logo: '/khach-hang/17.png' },
  { _id: '4', name: 'Partner 19', logo: '/khach-hang/19.png' },
  { _id: '5', name: 'Partner 1', logo: '/khach-hang/1.jpg' },
  { _id: '50', name: 'Partner 2', logo: '/khach-hang/2.jpg' },
  { _id: '6', name: 'Partner 3', logo: '/khach-hang/3.jpg' },
  { _id: '7', name: 'Partner 4', logo: '/khach-hang/4.jpg' },
  { _id: '8', name: 'Partner 5', logo: '/khach-hang/5.jpg' },
  { _id: '9', name: 'Partner 6', logo: '/khach-hang/6.jpg' },
  { _id: '10', name: 'Partner 7', logo: '/khach-hang/7.jpg' },
  { _id: '11', name: 'Partner 8', logo: '/khach-hang/8.jpg' },
  { _id: '12', name: 'Partner 9', logo: '/khach-hang/9.jpg' },
  { _id: '13', name: 'Partner 10', logo: '/khach-hang/10.jpg' },
  { _id: '14', name: 'Partner 11', logo: '/khach-hang/11.jpg' },
  { _id: '15', name: 'Partner 12', logo: '/khach-hang/12.jpg' },
  { _id: '16', name: 'Partner 13', logo: '/khach-hang/13.jpg' },
  { _id: '17', name: 'Partner 15', logo: '/khach-hang/15.jpg' },
];

const VALID_CATEGORIES = ['doanh-nghiep', 'fitness-gym', 'yoga-studio'];

const PartnersSection = ({ initialLogos, category }) => {
  const [partners, setPartners] = useState(
    initialLogos && initialLogos.length > 0 ? initialLogos : FALLBACK_PARTNERS
  );

  useEffect(() => {
    // If no SSR data provided, fetch on client side
    if (!initialLogos || initialLogos.length === 0) {
      const url = category && VALID_CATEGORIES.includes(category)
        ? `/api/partner-logos?visible=true&category=${category}`
        : '/api/partner-logos?visible=true';
      fetch(url)
        .then((r) => r.json())
        .then(({ logos }) => {
          if (logos && logos.length > 0) setPartners(logos);
        })
        .catch(() => {/* keep fallback */ });
    }
  }, [initialLogos, category]);

  // Filter displayed logos: if category given show only that group (max 24), else show all (max 24)
  const displayedPartners = category && VALID_CATEGORIES.includes(category)
    ? partners.filter(p => (p.category || 'doanh-nghiep') === category).slice(0, 24)
    : partners.slice(0, 24);

  return (
    <section className="container mx-auto py-6 px-4 ">
      {/* Partners / Logos Grid */}
      <div className="container mx-auto">
        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-8 gap-4 md:gap-6 items-center justify-items-center">
          {displayedPartners.map((partner) => {
            const img = (
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                width={120}
                height={60}
                className="h-10 sm:h-20 md:h-20 w-auto object-contain mix-blend-multiply"
                loading="lazy"
              />
            );

            return (
              <div
                key={partner._id || partner.id}
                className="transition-all duration-300 transform hover:scale-105"
              >
                {partner.link ? (
                  <a
                    href={partner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={partner.name}
                  >
                    {img}
                  </a>
                ) : (
                  img
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;