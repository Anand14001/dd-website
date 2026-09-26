import React from 'react';
import { PortfolioHero } from '../components/portfolio/PortfolioHero';
import { PortfolioGrid } from '../components/portfolio/PortfolioGrid';
import { WhyChooseUs } from '../components/shared/WhyChooseUs';
import { ClientStories } from '../components/shared/ClientStories';
import { TrustBand } from '../components/shared/TrustBand';
import { CtaCard } from '../components/shared/CtaCard';

export const PortfolioPage: React.FC = () => {
  return (
    <>
      <PortfolioHero />
      <PortfolioGrid />
      <WhyChooseUs />
      <ClientStories />
      <TrustBand />
      <CtaCard
        eyebrow="Start a project"
        heading={
          <>
            LIKE WHAT YOU SEE?{' '}
            <span className="text-lime">LET&apos;S MAKE YOURS.</span>
          </>
        }
        body="Tell us what you're building and we'll tell you honestly what it takes. The first consultation is free."
        ctaLabel="Get in touch"
        to="/contact"
      />
    </>
  );
};
