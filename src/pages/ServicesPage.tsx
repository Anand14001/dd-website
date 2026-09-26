import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServicesHero } from '../components/services/ServicesHero';
import { FeaturedWorkGrid } from '../components/services/FeaturedWorkGrid';
import { ServiceFlipGrid } from '../components/services/ServiceFlipGrid';
import { ServiceSpotlights } from '../components/services/ServiceSpotlights';
import { TrustBand } from '../components/shared/TrustBand';
import { ServicesCta } from '../components/services/ServicesCta';
import { ServiceDetailModal } from '../components/ServiceDetailModal';
import { ServiceItem } from '../types';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);

  const handleSelectServiceForInquiry = (serviceTitle: string) => {
    navigate('/contact', { state: { service: serviceTitle } });
  };

  return (
    <>
      <ServicesHero />
      <FeaturedWorkGrid />
      <ServiceFlipGrid onOpenModal={setSelectedServiceForModal} />
      <ServiceSpotlights onOpenModal={setSelectedServiceForModal} />
      <TrustBand />
      <ServicesCta />

      <ServiceDetailModal
        service={selectedServiceForModal}
        onClose={() => setSelectedServiceForModal(null)}
        onSelectService={handleSelectServiceForInquiry}
      />
    </>
  );
};
