// ─────────────────────────────────────────────────────────────────────────
//  Core brand + navigation. Content sourced from digital-dude.com
// ─────────────────────────────────────────────────────────────────────────

export const brand = {
  name: "Digital Dude",
  short: "DD",
  logo: "/brand/logo_white.png",
  icon: "/brand/favicon-300.png",
  tagline: "Your Digital Partner",
  parent: "LASQUARE DIGITAL SOLUTIONS PRIVATE LIMITED",
  blurb:
    "Digital Dude offers comprehensive digital services tailored for you to elevate your brand and achieve exceptional growth.",
  emails: ["wedigitaldude@gmail.com", "lalith@digital-dude.com"],
  phones: ["+91 97870 97006", "+91 89396 51525"],
  address: "No.90, Ramanujakoodam Street, Poonamallee, Chennai - 600056",
  hours: "Monday to Saturday, 09:00 AM – 06:00 PM",
  mapEmbed:
    "https://www.google.com/maps?q=No.90%2C%20Ramanujakudam%20street%2C%20Poonamallee&t=m&z=16&output=embed&iwloc=near",
};

/* Social profiles, as linked from digital-dude.com */
export const socials = [
  { name: "Instagram", url: "https://www.instagram.com/we.digitaldude" },
  { name: "Facebook", url: "https://www.facebook.com/share/1DeXHjqiDp/" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/weDigitalDude" },
];

export const nav = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Events", to: "/events" },
  { label: "Blog", to: "/blog" },
];

export const hero = {
  eyebrow: "Digital Agency · Chennai",
  title: "Transform Your Online Business with Digital Dude",
  body: "At Digital Dude, we bring your digital ideas to life. From innovative design concepts to seamless execution, our expert team handles every step to ensure your online presence stands out. Whether it’s web development, digital marketing, or custom solutions, we make your vision a reality!",
  ctaPrimary: { label: "Start a project", to: "/contact" },
  ctaSecondary: { label: "See our work", to: "/portfolio" },
  stats: [
    { value: "68+", label: "Projects delivered" },
    { value: "99%", label: "Client satisfaction" },
    { value: "24x7", label: "Support" },
  ],
};

export const marquee = [
  "SEO & SMM",
  "Web & App Development",
  "Social Media Advertising",
  "Digital Marketing",
  "Graphic Design",
  "Video Production",
  "Influencer Marketing",
  "Automation",
];

export const philosophy = {
  title:
    "Transforming Businesses Through Strategic Marketing: Unlock Growth with Tailored Solutions",
  body: "At Digital Dude, a brand under our parent company LASQUARE DIGITAL SOLUTIONS PRIVATE LIMITED, we empower businesses to grow with the right blend of technology and marketing.",
  items: [
    {
      title: "Our Philosophy",
      body: "We believe in a customer-first approach, where every project is treated with dedication and precision. We value innovation, integrity and collaboration, working hand-in-hand with our clients to turn their digital goals into reality.",
    },
    {
      title: "Our Vision",
      body: "To be the leading digital solutions provider, transforming businesses worldwide by combining creativity, technology and strategic marketing. We envision a future where every brand achieves its full potential through seamless digital experiences.",
    },
    {
      title: "Our Mission",
      body: "To empower businesses by providing innovative digital solutions that drive growth, enhance online presence and create lasting connections with customers through expert design, marketing strategy and development.",
    },
  ],
};

export const whyUs = {
  title: "Empowering Your Business to Achieve Unmatched Success",
  body: "Our stellar client rating showcases the exceptional quality and satisfaction we deliver with every project.",
  items: [
    {
      title: "Proven Expertise",
      body: "With years of experience in the digital industry, our team brings unmatched expertise to every project. We have successfully helped businesses of all sizes achieve their online goals through targeted solutions.",
    },
    {
      title: "Innovation and Adaptability",
      body: "We stay ahead of industry trends, continuously adapting to new technologies and market shifts. Our innovative strategies ensure that your business remains competitive and poised for growth.",
    },
    {
      title: "Comprehensive Services",
      body: "From website design to digital marketing, we offer a wide range of services tailored to meet your business needs. Our holistic approach guarantees seamless integration across all digital platforms.",
    },
    {
      title: "Dedicated Support",
      body: "Our team is committed to providing ongoing support and guidance, ensuring that your business receives the attention it deserves. We are here to help you navigate challenges and celebrate successes every step of the way.",
    },
  ],
};

export const process = {
  eyebrow: "Our process",
  title: "A Proven Step-by-Step Approach to Achieving Your Business Goals",
  body: "A structured, transparent process designed to turn your goals into measurable results.",
  steps: [
    {
      n: "1",
      short: "Consultation",
      image: "/process/1-consultation.jpg",
      alt: "A first consultation between a client and the team",
      title: "Initial Consultation",
      body: "We start by understanding your business, your audience and the outcomes you actually care about. This first conversation shapes everything that follows.",
      points: [
        "Discovery call and requirement gathering",
        "Business goals and success metrics agreed",
        "Current website and channel audit",
        "Budget and timeline alignment",
        "Clear scope documented before any work starts",
      ],
    },
    {
      n: "2",
      short: "Market Research",
      image: "/process/2-research.jpg",
      alt: "Analytics and market research charts on a desk",
      title: "Market Research",
      body: "We study your competitors, your market and your customers — identifying the gaps and opportunities your brand can realistically win.",
      points: [
        "Competitor and category analysis",
        "Keyword and search demand research",
        "Audience profiling and segmentation",
        "Positioning and messaging direction",
        "Opportunity gaps mapped and prioritised",
      ],
    },
    {
      n: "3",
      short: "Strategy",
      image: "/process/3-strategy.jpg",
      alt: "A team planning strategy around a table",
      title: "Strategy Development",
      body: "We build a clear roadmap with defined channels, creative direction, budgets and KPIs, so you know exactly what we are doing and why.",
      points: [
        "Channel mix and budget allocation",
        "Creative direction and moodboards",
        "Content and campaign calendar",
        "Conversion and tracking plan",
        "KPIs agreed with you upfront",
      ],
    },
    {
      n: "4",
      short: "Execution",
      image: "/process/4-execution.jpg",
      alt: "The team building and testing the work",
      title: "Execution & Delivery",
      body: "Design, development, campaigns and content go live — built to the agreed scope and tested properly before launch.",
      points: [
        "Design sign-off before development begins",
        "Responsive build tested across devices",
        "Campaign setup with full tracking",
        "Quality assurance and speed checks",
        "Launch handled end to end",
      ],
    },
    {
      n: "5",
      short: "Optimise",
      image: "/process/5-optimise.jpg",
      alt: "Hands together over performance reports",
      title: "Optimise & Scale",
      body: "We track performance, report transparently and keep refining. What works gets scaled, what does not gets cut.",
      points: [
        "Monthly performance reporting",
        "A/B testing and creative refreshes",
        "Budget shifted to what converts",
        "Ongoing technical support",
        "Quarterly strategy reviews",
      ],
    },
  ],
};

export const clients = [
  { name: "LetsPropStore", logo: "/clients/letspropstore.png" },
  { name: "Wishkart", logo: "/clients/wishkart.jpg" },
  { name: "Aceter", logo: "/clients/aceter.png" },
  { name: "Hostaloj", logo: "/clients/hostaloj.png" },
  { name: "Razzus", logo: "/clients/razzus.png" },
  { name: "Electronics Avenue", logo: "/clients/electronics-avenue.png" },
];

export const testimonials = {
  title: "Success Stories From Those Who Know Us Best",
  body: "Our superior services have resulted in a 99% client satisfaction rate.",
  items: [
    {
      quote:
        "We got connected to Lalith — Digital Dude for e-commerce solutions, and they delivered beyond our expectations. Their team built a robust online store that not only looks amazing but also drives sales.",
      author: "LetsPropStore",
      org: "A Props Store",
    },
    {
      quote:
        "As a startup, first we needed a logo that would stand out and represent our brand effectively. Digital Dude's logo design team nailed it. Their creativity and attention to detail made all the difference.",
      author: "Aceter",
      org: "A Hybrid Social Media App",
    },
    {
      quote:
        "Digital Dude's event booking website development service exceeded our expectations. They created a user-friendly and visually stunning platform that simplified the entire booking process for our clients.",
      author: "Razzus",
      org: "Event Booking Platform",
    },
    {
      quote:
        "Their team understood our requirements quickly and delivered a store that our customers genuinely enjoy using. Support after launch has been consistently responsive.",
      author: "Wishkart",
      org: "E-Commerce Store",
    },
  ],
};

export const faqs = [
  {
    q: "What services does Digital Dude offer?",
    a: "We offer end-to-end digital services: SEO and social media marketing, website and app development, social media advertising, digital marketing, graphic design, video production and editing, influencer marketing, and automation and funnel building.",
  },
  {
    q: "How much does a website cost?",
    a: "It depends on scope — a simple business site, an online store and a full learning platform are very different builds. We always quote a fixed fee against an agreed scope, so there are no surprises. Get in touch and we will put a number against what you actually need.",
  },
  {
    q: "How long does a project take?",
    a: "A static business website typically takes 2 to 3 weeks. E-commerce and LMS builds take 4 to 8 weeks depending on complexity. Marketing retainers begin delivering within the first month.",
  },
  {
    q: "Do you work with businesses outside Chennai?",
    a: "Yes. We are based in Poonamallee, Chennai, and work with clients across India and internationally. All collaboration happens over calls, WhatsApp and shared project boards.",
  },
  {
    q: "What ongoing support do you provide?",
    a: "We provide 24x7 support and continuous technical assistance. Our team stays available after launch to handle updates, fixes and growth work.",
  },
  {
    q: "Do you handle both design and marketing?",
    a: "Yes — that is the point of working with us. We can design and build your site, then run the campaigns that bring traffic to it, so creative and performance stay aligned.",
  },
  {
    q: "How do we get started?",
    a: "Reach out through the contact form, email or WhatsApp. We will arrange an initial consultation to understand your goals, then come back with a scoped proposal and a fixed quote.",
  },
];

export const footer = {
  quickLinks: [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "Services", to: "/services" },
    { label: "Portfolio", to: "/portfolio" },
    { label: "Events", to: "/events" },
    { label: "Blog", to: "/blog" },
    { label: "Contact Us", to: "/contact" },
  ],
  policies: [
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Terms and Conditions", to: "/terms-and-conditions" },
    { label: "Return and Refund Policy", to: "/return-and-refund-policy" },
    { label: "Verify Certificate", to: "/verify-certificate" },
  ],
};

