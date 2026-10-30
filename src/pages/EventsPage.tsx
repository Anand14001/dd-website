import React, { useMemo } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { EVENT_PROJECTS, EVENT_SERVICES } from '../data/eventsPageData';
import { EventsHero } from '../components/events/EventsHero';
import { EventPositioning } from '../components/events/EventPositioning';
import { EventJourney } from '../components/events/EventJourney';
import { EventServices } from '../components/events/EventServices';
import { EventProjects } from '../components/events/EventProjects';
import { EventsInfinite } from '../components/events/EventsInfinite';
import { EventTestimonials } from '../components/events/EventTestimonials';
import { EventProcess } from '../components/events/EventProcess';
import { EventWhyUs } from '../components/events/EventWhyUs';
import { EventEnquiry } from '../components/events/EventEnquiry';
import { TrustBand } from '../components/shared/TrustBand';

/**
 * /events — the event technology and digital solutions page.
 *
 * Section order is deliberate and follows how an organiser evaluates a partner:
 * what this is, where we fit, what you get, the proof, the platform, the people
 * who have used us, how it runs, why us, then the one next step. The portfolio
 * sits high because proof is what earns the rest of the page a read.
 *
 * NOTE: confirm the final slug with the site owner before launch — the brief
 * offers /events/ or /event-solutions/ and /events is used here.
 */
export const EventsPage: React.FC = () => {
  // Memoised so the metadata effect doesn't re-run on every render.
  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Event Technology & Digital Solutions',
      serviceType: 'Event technology and digital solutions',
      provider: {
        '@type': 'Organization',
        name: 'Digital Dude',
        url: 'https://digital-dude.com/',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'No.90, Ramanujakoodam Street, Poonamallee',
          addressLocality: 'Chennai',
          postalCode: '600056',
          addressCountry: 'IN',
        },
      },
      areaServed: { '@type': 'Country', name: 'India' },
      description:
        'Event websites, ticket booking, registration workflows, attendee communication and post-event reporting for event organisers.',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Event technology services',
        itemListElement: EVENT_SERVICES.map((service) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: service.title },
        })),
      },
      // Only projects cleared for publication appear in the structured data.
      subjectOf: EVENT_PROJECTS.filter((p) => !p.pendingApproval).map((project) => ({
        '@type': 'Event',
        name: project.name,
        url: project.url,
        // Schema.org has no "completed" state; EventScheduled covers both a past
        // event that took place as planned and one still to come.
        eventStatus: 'https://schema.org/EventScheduled',
        ...(project.city
          ? { location: { '@type': 'Place', name: project.venue ?? project.city } }
          : {}),
      })),
    }),
    [],
  );

  usePageMeta({
    title: 'Event Technology & Digital Solutions | Digital Dude',
    description:
      "Explore Digital Dude's event technology and digital solutions, including event websites, ticket booking, registration workflows, attendee communication and selected event projects.",
    canonical: 'https://digital-dude.com/events',
    ogTitle: 'Event Technology & Digital Solutions | Digital Dude',
    ogDescription:
      'Event websites, ticket booking, registration and attendee communication for event organisers. See selected event projects with live links.',
    jsonLd,
  });

  return (
    <>
      <EventsHero />
      <EventPositioning />
      <EventJourney />
      <EventServices />
      <EventProjects />
      <EventsInfinite />
      <EventTestimonials />
      <EventProcess />
      <EventWhyUs />
      <TrustBand />
      <EventEnquiry />
    </>
  );
};
