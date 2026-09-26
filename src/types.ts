export interface ServiceItem {
  id: string;
  title: string;
  category: 'technology' | 'marketing' | 'creative';
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  deliverables: string[];
  technologies?: string[];
  metrics?: string;
  timeline?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  content: string;
  rating: number;
  highlight: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  /** Service titles picked from the pill toggles on the contact page. */
  services?: string[];
}
