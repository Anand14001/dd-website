export interface ValuePillar {
  title: string;
  description: string;
  iconName: string;
  /** Per-card accent colour, used for the icon, timeline node and card glow. */
  accent: string;
}

export const WHY_CHOOSE_US: ValuePillar[] = [
  {
    title: 'Proven Expertise',
    description:
      "With years of experience in the digital industry, our team brings unmatched expertise to every project. We've successfully helped businesses of all sizes achieve their online goals through targeted solutions.",
    iconName: 'Award',
    accent: '#BFFF00',
  },
  {
    title: 'Innovation and Adaptability',
    description:
      'We stay ahead of industry trends, continuously adapting to new technologies and market shifts. Our innovative strategies ensure that your business remains competitive and poised for growth.',
    iconName: 'Lightbulb',
    accent: '#A78BFA',
  },
  {
    title: 'Comprehensive Services',
    description:
      'From website design to digital marketing, we offer a wide range of services tailored to meet your business needs. Our holistic approach guarantees seamless integration across all digital platforms.',
    iconName: 'Layers',
    accent: '#38BDF8',
  },
  {
    title: 'Dedicated Support',
    description:
      "Our team is committed to providing ongoing support and guidance, ensuring that your business receives the attention it deserves. We're here to help you navigate challenges and celebrate successes every step of the way.",
    iconName: 'LifeBuoy',
    accent: '#FB923C',
  },
];

export interface ClientStory {
  id: string;
  name: string;
  company: string;
  quote: string;
}

/** Real client testimonials from the live digital-dude.com site. */
export const CLIENT_STORIES: ClientStory[] = [
  {
    id: 'abirami-letspropstore',
    name: 'Abirami',
    company: 'LetsPropStore — A Props Store',
    quote:
      'We got connected to Lalith - Digital Dude for e-commerce solutions, and they delivered beyond our expectations. Their team built a robust online store that not only looks amazing but also drives sales. Thank you for your outstanding work!',
  },
  {
    id: 'hari-aceter',
    name: 'Hari',
    company: 'Aceter — A Hybrid Social Media App',
    quote:
      "As a startup, first we needed a logo that would stand out and represent our brand effectively. Digital Dude's logo design team nailed it! Their creativity and attention to detail made all the difference. We're thrilled with our new logo. We're also building our app with the same team, and will launch soon with a big shoutout to the world.",
  },
  {
    id: 'mohsin-razzus',
    name: 'Mohsin',
    company: 'Razzus Automotive',
    quote:
      "Digital Dude's event booking website development service exceeded our expectations. They created a user-friendly and visually stunning platform that simplified the entire booking process for our clients. The seamless integration of features, intuitive design, and exceptional functionality have significantly boosted our event bookings. We couldn't be happier with the results and highly recommend their expertise!",
  },
];

export const SATISFACTION_STAT = {
  value: '99%',
  label: 'Satisfied Clients',
  detail: 'Our superior services have resulted in a 99% client satisfaction rate.',
  image: 'https://digital-dude.com/wp-content/uploads/2025/01/7581110-e1738067131140.jpeg',
  imageAlt: 'Colleagues in a meeting against a city skyline',
};
