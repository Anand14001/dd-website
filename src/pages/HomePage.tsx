import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { StatsBand } from '../components/StatsBand';
import { WhatWeDoSection } from '../components/WhatWeDoSection';
import { DeliveredDeck } from '../components/home/DeliveredDeck';
import { WorkCarousel } from '../components/home/WorkCarousel';
import { Differentiators } from '../components/home/Differentiators';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FAQSection } from '../components/FAQSection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Hero
        onOpenConsultation={() => navigate('/contact')}
        onExploreSolutions={() => navigate('/services')}
      />
      <StatsBand />
      <WhatWeDoSection />
      <WorkCarousel />
      <DeliveredDeck />
      <Differentiators />
      <TestimonialsSection />
      <FAQSection />
    </>
  );
};
