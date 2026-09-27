import React from 'react';
import { useLocation } from 'react-router-dom';
import { ContactHero } from '../components/contact/ContactHero';
import { ContactForm } from '../components/contact/ContactForm';
import { ContactDetails } from '../components/contact/ContactDetails';

export const ContactPage: React.FC = () => {
  const location = useLocation();
  const initialService = (location.state as { service?: string } | null)?.service;

  return (
    <>
      <ContactHero />

      <section className="bg-ink pb-24 lg:pb-32">
        <div className="mx-auto grid w-full max-w-[1720px] grid-cols-1 items-start gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:px-8 xl:px-12 2xl:px-16">
          <div className="lg:col-span-7">
            <ContactForm initialService={initialService} />
          </div>
          <div className="lg:col-span-5">
            <ContactDetails />
          </div>
        </div>
      </section>
    </>
  );
};
