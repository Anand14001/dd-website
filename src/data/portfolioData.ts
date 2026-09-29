export interface PortfolioItem {
  id: string;
  title: string;
  category:
    | 'Website & App Development'
    | 'Graphic Designing'
    | 'Logo'
    | 'Package Design'
    | 'Business Cards'
    | 'Social Media Posters'
    | 'Corporate Needs';
  image: string;
  link?: string;
}

// Sourced from the live digital-dude.com/portfolio/ gallery.
export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // Website & App Development
  {
    id: 'lets-prop-store',
    title: 'Lets Prop Store',
    category: 'Website & App Development',
    image: 'https://digital-dude.com/wp-content/uploads/2025/01/Screenshot-2025-01-28-183834-1536x864.png',
    link: 'https://letspropstore.in',
  },
  {
    id: 'spanda-green',
    title: 'Spanda Green',
    category: 'Website & App Development',
    image: 'https://digital-dude.com/wp-content/uploads/2025/05/Screenshot-2025-05-14-191216.png',
    link: 'https://spandagreen.com',
  },
  {
    id: 'vedhas-clothing',
    title: 'Vedhas Clothing',
    category: 'Website & App Development',
    image:
      'https://digital-dude.com/wp-content/uploads/2025/05/Vedhas-Clothing-%E2%80%93-A-Fashion-Store-e1747230617972.png',
    link: 'https://vedhasclothing.in',
  },
  {
    id: 'ai-accts',
    title: 'Ai-ACCTS',
    category: 'Website & App Development',
    image:
      'https://digital-dude.com/wp-content/uploads/2025/05/Ai-ACCTS-%E2%80%93-Your-Trusted-Accountability-Partner.png',
    link: 'https://ai-accts.in',
  },
  {
    id: 'razzus-automotive-web',
    title: 'Razzus Automotive',
    category: 'Website & App Development',
    image: 'https://digital-dude.com/wp-content/uploads/2025/01/Screenshot-2025-01-28-183823-1536x864.png',
    link: 'https://razzus.net',
  },
  {
    id: 'tiny-little-toes',
    title: 'Tiny Little Toes',
    category: 'Website & App Development',
    image: 'https://digital-dude.com/wp-content/uploads/2025/01/Screenshot-2025-01-28-183744-1536x864.png',
    link: 'https://tinylittletoes.in',
  },
  {
    id: 'master-mindset-ytc',
    title: 'Master Mindset YTC',
    category: 'Website & App Development',
    image: 'https://digital-dude.com/wp-content/uploads/2025/01/Screenshot-2025-01-28-183922-1536x864.png',
    link: 'https://mastermindsetytc.in',
  },
  {
    id: 'electronics-avenue',
    title: 'Electronics Avenue',
    category: 'Website & App Development',
    image: 'https://digital-dude.com/wp-content/uploads/2025/01/Screenshot-2025-01-28-183903-1536x864.png',
  },
  {
    id: 'hostaloj-web',
    title: 'Hostaloj',
    category: 'Website & App Development',
    image: 'https://digital-dude.com/wp-content/uploads/2025/02/Hostaloj_Vertical_Logo_-removebg-preview.png',
    link: 'https://hostaloj.com',
  },

  // Graphic Designing
  {
    id: 'j-designs-fashion-institute',
    title: 'J Designs and Fashion Institute',
    category: 'Graphic Designing',
    image:
      'https://digital-dude.com/wp-content/uploads/2025/02/J-Design-with-Name-White-background-1536x1536.png',
    link: 'https://jdesignsfashioninstitute.com',
  },

  // Logo
  {
    id: 'logo-hostaloj',
    title: 'Hostaloj',
    category: 'Logo',
    image: 'https://digital-dude.com/wp-content/uploads/2025/02/Hostaloj_Vertical_Logo_-removebg-preview.png',
    link: 'https://digital-dude.com/portfolio/hostaloj_vertical_logo_-removebg-preview/',
  },
  {
    id: 'logo-xerox-kadai',
    title: 'Xerox Kadai',
    category: 'Logo',
    image: 'https://digital-dude.com/wp-content/uploads/2025/02/logo-color.png',
    link: 'https://digital-dude.com/portfolio/logo-color/',
  },
  {
    id: 'logo-vbc',
    title: 'VBC - Vaniyambadi Biriyani Cafe',
    category: 'Logo',
    image: 'https://digital-dude.com/wp-content/uploads/2025/02/VBC-LOGO-JPG-1536x1536.png',
    link: 'https://digital-dude.com/portfolio/vbc-logo-jpg/',
  },
  {
    id: 'logo-mompets',
    title: 'Mompets',
    category: 'Logo',
    image: 'https://digital-dude.com/wp-content/uploads/2025/02/logowithtextonly.png',
    link: 'https://digital-dude.com/portfolio/logowithtextonly/',
  },
  {
    id: 'logo-razzus-automotive',
    title: 'Razzus Automotive',
    category: 'Logo',
    image: 'https://digital-dude.com/wp-content/uploads/2025/02/Logo-Razzus-Automotive-for-Website-150x150.png',
    link: 'https://digital-dude.com/portfolio/logo-razzus-automotive-for-website/',
  },
  {
    id: 'logo-jk-drop-taxi',
    title: 'JK Drop Taxi',
    category: 'Logo',
    image: 'https://digital-dude.com/wp-content/uploads/2025/02/JK-Taxi-Logo-with-White-BG.png',
    link: 'https://digital-dude.com/portfolio/jk-taxi-logo-with-white-bg/',
  },
  {
    id: 'logo-ether-gadgets',
    title: 'Ether Gadgets',
    category: 'Logo',
    image: 'https://digital-dude.com/wp-content/uploads/2025/02/ether-gadgets-eG-Logo-Black-with-white-BG.png',
    link: 'https://ethergadgets.com',
  },
  {
    id: 'logo-click-the-lot',
    title: 'Click The Lot',
    category: 'Logo',
    image: 'https://digital-dude.com/wp-content/uploads/2025/02/logo-black.png',
    link: 'https://digital-dude.com/portfolio/logo-black/',
  },
  {
    id: 'logo-gys-designs',
    title: 'GYS Designs',
    category: 'Logo',
    image: 'https://digital-dude.com/wp-content/uploads/2025/02/2.jpg',
    link: 'https://digital-dude.com/portfolio/2-3/',
  },
  {
    id: 'logo-bubbles-studio',
    title: 'Bubbles Studio',
    category: 'Logo',
    image: 'https://digital-dude.com/wp-content/uploads/2025/02/Bubbles-Logo-JPG-File-01-1536x1536.jpg',
    link: 'https://digital-dude.com/portfolio/bubbles-logo-jpg-file-01/',
  },
  {
    id: 'logo-kardozen',
    title: 'Kardozen',
    category: 'Logo',
    image:
      'https://digital-dude.com/wp-content/uploads/2025/10/imgi_18_Black-Gold-Elegant-Logo-Mockup-1-1536x1536.png',
  },

  // Package Design
  {
    id: 'package-amber-bottle',
    title: 'Product Label Design',
    category: 'Package Design',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_14_Amber_Bottle_06-scaled-1-1536x1536.jpg',
  },
  {
    id: 'package-pickle-jar',
    title: 'Product Label Design',
    category: 'Package Design',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_10_Pickle_Jar_Mockup-scaled-1-1536x1536.jpg',
  },
  {
    id: 'package-ghee',
    title: 'Product Label Design',
    category: 'Package Design',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_13_Ghee_Mockup-scaled-1-1536x1536.jpg',
  },
  {
    id: 'package-mockup-bottle',
    title: 'Product Label Design',
    category: 'Package Design',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_12_Mockup_Bottle-scaled-1-1536x1536.jpg',
  },
  {
    id: 'package-abc-mix',
    title: 'Product Label Design',
    category: 'Package Design',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_9_ABC_Mix-scaled-1-1536x1536.jpg',
  },
  {
    id: 'package-01',
    title: 'Product Label Design',
    category: 'Package Design',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_15_01-scaled-1-1536x1536.jpg',
  },
  {
    id: 'package-generic-1',
    title: 'Product Label Design',
    category: 'Package Design',
    image:
      'https://digital-dude.com/wp-content/uploads/2025/10/imgi_46_496186508_1269140268550318_5825450530656904593_n-1229x1536.jpg',
  },
  {
    id: 'package-generic-2',
    title: 'Product Label Design',
    category: 'Package Design',
    image:
      'https://digital-dude.com/wp-content/uploads/2025/10/imgi_33_498932166_1277296207734724_7315486195358396278_n.jpg',
  },
  {
    id: 'package-generic-3',
    title: 'Product Label Design',
    category: 'Package Design',
    image:
      'https://digital-dude.com/wp-content/uploads/2025/10/imgi_19_562443886_1414935813970762_7446132427401347618_n-1229x1536.jpg',
  },
  {
    id: 'sticker-1',
    title: 'Product Sticker',
    category: 'Package Design',
    image:
      'https://digital-dude.com/wp-content/uploads/2025/10/imgi_95_409643048_325796336982633_5596298322578448978_n-1.webp',
  },
  {
    id: 'sticker-2',
    title: 'Product Sticker',
    category: 'Package Design',
    image:
      'https://digital-dude.com/wp-content/uploads/2025/10/imgi_57_424929056_3646107102268796_4494315663000837957_n-1.webp',
  },
  {
    id: 'sticker-3',
    title: 'Product Sticker',
    category: 'Package Design',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_11_fafaf-scaled-1-1536x1536.jpg',
  },
  {
    id: 'sticker-4',
    title: 'Product Sticker',
    category: 'Package Design',
    image:
      'https://digital-dude.com/wp-content/uploads/2025/10/imgi_92_411071114_7031663140224307_4825397846533370418_n.webp',
  },

  // Business Cards
  {
    id: 'business-card-1',
    title: 'Professional Business Card',
    category: 'Business Cards',
    image:
      'https://digital-dude.com/wp-content/uploads/2025/10/imgi_19_Business-Card-on-Plate-PSD-Mockup-scaled-1-1536x1536.jpg',
  },
  {
    id: 'business-card-2',
    title: 'Professional Business Card',
    category: 'Business Cards',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_25_Ilalival_VC-1536x1536.jpg',
  },
  {
    id: 'business-card-3',
    title: 'Professional Business Card',
    category: 'Business Cards',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_24_BusinessCard_02-1536x1536.jpg',
  },
  {
    id: 'business-card-4',
    title: 'Professional Business Card',
    category: 'Business Cards',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_30_OSRDC-scaled-1-1536x1152.jpg',
  },
  {
    id: 'business-card-5',
    title: 'Professional Business Card',
    category: 'Business Cards',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_23_Business-Card-Mockup-scaled-1-1536x1536.jpg',
  },

  // Social Media Posters
  {
    id: 'poster-lake-view-launch',
    title: 'Social Media Poster',
    category: 'Social Media Posters',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_40_Lake_View_Launch_Red.jpg',
  },
  {
    id: 'poster-interior-designers',
    title: 'Social Media Poster',
    category: 'Social Media Posters',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_39_Interior-Designers_Post_1.jpg',
  },
  {
    id: 'poster-vishthaw-promoters',
    title: 'Social Media Poster',
    category: 'Social Media Posters',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_31_Vishthaw_Promoters.jpg',
  },
  {
    id: 'poster-creative-2',
    title: 'Social Media Poster',
    category: 'Social Media Posters',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_36_Creative_2.jpg',
  },
  {
    id: 'poster-whatsapp-1',
    title: 'Social Media Poster',
    category: 'Social Media Posters',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-15-at-3.43.10-PM-1.jpeg',
  },
  {
    id: 'poster-second-hand-card-sale',
    title: 'Social Media Poster',
    category: 'Social Media Posters',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_33_Second_Hand_Card_Sale.jpg',
  },
  {
    id: 'poster-post-01',
    title: 'Social Media Poster',
    category: 'Social Media Posters',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_35_Post_01.jpg',
  },
  {
    id: 'poster-whatsapp-2',
    title: 'Social Media Poster',
    category: 'Social Media Posters',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-15-at-3.43.10-PM.jpeg',
  },
  {
    id: 'poster-christmas-wish',
    title: 'Social Media Poster',
    category: 'Social Media Posters',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_21_Creative_Christmas_Wish.jpg',
  },

  // Corporate Needs
  {
    id: 'corporate-standee-board',
    title: 'Standee Board',
    category: 'Corporate Needs',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_11_462795236_867382222127583_6299256418109805401_n.jpg',
  },
  {
    id: 'corporate-letterhead',
    title: 'Letterhead Design',
    category: 'Corporate Needs',
    image:
      'https://digital-dude.com/wp-content/uploads/2025/10/imgi_39_495369301_1269867335144278_4914634688421728945_n-1230x1536.jpg',
  },
  {
    id: 'corporate-button-badge-1',
    title: 'Button Badge',
    category: 'Corporate Needs',
    image:
      'https://digital-dude.com/wp-content/uploads/2025/10/imgi_47_495501142_1269140128550332_8701516059026654198_n-1229x1536.jpg',
  },
  {
    id: 'corporate-button-badge-2',
    title: 'Button Badge',
    category: 'Corporate Needs',
    image:
      'https://digital-dude.com/wp-content/uploads/2025/10/imgi_48_495487140_1268826185248393_4214195961607873168_n-1229x1536.jpg',
  },
  {
    id: 'corporate-event-wristbands',
    title: 'Event Wristbands',
    category: 'Corporate Needs',
    image: 'https://digital-dude.com/wp-content/uploads/2025/10/imgi_69_416343680_217695608086371_5317560601523818975_n-1.webp',
  },
  {
    id: 'corporate-vbc-board',
    title: 'VBC Event Board',
    category: 'Corporate Needs',
    image:
      'https://digital-dude.com/wp-content/uploads/2025/10/imgi_43_495154626_1269151658549179_4137605523315971647_n-1229x1536.jpg',
  },
];
