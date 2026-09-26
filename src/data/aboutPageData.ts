export interface Principle {
  label: string;
  title: string;
  body: string;
}

export const PRINCIPLES: Principle[] = [
  {
    label: '01',
    title: 'Our Philosophy',
    body: 'At Digital Dude, we believe in a customer-first approach, where every project is treated with dedication and precision. We value innovation, integrity, and collaboration, working hand-in-hand with our clients to turn their digital aspirations into reality. Our solutions are designed not just for today, but to pave the way for future growth.',
  },
  {
    label: '02',
    title: 'Our Vision',
    body: 'To be the leading digital solutions provider, transforming businesses worldwide by combining creativity, technology, and strategic marketing. We envision a future where every brand achieves its full potential through seamless digital experiences.',
  },
  {
    label: '03',
    title: 'Our Mission',
    body: 'To empower businesses by providing innovative digital solutions that drive growth, enhance online presence, and create lasting connections with customers. Through expert design, marketing strategies, and development, we aim to deliver measurable results for every client.',
  },
];

export interface ProcessStep {
  number: string;
  title: string;
  body: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Initial Consultation',
    body: 'Start your journey with a personalized consultation where we understand your unique business goals. This initial meeting helps us align our strategies with your vision for maximum impact.',
  },
  {
    number: '02',
    title: 'Market Research',
    body: 'We conduct in-depth market research to identify trends, opportunities, and competitor strategies. This data-driven approach ensures that your business stays ahead in the competitive landscape.',
  },
  {
    number: '03',
    title: 'Strategy Development',
    body: 'Based on insights from our research, we craft a tailored strategy designed to achieve your business objectives. Our strategies are flexible, adaptive, and focused on driving measurable results.',
  },
];

/** Headline figure shown alongside the About hero. */
export const TRAFFIC_STAT = {
  label: 'Monthly Traffic',
  value: '100K',
  delta: '+70%',
};

export const RATING_STAT = {
  value: '4.9',
  label: 'Client Ratings',
  detail:
    'Our stellar client rating showcases the exceptional quality and satisfaction we deliver with every project.',
};
