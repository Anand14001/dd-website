import { PORTFOLIO_ITEMS } from './portfolioData';

/** Headline metrics for the services hero. Mirrors AGENCY_INFO.stats, phrased for this page. */
export const SERVICE_STATS = [
  { value: '200+', label: 'Projects delivered' },
  { value: '100+', label: 'Trusted clients' },
  { value: '35+', label: 'Specialists in-house' },
  { value: '5+', label: 'Years building' },
];

/** The three builds that lead the page. Pulled from the live portfolio so images stay in sync. */
const FEATURED_IDS = ['spanda-green', 'lets-prop-store', 'vedhas-clothing'];

export const FEATURED_WORK = FEATURED_IDS.map((id) => {
  const item = PORTFOLIO_ITEMS.find((p) => p.id === id)!;
  return item;
}).filter(Boolean);

export interface ServiceSpotlight {
  /** Matches a ServiceItem id in agencyData so the card can open the existing detail modal. */
  serviceId: string;
  title: string;
  tags: string[];
  /** TODO: confirm these figures with the team before launch. */
  metrics: { value: string; label: string }[];
  chips: string[];
  blurb: string;
  image: string;
}

export const SERVICE_SPOTLIGHTS: ServiceSpotlight[] = [
  {
    serviceId: 'website-app-development',
    title: 'Website & App Development',
    tags: ['Web', 'E-commerce', 'Support'],
    metrics: [
      { value: '9+', label: 'sites live' },
      { value: '100%', label: 'custom built' },
      { value: 'Ongoing', label: 'post-launch support' },
    ],
    chips: ['Websites', 'E-commerce', 'Web Apps', 'Maintenance'],
    blurb:
      'From a first business website to a full storefront or custom web application — designed, built, and then actually looked after. Launch day is the start of the engagement, not the end of it.',
    image: PORTFOLIO_ITEMS.find((p) => p.id === 'spanda-green')?.image ?? '',
  },
  {
    serviceId: 'seo-social-media-marketing',
    title: 'SEO & Social Media Marketing',
    tags: ['SEO', 'Social', 'Content'],
    metrics: [
      { value: 'Organic', label: 'growth focus' },
      { value: 'Daily', label: 'account management' },
      { value: 'Compounding', label: 'search returns' },
    ],
    chips: ['Technical SEO', 'Content Strategy', 'Social Management', 'Engagement'],
    blurb:
      'Search and social run as one system here. Keyword-led content earns the rankings, day-to-day social keeps the audience warm, and the two feed each other instead of competing for budget.',
    image: PORTFOLIO_ITEMS.find((p) => p.id === 'lets-prop-store')?.image ?? '',
  },
  {
    serviceId: 'videography-editing',
    title: 'Videography & Editing',
    tags: ['Video', 'Motion', 'Short-form'],
    metrics: [
      { value: 'Concept', label: 'to final cut' },
      { value: 'In-house', label: 'production team' },
      { value: 'Reels', label: 'built for social' },
    ],
    chips: ['Scriptwriting', 'Production', 'Editing', 'Motion Graphics'],
    blurb:
      'Scripted, shot, and cut under one roof — promos, explainers, testimonials, and the short-form reels that carry a brand on social. One team from the idea to the publish-ready file.',
    image: PORTFOLIO_ITEMS.find((p) => p.id === 'vedhas-clothing')?.image ?? '',
  },
];

/** Client names drawn from the live portfolio. */
export const TRUSTED_BY = [
  'Spanda Green',
  'Lets Prop Store',
  'Vedhas Clothing',
  'Ai-ACCTS',
  'Razzus Automotive',
  'Tiny Little Toes',
  'Master Mindset YTC',
  'Hostaloj',
];
