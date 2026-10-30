/**
 * Content inventory for the /events page.
 *
 * Everything the page renders lives here so a new event, service or testimonial
 * can be added without touching a component. Two rules the brief is strict about
 * and that this file encodes deliberately:
 *
 *  1. `status` is never cosmetic. An upcoming event must never read as delivered,
 *     so the status drives the pill, the border accent and the card's verb.
 *  2. Anything not yet confirmed by the client carries a `pendingApproval` or
 *     `verify` note. Those notes are developer-facing; the page shows the claim
 *     only when the flag is clear.
 *
 * Facts below (dates, venues, organisers, registration behaviour) were read off
 * each live project site. Where a site is client-rendered and returned only a
 * title, the field is left out rather than guessed.
 */

export type EventStatus = 'completed' | 'upcoming' | 'ongoing';

/** What Digital Dude actually delivered. Kept as a closed set so the chips stay consistent. */
export type EventScope =
  | 'Event website'
  | 'Landing page'
  | 'Registration flow'
  | 'Ticket booking'
  | 'Payment integration'
  | 'Email notifications'
  | 'WhatsApp notifications'
  | 'Attendee management'
  | 'Event marketing'
  | 'Event-day support'
  | 'Post-event reporting'
  | 'Platform hosting';

export interface EventProject {
  id: string;
  /** The event's own public name — taken from its live site, not from internal notes. */
  name: string;
  /** One line, factual. No outcome claims. */
  summary: string;
  status: EventStatus;
  /** Shown on the status pill when the event has a confirmed date. */
  dateLabel?: string;
  city?: string;
  venue?: string;
  organiser?: string;
  /** Exactly what Digital Dude delivered. Drives the scope chips. */
  scope: EventScope[];
  url: string;
  /** Label for the card's outbound link, per the brief's per-project CTA. */
  linkLabel: string;
  /** Accent used for the card glow and visual. */
  accent: string;
  /** Two-to-three letter monogram for the generated visual. */
  monogram: string;
  /**
   * Screenshot of the project's live site, served from `public/events/`.
   *
   * These are WebP captures of each site's own public page, taken at 1280 wide.
   * Re-capture them whenever a project site is redesigned, or the card will show
   * work that no longer exists. Drop the field and the card falls back to a
   * generated browser-frame graphic, so a project with no usable screenshot still
   * renders at the same crop as the rest of the grid.
   */
  image?: string;
  /** Longer detail shown in the project modal. */
  detail: string[];
  /**
   * Developer-facing. Rendered nowhere. Clear these as the client confirms each
   * point, and delete the flag once the card is signed off.
   */
  verify?: string[];
  /** When true the card is held back from the public page until the organiser approves. */
  pendingApproval?: boolean;
}

/**
 * Order matters: upcoming work leads, because a prospective organiser is looking
 * for evidence that events are live right now.
 */
export const EVENT_PROJECTS: EventProject[] = [
  {
    id: 'salem-star-speaker',
    name: 'Salem Star Speaker',
    summary:
      'A public speaking contest in Salem, with its event page and registration journey hosted on the Events Infinite platform.',
    status: 'upcoming',
    dateLabel: '1 November 2026',
    city: 'Salem, Tamil Nadu',
    scope: ['Event website', 'Registration flow', 'Platform hosting'],
    url: 'https://sss.eventsinfinite.com/',
    linkLabel: 'View event page',
    accent: '#38BDF8',
    monogram: 'SSS',
    image: '/events/salem-star-speaker.webp',
    detail: [
      'The event runs under the title “The Speaking Contest”, presented as Salem Star Speaker.',
      'Its public event page is served from the Events Infinite platform, which keeps the event page and the sign-up journey on one stack.',
      'This event has not taken place yet, so it is listed as an upcoming project rather than a case study.',
    ],
    verify: [
      'Confirm the venue name in Salem and the final contest format before publishing.',
      'Confirm whether paid ticketing is enabled for this edition or sign-up only.',
    ],
  },
  {
    id: 'germany-career-summit-2027',
    name: 'Germany Career Summit 2027',
    summary:
      'The next edition of the Chennai career summit, a two-day live event for engineers exploring careers in Germany.',
    status: 'upcoming',
    dateLabel: '24–25 April 2027',
    city: 'Chennai',
    organiser: 'B2 Consultants',
    scope: ['Event website', 'Landing page', 'Registration flow'],
    url: 'http://germanycareersummit.com/',
    linkLabel: 'View event website',
    accent: '#A78BFA',
    monogram: 'GCS',
    image: '/events/germany-career-summit-2027.webp',
    detail: [
      'A two-day live summit in Chennai on 24 and 25 April 2027, organised by B2 Consultants.',
      'The event website carries the programme, the speaker and the seat booking journey for attendees.',
      'Listed as an upcoming edition. Nothing about the 2027 event is presented as a delivered result.',
    ],
    verify: [
      'The live site shows 2026 in its header and footer but 2027 in its main heading and dates. Ask the organiser which is correct and fix the site before this card goes live.',
      'Confirm B2 Consultants approve a public mention of the upcoming edition on the Digital Dude site.',
      'Confirm the exact scope Digital Dude delivers for the 2027 edition.',
    ],
  },
  {
    id: 'germany-career-summit',
    name: 'Germany Career Summit',
    summary:
      'A career summit for engineers held at MMA Hall, Chennai, with its event website and attendee sign-up journey online.',
    status: 'completed',
    city: 'Chennai',
    venue: 'MMA Hall, Chennai',
    organiser: 'B2 Consultants',
    scope: ['Event website', 'Landing page', 'Registration flow'],
    url: 'http://germanycareersummit.com/',
    linkLabel: 'Visit event website',
    accent: '#BFFF00',
    monogram: 'GCS',
    // The shared domain now serves the 2027 edition, so this card shows the
    // summit's speaker section rather than a hero stamped with a future date.
    image: '/events/germany-career-summit.webp',
    detail: [
      'Held at MMA Hall in Chennai — a useful reference point for organisers planning an event at the same venue.',
      'The summit ran with its event website as the main public touchpoint for the programme and attendee sign-ups.',
      'The same domain now carries the 2027 edition, which is listed separately as upcoming.',
    ],
    verify: [
      'Confirm the edition date for the completed MMA Hall event and add it to the card.',
      'The card currently shows a section of the shared website, because that domain now serves the 2027 edition. An approved photo from the MMA Hall event would be a stronger visual — request one.',
      'The screenshot shows the summit speaker. Confirm B2 Consultants are happy for it to appear in the Digital Dude portfolio.',
    ],
  },
  {
    id: 'visible-with-ambika',
    name: 'Visible with Ambika',
    summary: 'A Chennai programme with its event website and public announcement page delivered online.',
    status: 'completed',
    dateLabel: '30 August 2026',
    city: 'Chennai',
    scope: ['Event website', 'Landing page'],
    url: 'https://visiblewithambika.com/',
    linkLabel: 'Visit event website',
    accent: '#FB923C',
    monogram: 'VWA',
    image: '/events/visible-with-ambika.webp',
    detail: [
      'The event ran in Chennai on 30 August 2026 on its own dedicated domain.',
      'The site carried the event identity and its public-facing detail for attendees.',
    ],
    verify: [
      'Write the one-line event description with the organiser and confirm the exact scope Digital Dude delivered before publishing.',
      'The live site carries "Get your ticket", "Pricing" and "Venue" sections, so ticketing may belong in the scope chips. Confirm with the organiser, then add the chips if it does.',
      'The screenshot shows the client in her own site\'s hero image. Confirm she is happy for that screenshot to appear in the Digital Dude portfolio.',
    ],
  },
  {
    id: 'timeless-bonds',
    name: 'Timeless Bonds Reunion',
    summary:
      'An alumni reunion for GRD SCIB in Coimbatore, with a scheduled event page and an online attendee registration journey.',
    status: 'completed',
    dateLabel: '4 January 2025',
    city: 'Coimbatore',
    venue: 'GRD SCIB, Coimbatore',
    organiser: 'GRD SCIB',
    scope: ['Event website', 'Registration flow', 'Platform hosting'],
    url: 'https://timelessbonds.eventsinfinite.com/',
    linkLabel: 'View event page',
    accent: '#F472B6',
    monogram: 'TB',
    image: '/events/timeless-bonds.webp',
    detail: [
      'An alumni reunion hosted by GRD SCIB in Coimbatore on 4 January 2025.',
      'The event page published a timed schedule across three locations — a meet and greet and campus visit at GRD SCIB, then a get-together lunch at a restaurant in Coimbatore.',
      'Attendees signed up through an online registration journey linked from the event page, with named course contacts listed for queries.',
      'Delivered on the Events Infinite platform as a hosted event page.',
    ],
    verify: [
      'Registration ran through a linked sign-up journey rather than on-page ticketing. Keep the scope chips limited to what was actually built.',
      'Request approved reunion photos to replace the generated visual.',
    ],
  },
];

/**
 * The Events Infinite platform, featured separately from event clients.
 *
 * Copy here is intentionally narrow. Its public marketing site presents it as an
 * event management company and does not advertise organiser ticketing, so this
 * section describes only what is observable on the live project subdomains:
 * hosted event pages with a registration journey attached.
 */
export const EVENTS_INFINITE = {
  name: 'Events Infinite',
  url: 'https://eventsinfinite.com/',
  summary:
    'The event platform behind several of the projects above. Each event gets its own hosted page on its own subdomain, with the attendee sign-up journey attached to it.',
  /** Only capabilities confirmed on live project subdomains. */
  confirmed: [
    {
      title: 'Hosted event pages',
      body: 'Every event runs on its own subdomain with its own identity, schedule and content — live in days, not weeks.',
      iconName: 'Globe',
    },
    {
      title: 'Attendee registration',
      body: 'Sign-up journeys connected to the event page, so organisers collect attendee details in one place.',
      iconName: 'ClipboardCheck',
    },
    {
      title: 'Schedule & countdown',
      body: 'Timed agendas across multiple locations, with live countdowns to build anticipation before the day.',
      iconName: 'CalendarClock',
    },
    {
      title: 'Organiser contact routing',
      body: 'Named contacts and WhatsApp routing on the page, so attendee questions reach the right person.',
      iconName: 'MessagesSquare',
    },
  ],
  /** Projects served through the platform, linked from this section. */
  hostedProjectIds: ['timeless-bonds', 'salem-star-speaker'],
  verify: [
    'Confirm which ticketing and payment features Digital Dude can offer through Events Infinite before adding them to this section. The public eventsinfinite.com site does not currently advertise organiser ticketing or payments.',
    'Confirm the exact relationship to describe — platform partner, reseller or build partner.',
  ],
};

export interface EventService {
  title: string;
  body: string;
  iconName: string;
  /** Marks the services that are the clearest entry point for a new organiser. */
  featured?: boolean;
}

/**
 * The brief's instruction: show only what the team is ready to deliver. Each of
 * these maps to work visible in the projects above or to an existing Digital Dude
 * service line.
 */
export const EVENT_SERVICES: EventService[] = [
  {
    title: 'Event websites & landing pages',
    body: 'A dedicated site that explains the event properly — programme, speakers, venue, schedule — built to load fast on a phone, because that is where most attendees first see it.',
    iconName: 'MonitorSmartphone',
    featured: true,
  },
  {
    title: 'Ticket booking & registration',
    body: 'A sign-up journey that does not lose people halfway: clear tiers, short forms, confirmation that actually arrives, and a clean list of who is coming.',
    iconName: 'Ticket',
    featured: true,
  },
  {
    title: 'Payment gateway integration',
    body: 'Paid registration wired to a gateway, with the booking and the payment reconciled so your numbers match on the morning of the event.',
    iconName: 'CreditCard',
  },
  {
    title: 'Email & WhatsApp notifications',
    body: 'Confirmations, reminders and day-of instructions sent on the channels attendees in India actually open.',
    iconName: 'Send',
    featured: true,
  },
  {
    title: 'Attendee management',
    body: 'One place to see registrations, filter the list, export it for the entry desk and spot problems before the doors open.',
    iconName: 'Users',
  },
  {
    title: 'Event marketing support',
    body: 'The promotion around the event — creatives, landing pages and campaign support — run by the same team that built the site.',
    iconName: 'Megaphone',
  },
  {
    title: 'Event-day technical support',
    body: 'Someone on the other end of the phone while the event is running, watching the site, the sign-ups and the entry flow.',
    iconName: 'Headset',
  },
  {
    title: 'Post-event reporting',
    body: 'What happened, in numbers you can use — registrations, traffic and drop-off points — so the next edition starts ahead.',
    iconName: 'BarChart3',
  },
];

/**
 * The positioning band. The brief is explicit that this page must not read as a
 * conventional event management offer, so the page says so in plain words rather
 * than hoping the visitor infers it.
 */
export const POSITIONING = {
  weDo: {
    title: 'What we handle',
    items: [
      'The event website and landing pages',
      'Registration, ticketing and payments',
      'Attendee communication before and after',
      'Event-day technical support and reporting',
    ],
  },
  weDont: {
    title: 'What we leave to you',
    items: [
      'Venue, catering and on-ground logistics',
      'Stage, décor and production design',
      'Speaker curation and programming',
      'Hospitality and vendor management',
    ],
  },
  fit: {
    title: 'How we fit in',
    body: 'You run the event. We run the digital side of it — and we work directly with you or alongside your event team, as the official technology partner rather than a second agency to manage.',
  },
};

/**
 * The attendee journey. This is the page's main comprehension device: it shows an
 * organiser exactly where Digital Dude plugs into something they already picture.
 */
export const EVENT_JOURNEY = [
  {
    phase: 'Before',
    title: 'They discover it',
    body: 'A site that answers the questions that decide whether someone attends.',
    iconName: 'Search',
  },
  {
    phase: 'Before',
    title: 'They register',
    body: 'A short, working sign-up journey with payment where it is needed.',
    iconName: 'ClipboardCheck',
  },
  {
    phase: 'Before',
    title: 'They hear from you',
    body: 'Confirmations and reminders on email and WhatsApp, so turnout holds.',
    iconName: 'BellRing',
  },
  {
    phase: 'During',
    title: 'They arrive',
    body: 'A clean attendee list for the entry desk, and support on call.',
    iconName: 'DoorOpen',
  },
  {
    phase: 'After',
    title: 'You learn from it',
    body: 'Registration and traffic numbers you can take into the next edition.',
    iconName: 'LineChart',
  },
];

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Discover the event',
    body: 'We start with the event, not the software: who is attending, what has to happen by when, and what went wrong last time.',
    iconName: 'Compass',
  },
  {
    step: '02',
    title: 'Plan the digital journey',
    body: 'We map every attendee touchpoint — first visit, registration, payment, reminders, event day — and agree the scope in writing.',
    iconName: 'Map',
  },
  {
    step: '03',
    title: 'Build and test',
    body: 'Built, then tested the way an attendee would use it: on a phone, on a slow connection, with a real payment and a real confirmation.',
    iconName: 'Hammer',
  },
  {
    step: '04',
    title: 'Support and review',
    body: 'We stay reachable while the event runs, then come back with what the numbers say once it is over.',
    iconName: 'LifeBuoy',
  },
];

export const WHY_US = [
  {
    title: 'Technology and marketing in one team',
    body: 'The people building your registration flow are the people promoting it. No handoff between an agency and a developer, and no gap where the two blame each other.',
    iconName: 'Blocks',
    accent: '#BFFF00',
  },
  {
    title: 'Live event projects, not a pitch deck',
    body: 'Summits, reunions and contests across Chennai, Coimbatore and Salem — every one of them on this page with a working link you can open right now.',
    iconName: 'CalendarCheck',
    accent: '#38BDF8',
  },
  {
    title: 'Registration flows that hold up',
    body: 'We have built the part most event sites get wrong: the journey from interested to registered, including payment and the confirmation that follows.',
    iconName: 'Ticket',
    accent: '#A78BFA',
  },
  {
    title: 'Built around the attendee',
    body: 'Most attendees meet your event on a phone, in a hurry. Everything is designed for that first, which is why these pages stay fast and short.',
    iconName: 'Smartphone',
    accent: '#FB923C',
  },
  {
    title: 'You talk to the person doing the work',
    body: 'Direct coordination with the team on your event. In event weeks that matters more than a process diagram.',
    iconName: 'PhoneCall',
    accent: '#F472B6',
  },
  {
    title: 'A partner for the next edition too',
    body: 'Event sites get rebuilt every year for no reason. Ours are built so the next edition starts from what already works.',
    iconName: 'Repeat',
    accent: '#34D399',
  },
];

export interface EventTestimonial {
  id: string;
  name: string;
  role?: string;
  company: string;
  quote: string;
  /** Set only once a genuine client recording is approved for publication. */
  videoUrl?: string;
  /** Poster frame for the video. Shows the speaker's face, per the brief. */
  posterUrl?: string;
  /** Short runtime label, e.g. "1:12". */
  duration?: string;
}

/**
 * Published testimonials only.
 *
 * The brief forbids placeholder quotes presented as real testimonials, so this
 * array holds nothing that is not already public and attributed. The one entry
 * below is a live testimonial from digital-dude.com and is on-topic: it is
 * specifically about event booking website work.
 *
 * Video testimonials are Phase 2. Add them here with `videoUrl` and `posterUrl`
 * once recordings and written publication consent are in hand — the section
 * switches from the text layout to the video layout on its own.
 */
export const EVENT_TESTIMONIALS: EventTestimonial[] = [
  {
    id: 'mohsin-razzus',
    name: 'Mohsin',
    company: 'Razzus Automotive',
    quote:
      "Digital Dude's event booking website development service exceeded our expectations. They created a user-friendly and visually stunning platform that simplified the entire booking process for our clients. The seamless integration of features, intuitive design, and exceptional functionality have significantly boosted our event bookings.",
  },
];

/** Questions the team asks on camera. Kept here so the recording plan lives with the page. */
export const TESTIMONIAL_QUESTIONS = [
  'What was the event, and what were you trying to achieve?',
  'What did Digital Dude help you with?',
  'How was the coordination and support before and during the event?',
  'Which part of the website, ticketing or technology was most useful?',
  'Would you recommend Digital Dude to another organiser, and why?',
];

/** Event types offered in the enquiry form. */
export const EVENT_TYPES = [
  'Conference or summit',
  'Seminar or workshop',
  'Networking or business event',
  'Awards or contest',
  'Reunion or community event',
  'Something else',
];

/** Requirement checkboxes in the enquiry form. These become the lead's service tags. */
export const ENQUIRY_NEEDS = [
  'Event website',
  'Registration flow',
  'Ticket booking',
  'Payment integration',
  'Email & WhatsApp notifications',
  'Attendee management',
  'Event marketing',
  'Event-day support',
];
