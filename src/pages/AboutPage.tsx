import React from 'react';
import { AboutHero } from '../components/about/AboutHero';
import { Principles } from '../components/about/Principles';
import { AboutStats } from '../components/about/AboutStats';
import { ProcessSteps } from '../components/about/ProcessSteps';
import { WhyChooseUs } from '../components/shared/WhyChooseUs';
import { ClientStories } from '../components/shared/ClientStories';
import { TrustBand } from '../components/shared/TrustBand';
import { CtaCard } from '../components/shared/CtaCard';

export const AboutPage: React.FC = () => {
  return (
    <>
      <AboutHero />
      <Principles />
      <AboutStats />
      <WhyChooseUs />
      <CtaCard
        eyebrow="Get in touch"
        heading="Unlock Your Potential, Reach Out and Transform Your Business!"
        body="Experience unparalleled growth and success with Digital Dude. Our comprehensive digital services are designed to elevate your brand and achieve your business goals."
        ctaLabel="Contact us"
        to="/contact"
      />
      <ProcessSteps />
      <ClientStories />
      <TrustBand />
    </>
  );
};
