import { ServiceItem, Testimonial } from '../types';

export const AGENCY_INFO = {
  name: 'Digital Dude',
  founded: 2022,
  tagline: 'Technology & Marketing For Predictable Business Growth',
  mission:
    'Our mission is simple which is to transform businesses with smart strategies and unlock their true growth potential.',
  valueProposition:
    'At Digital Dude, We empower businesses to grow with the right blend of technology and marketing. We craft tailored digital solutions that enhance visibility, attract the right audience, and drive measurable sales.',
  stats: [
    { label: 'Years of Experience', value: '5+' },
    { label: 'Projects Done', value: '200+' },
    { label: 'Trusted Clients', value: '100+' },
    { label: 'Expert Team', value: '35+' },
  ],
  contact: {
    emails: ['wedigitaldude@gmail.com', 'lalith@digital-dude.com'],
    phones: ['+91 97870-97006', '+91 89396-51525'],
    office: 'No.90, Ramanujakoodam Street, Poonamallee, Chennai - 600056',
    hours: 'Monday to Saturday: 9:00 AM - 6:00 PM',
  },
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'seo-social-media-marketing',
    title: 'SEO & Social Media Marketing',
    category: 'marketing',
    shortDescription:
      'Search rankings and organic social growth working together — technical SEO, content strategy, and day-to-day social media management that builds a real audience.',
    fullDescription:
      'We combine search engine optimization with hands-on social media marketing and management so your brand shows up in search and stays active where your audience already is. From keyword-driven content strategy to daily audience engagement, every post and page is built to compound your organic reach over time.',
    iconName: 'Search',
    deliverables: [
      'Search Engine Optimization (SEO)',
      'Social Media Marketing (SMM)',
      'Social Media Management',
      'Content Strategy',
      'Audience Engagement',
      'Organic Growth',
    ],
  },
  {
    id: 'website-app-development',
    title: 'Website & App Development',
    category: 'technology',
    shortDescription:
      'Custom websites, e-commerce stores, and web applications — built, launched, and kept running with ongoing maintenance and support.',
    fullDescription:
      "From a brand-new business website to a full e-commerce storefront or custom web application, we design and build digital properties that work as hard as you do. And once you're live, we don't disappear — ongoing maintenance and support keeps everything running smoothly.",
    iconName: 'Code2',
    deliverables: [
      'Website Development',
      'E-commerce Development',
      'Web Application Development',
      'Website Maintenance & Support',
    ],
  },
  {
    id: 'social-media-advertising',
    title: 'Social Media Advertising',
    category: 'marketing',
    shortDescription:
      "Paid campaigns on Facebook and Instagram engineered around one goal at a time — leads, conversions, or reach — with audiences targeted to match.",
    fullDescription:
      "We plan, launch, and manage paid social campaigns across Facebook and Instagram, built around clear objectives — whether that's generating leads, driving conversions, or reaching a precisely targeted audience. Every campaign is set up to be measured, not guessed at.",
    iconName: 'Megaphone',
    deliverables: [
      'Facebook Advertising',
      'Instagram Advertising',
      'Paid Social Campaigns',
      'Lead Generation Ads',
      'Conversion Campaigns',
      'Audience Targeting',
    ],
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    category: 'creative',
    shortDescription:
      'Logos, brand identity, and the everyday creative your marketing runs on — social posts, posters, banners, presentations, and more.',
    fullDescription:
      'Good marketing needs good design behind it. We handle everything from logo design and brand identity systems to the day-to-day creative — social media posts, posters, banners, marketing collateral, digital ads, presentations, and UI visuals — so your brand looks consistent everywhere it shows up.',
    iconName: 'PenTool',
    deliverables: [
      'Logo Design',
      'Brand Identity Design',
      'Social Media Creatives',
      'Posters & Banners',
      'Marketing Collaterals',
      'Digital Advertisements',
      'Presentation Design',
      'UI Visual Design',
    ],
  },
  {
    id: 'videography-editing',
    title: 'Videography & Editing',
    category: 'creative',
    shortDescription:
      'Video from concept to final cut — promos, explainers, testimonials, and short-form reels, scripted, shot, and edited in-house.',
    fullDescription:
      'We take video from a first idea through to a finished, publish-ready file. That covers concept development and scriptwriting, production, and post — promotional videos, explainer videos, testimonial videos, motion graphics, visual effects, and the short-form reels built for today\'s social platforms.',
    iconName: 'Clapperboard',
    deliverables: [
      'Video Concept Development',
      'Scriptwriting',
      'Video Production',
      'Promotional Videos',
      'Explainer Videos',
      'Testimonial Videos',
      'Video Editing',
      'Motion Graphics',
      'Visual Effects',
      'Reels & Short-form Videos',
    ],
  },
  {
    id: 'influencer-marketing',
    title: 'Influencer Marketing',
    category: 'marketing',
    shortDescription:
      'Finding the right creators for your brand and running the campaign end-to-end — outreach, management, sponsored content, and performance tracking.',
    fullDescription:
      'We identify and vet influencers who genuinely fit your brand, then manage the entire campaign — outreach, creator collaboration, sponsored content, and campaign strategy — and track how it actually performs, not just how it looks.',
    iconName: 'Users',
    deliverables: [
      'Influencer Research',
      'Influencer Selection',
      'Campaign Strategy',
      'Influencer Outreach',
      'Campaign Management',
      'Sponsored Content',
      'Creator Collaboration',
      'Campaign Performance Tracking',
    ],
  },
  {
    id: 'personal-branding',
    title: 'Personal Branding',
    category: 'creative',
    shortDescription:
      'Turning a founder or professional into a recognizable name — positioning, content, video, and consistent social presence built for thought leadership.',
    fullDescription:
      'For founders, executives, and professionals who want to become the face of their industry, we build a personal brand strategy and carry it through — positioning, profile optimization, ongoing content and video, and the social media management that grows an audience around you, not just your company.',
    iconName: 'UserCircle2',
    deliverables: [
      'Personal Brand Strategy',
      'Brand Positioning',
      'Profile Optimization',
      'Content Strategy',
      'Personal Brand Content',
      'Social Media Management',
      'Video Content',
      'Thought Leadership',
      'Audience Growth',
    ],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Sarah Chen',
    role: 'VP of Marketing',
    company: 'HyperScale Cloud Solutions',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    content:
      'Digital Dude transformed our acquisition engine. Before partnering with them in early 2023, our tech stack and marketing were completely disconnected. Now, our leads flow smoothly straight into revenue.',
    rating: 5,
    highlight: 'Tech & Marketing Synergy',
  },
  {
    id: 't-2',
    name: 'David Holloway',
    role: 'Managing Director',
    company: 'Vanguard Capital Partners',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&auto=format&fit=crop&q=80',
    content:
      'Finding an agency that truly excels at both custom web development and rigorous performance marketing is rare. Digital Dude delivered on their promises on time and under budget.',
    rating: 5,
    highlight: 'Rigorous Technical Precision',
  },
  {
    id: 't-3',
    name: 'Amara Okafor',
    role: 'Founder & CEO',
    company: 'Kinetix Fitness Systems',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
    content:
      'Their growth framework helped us unlock 4.2x customer acquisition without increasing our ad spend budget. The strategic clarity they bring to the table is unmatched.',
    rating: 5,
    highlight: '4.2x Acquisition Growth',
  },
];

export const METHODOLOGY_STEPS = [
  {
    number: '01',
    title: 'Deep Diagnostic & Growth Audit',
    description:
      'We deconstruct your entire digital footprint: technical codebase, conversion funnels, SEO rankings, and competitor market share to pinpoint low-hanging fruit and strategic breakthroughs.',
    badge: 'Discovery & Analytics',
  },
  {
    number: '02',
    title: 'Tailored Strategy & Tech Architecture',
    description:
      'No cookie-cutter templates. We formulate a custom blueprint harmonizing modern engineering stacks with multi-channel marketing campaigns engineered for high-intent customer capture.',
    badge: 'Custom Blueprint',
  },
  {
    number: '03',
    title: 'Agile Execution & Campaign Launch',
    description:
      'Our developers, strategists, and performance marketers build and launch your digital solutions in rapid agile sprints with rigorous QA, speed benchmarks, and conversion tracking.',
    badge: 'Rapid Deployment',
  },
  {
    number: '04',
    title: 'Continuous Optimization & Scale',
    description:
      'Growth is iterative. We continually analyze live conversion data, execute A/B tests, refine targeting algorithms, and expand your market footprint for compounding returns.',
    badge: 'Compounding ROI',
  },
];

export const FAQS = [
  {
    question: 'What services does Digital Dude provide?',
    answer:
      'Digital Dude offers seven core service lines: SEO & Social Media Marketing, Website & App Development, Social Media Advertising, Graphic Design, Videography & Editing, Influencer Marketing, and Personal Branding. Whether you need a single service or a fully integrated package, we tailor the mix to your business goals.',
  },
  {
    question: 'How long does it take to develop a website?',
    answer:
      "Timelines depend on scope — a focused landing page can be ready in a couple of weeks, while a full custom website or e-commerce build takes longer. We'll give you a specific timeline once we understand your requirements during a free consultation.",
  },
  {
    question: 'Can you redesign or improve my existing website?',
    answer:
      'Yes. We regularly redesign and modernize existing websites — improving design, performance, and usability while keeping the pages and content your visitors already rely on intact wherever possible.',
  },
  {
    question: 'Do you provide website maintenance and technical support after launch?',
    answer:
      'Yes, ongoing website maintenance and support is part of our Website & App Development service, so your site keeps running smoothly, securely, and up to date after launch.',
  },
  {
    question: 'How long does SEO take to show results?',
    answer:
      'SEO is a compounding process rather than an overnight one. Most clients start seeing measurable movement in rankings and organic traffic within a few months, with results building steadily from there.',
  },
  {
    question: 'Do you manage Google Ads and PPC campaigns?',
    answer:
      "Our advertising service is currently focused on paid social — Facebook and Instagram campaigns, including lead generation and conversion-focused ads. If Google Ads or PPC is something you need, reach out and we'll talk through the best way to support it.",
  },
  {
    question: 'Can you manage my Instagram and Facebook accounts?',
    answer:
      'Yes — social media management, including Instagram and Facebook, is part of our SEO & Social Media Marketing service, covering everything from content strategy to day-to-day audience engagement.',
  },
  {
    question: 'How many posts and reels will you create each month?',
    answer:
      "Posting volume is tailored to your plan and goals rather than fixed. We'll agree on a specific monthly content cadence with you before we begin.",
  },
  {
    question: 'Do you create the content as well as manage the social media accounts?',
    answer:
      "Yes. We handle both — creating the content and managing the accounts day-to-day — so you don't have to coordinate between separate teams.",
  },
  {
    question: 'Can you design social media posts, advertisements, brochures, and other marketing materials?',
    answer:
      'Yes, this falls under our Graphic Design service — including social media creatives, digital advertisements, posters and banners, marketing collateral, and presentation design.',
  },
  {
    question: 'Do you provide professional photography and videography?',
    answer:
      "Our Videography & Editing service covers video — from concept and scriptwriting through production and editing. If photography is something you need alongside video, let us know your requirements and we'll advise on the best way to support it.",
  },
  {
    question: 'Can you create and edit Reels, promotional videos, and other short-form content?',
    answer:
      'Yes — Reels and other short-form video are a core part of our Videography & Editing service, alongside promotional videos, explainer videos, testimonial videos, and motion graphics.',
  },
  {
    question: 'Can Digital Dude help me find influencers or build my personal brand?',
    answer:
      'Yes, both are dedicated services. Influencer Marketing covers research, selection, and full campaign management, and Personal Branding covers positioning, content, and thought-leadership support for founders and professionals who want to build their own name.',
  },
];
