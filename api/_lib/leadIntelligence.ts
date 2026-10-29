/**
 * Turns a raw conversation into structured lead data: contact details, service
 * interest, budget/timeline hints, a score with a visible breakdown, and a
 * one-line summary.
 *
 * Extraction only ever reads USER messages. The assistant's replies quote the
 * agency's own phone and email, so scanning them would stamp Digital Dude's
 * contact details onto every lead.
 */

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ScoreSignal {
  key: string;
  label: string;
  points: number;
}

export interface ExtractedLead {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  businessType?: string;
  services: string[];
  budgetHint?: string;
  timelineHint?: string;
  summary: string;
  score: number;
  temperature: 'hot' | 'warm' | 'cold';
  signals: ScoreSignal[];
  /** True when there is enough here to be worth a salesperson's time. */
  isLeadWorthy: boolean;
}

export interface ProvidedLeadFields {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  businessType?: string;
  services?: string[];
  budgetHint?: string;
  timelineHint?: string;
}

/** Canonical service list, mirroring section 5 of the system prompt. */
export const SERVICE_CATALOG: { id: string; label: string; keywords: string[] }[] = [
  {
    id: 'web_development',
    label: 'Website & Web App Development',
    keywords: ['website', 'web site', 'webpage', 'web app', 'landing page', 'react', 'next.js', 'nextjs', 'wordpress', 'redesign', 'web development', 'website panna', 'web dev'],
  },
  {
    id: 'ecommerce',
    label: 'E-commerce Development',
    keywords: ['ecommerce', 'e-commerce', 'online store', 'shopify', 'woocommerce', 'payment gateway', 'product catalog', 'online selling', 'add to cart'],
  },
  {
    id: 'mobile_app',
    label: 'Mobile App & Software',
    keywords: ['mobile app', 'android', 'ios', 'app development', 'play store', 'app store', 'flutter', 'react native', 'software development'],
  },
  {
    id: 'social_media',
    label: 'Social Media Marketing & Management',
    keywords: ['social media', 'instagram', 'insta', 'facebook', 'linkedin', 'smm', 'page handling', 'content calendar', 'account manage', 'post handling', 'youtube channel'],
  },
  {
    id: 'video',
    label: 'Videography, Reels & Editing',
    keywords: ['reel', 'reels', 'video', 'videography', 'shoot', 'editing', 'short form', 'shorts', 'promo video', 'ad film', 'cinematography'],
  },
  {
    id: 'ads',
    label: 'Performance Ads & PPC',
    keywords: ['ads', 'advertis', 'meta ads', 'facebook ads', 'google ads', 'ppc', 'lead generation', 'lead gen', 'campaign', 'roas', 'paid promotion'],
  },
  {
    id: 'seo',
    label: 'SEO & Content Marketing',
    keywords: ['seo', 'search engine', 'ranking', 'google ranking', 'keywords', 'organic traffic', 'content marketing', 'blog'],
  },
  {
    id: 'branding',
    label: 'Branding, Logo & Graphic Design',
    keywords: ['logo', 'branding', 'brand identity', 'graphic design', 'creatives', 'poster', 'banner', 'brochure', 'visiting card', 'packaging'],
  },
  {
    id: 'influencer',
    label: 'Influencer & Personal Branding',
    keywords: ['influencer', 'personal brand', 'personal branding', 'collaboration', 'ugc', 'creator'],
  },
  {
    id: 'maintenance',
    label: 'Website Maintenance & Support',
    keywords: ['maintenance', 'amc', 'bug fix', 'update my site', 'hosting', 'domain', 'migrate'],
  },
];

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

/** Indian mobile numbers, tolerating +91 / 91 / 0 prefixes and spacing. */
const PHONE_RE = /(?:\+?91[\s-]?|0)?([6-9]\d{2}[\s-]?\d{3}[\s-]?\d{4})\b/;

const NAME_PATTERNS = [
  /\b(?:my name is|myself|this is|i am|i'm|name:)\s+([a-z][a-z.\s]{1,38}?)(?=[,.!?]|\s+(?:and|from|here|i|we|my)\b|$)/i,
  /\bname\s*[-:]\s*([a-z][a-z.\s]{1,38})/i,
];

const COMPANY_PATTERNS = [
  // The negative lookahead keeps business *types* out of the company field:
  // "I run a bakery" names no company, while "I run Sweet Treats" does.
  /\b(?:i run|i own|we run|we own|working at|work at)\s+(?:the|my)?\s*(?!a\s|an\s)([a-z0-9&.'\s-]{2,48}?)(?=[,.!?]|\s+(?:and|in|at|located|based)\b|$)/i,
  /\b(?:company|business|firm|brand|shop|store|startup)\s*(?:name)?\s*(?:is|:)\s*([a-z0-9&.'\s-]{2,48})/i,
];

const BUSINESS_TYPE_PATTERNS = [
  /\b(?:i run|i own|we run|we own|i have|we have)\s+(?:a|an)\s+([a-z\s]{3,40}?)(?=\s+(?:business|shop|store|company|brand)|[,.!?]|$)/i,
  /\b(?:we are|i am|i'm)\s+(?:a|an)\s+([a-z\s]{3,40}?)(?=[,.!?]|$)/i,
];

/**
 * Ordered most-specific first. Filler words ("around", "about") are consumed
 * outside the capture group, and the amount itself is captured rather than a
 * loose run of characters — otherwise "Budget is around 75,000, need it ASAP"
 * yields "75,000, need it ASAP" instead of "75,000".
 */
const AMOUNT = String.raw`(?:₹|rs\.?|inr)?\s?[\d,]+(?:\.\d+)?\s?(?:lakhs|lakh|lac|crore|cr|k|l)?`;
const FILLER = String.raw`(?:around|about|approx(?:imately)?|roughly|nearly|up\s?to|max|under|below)?`;

const BUDGET_PATTERNS = [
  new RegExp(String.raw`\bbudget\s*(?:is|of|:|=)?\s*${FILLER}\s*(${AMOUNT})`, 'i'),
  /(?:₹|rs\.?|inr)\s?([\d,]+(?:\.\d+)?)\s?(k|lakh|lakhs|lac|l|crore|cr)?/i,
  /\b([\d,]+(?:\.\d+)?)\s?(k|lakh|lakhs|lac|crore|cr)\b/i,
  // Last resort for non-numeric answers such as "budget is flexible".
  /\bbudget\s*(?:is|of|:|=)?\s*([^.,!?\n]{2,30})/i,
];

const TIMELINE_PATTERNS = [
  /\b(asap|as soon as possible|immediately|urgently|right away|this week|next week|this month|next month)\b/i,
  /\b(?:within|in)\s+(\d+\s*(?:day|days|week|weeks|month|months))\b/i,
  /\b(?:by|before)\s+(january|february|march|april|may|june|july|august|september|october|november|december)\b/i,
  /\b(\d+\s*(?:day|days|week|weeks|month|months))\s+(?:timeline|deadline)\b/i,
];

const URGENT_RE = /\b(asap|as soon as possible|immediately|urgent|urgently|right away|this week)\b/i;

const PRICING_RE = /\b(price|pricing|cost|costs|charge|charges|quote|quotation|rate|rates|how much|budget|package|packages|fees|fee|evlo|evalo|ethana)\b/i;

const CALL_RE = /\b(call|phone|meet|meeting|discuss|talk|schedule|appointment|demo|visit|connect|whatsapp|consultation|discovery)\b/i;

const READY_RE = /\b(start|begin|proceed|go ahead|sign up|onboard|hire|book|confirm|interested|ready)\b/i;

/** Collapses whitespace and trims trailing punctuation from a captured phrase. */
function clean(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.replace(/\s+/g, ' ').replace(/[,.;:!?'"\s-]+$/, '').trim();
  return trimmed.length > 1 ? trimmed : undefined;
}

function titleCase(value: string): string {
  return value
    .split(' ')
    .map((word) => (word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');
}

/** Reduces any Indian mobile format to a bare 10-digit number. */
export function normalisePhone(raw: string): string | undefined {
  const digits = raw.replace(/\D/g, '');
  let local = digits;
  if (local.length === 12 && local.startsWith('91')) local = local.slice(2);
  else if (local.length === 13 && local.startsWith('091')) local = local.slice(3);
  else if (local.length === 11 && local.startsWith('0')) local = local.slice(1);
  if (local.length !== 10) return undefined;
  if (!/^[6-9]/.test(local)) return undefined;
  return local;
}

export function formatPhoneForDisplay(phone: string | null | undefined): string {
  if (!phone) return '';
  const local = normalisePhone(phone);
  return local ? `+91 ${local.slice(0, 5)} ${local.slice(5)}` : phone;
}

function firstMatch(text: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match) {
      const captured = clean(match[1]);
      if (captured) return captured;
    }
  }
  return undefined;
}

/** Service ids mentioned anywhere in the user's text. */
export function detectServices(text: string): string[] {
  const haystack = text.toLowerCase();
  const found: string[] = [];
  for (const service of SERVICE_CATALOG) {
    if (service.keywords.some((keyword) => haystack.includes(keyword))) {
      found.push(service.id);
    }
  }
  return found;
}

export function serviceLabel(id: string): string {
  return SERVICE_CATALOG.find((s) => s.id === id)?.label ?? id;
}

function normaliseBudget(text: string): string | undefined {
  for (const pattern of BUDGET_PATTERNS) {
    const match = pattern.exec(text);
    if (!match) continue;
    const amount = clean(match[1]);
    if (!amount) continue;
    const unit = match[2] ? ` ${match[2].toLowerCase()}` : '';
    // Ignore bare small numbers that are almost certainly not budgets.
    const numeric = Number(amount.replace(/,/g, ''));
    if (!unit && Number.isFinite(numeric) && numeric < 1000) continue;
    return `${amount}${unit}`.trim();
  }
  return undefined;
}

/**
 * Builds structured lead data from a transcript.
 *
 * `provided` carries anything the visitor typed into the capture card. It always
 * wins over text extraction, because it is clean, structured and consented.
 */
export function extractLead(turns: ChatTurn[], provided: ProvidedLeadFields = {}): ExtractedLead {
  const userTurns = turns.filter((t) => t.role === 'user');
  const userText = userTurns.map((t) => t.content).join('\n');
  const lowerText = userText.toLowerCase();

  const emailMatch = EMAIL_RE.exec(userText);
  const phoneMatch = PHONE_RE.exec(userText);

  const email = provided.email?.trim().toLowerCase() || emailMatch?.[0]?.toLowerCase();
  const phone =
    (provided.phone ? normalisePhone(provided.phone) : undefined) ||
    (phoneMatch ? normalisePhone(phoneMatch[0]) : undefined);

  const extractedName = firstMatch(userText, NAME_PATTERNS);
  const name = provided.name?.trim() || (extractedName ? titleCase(extractedName) : undefined);

  const company = provided.company?.trim() || firstMatch(userText, COMPANY_PATTERNS);
  const businessType = provided.businessType?.trim() || firstMatch(userText, BUSINESS_TYPE_PATTERNS);

  const detected = detectServices(userText);
  const services = Array.from(new Set([...(provided.services || []), ...detected])).filter(Boolean);

  const budgetHint = provided.budgetHint?.trim() || normaliseBudget(userText);
  const timelineHint = provided.timelineHint?.trim() || firstMatch(userText, TIMELINE_PATTERNS);

  // ------------------------------------------------------------------ scoring
  const signals: ScoreSignal[] = [];
  const add = (key: string, label: string, points: number) => signals.push({ key, label, points });

  if (phone) add('phone', 'Shared a phone number', 30);
  if (email) add('email', 'Shared an email address', 15);
  if (PRICING_RE.test(lowerText)) add('pricing', 'Asked about pricing', 15);
  if (CALL_RE.test(lowerText)) add('call', 'Asked to talk or meet', 15);
  if (READY_RE.test(lowerText)) add('ready', 'Signalled readiness to start', 10);
  if (timelineHint) add('timeline', 'Gave a timeline', 10);
  if (URGENT_RE.test(lowerText)) add('urgent', 'Timeline is urgent', 5);
  if (services.length > 0) {
    add('service', `Named ${services.length} service${services.length > 1 ? 's' : ''}`, 8);
  }
  if (company || businessType) add('business', 'Described their business', 7);
  if (budgetHint) add('budget', 'Mentioned a budget', 10);

  const engagement = Math.min(10, Math.max(0, (userTurns.length - 1) * 2));
  if (engagement > 0) add('engagement', `${userTurns.length} messages exchanged`, engagement);

  const score = Math.min(100, signals.reduce((sum, s) => sum + s.points, 0));

  const hasContact = Boolean(phone || email);
  const strongIntent = PRICING_RE.test(lowerText) || CALL_RE.test(lowerText) || READY_RE.test(lowerText);

  let temperature: ExtractedLead['temperature'] = 'cold';
  if ((hasContact && strongIntent) || score >= 60) temperature = 'hot';
  else if (score >= 30 || hasContact) temperature = 'warm';

  // ------------------------------------------------------------------ summary
  const summaryParts: string[] = [];
  if (businessType) summaryParts.push(`Runs a ${businessType}`);
  else if (company) summaryParts.push(`From ${company}`);
  if (services.length > 0) summaryParts.push(`Interested in ${services.map(serviceLabel).join(', ')}`);
  if (budgetHint) summaryParts.push(`Budget ${budgetHint}`);
  if (timelineHint) summaryParts.push(`Timeline ${timelineHint}`);
  if (summaryParts.length === 0) {
    const firstUserMessage = userTurns[0]?.content?.replace(/\s+/g, ' ').trim();
    if (firstUserMessage) summaryParts.push(firstUserMessage.slice(0, 160));
  }

  return {
    name,
    email,
    phone,
    company,
    businessType,
    services,
    budgetHint,
    timelineHint,
    summary: summaryParts.join(' · ') || 'Chat enquiry',
    score,
    temperature,
    signals,
    // Worth a salesperson's attention if we can reach them, or if the enquiry is
    // detailed enough to stand on its own. Gating on message count instead would
    // reject a single rich message ("bakery, online store, 75k, ASAP") while
    // admitting two throwaway ones, which is backwards.
    isLeadWorthy: hasContact || score >= 40,
  };
}

/**
 * Decides whether the widget should show the contact-capture card.
 * Fires on buying intent immediately, and otherwise after a few exchanges so a
 * browsing visitor still gets asked once.
 */
export function shouldRequestContact(turns: ChatTurn[]): boolean {
  const userTurns = turns.filter((t) => t.role === 'user');
  if (userTurns.length === 0) return false;
  const text = userTurns.map((t) => t.content).join('\n').toLowerCase();
  if (EMAIL_RE.test(text) || PHONE_RE.test(text)) return false;
  if (PRICING_RE.test(text) || CALL_RE.test(text) || READY_RE.test(text)) return true;
  return userTurns.length >= 3;
}

/** Stable key used to merge repeat enquiries into one lead. */
export function dedupeKey(email?: string, phone?: string): string | null {
  if (phone) {
    const local = normalisePhone(phone);
    if (local) return `phone:${local}`;
  }
  if (email) return `email:${email.trim().toLowerCase()}`;
  return null;
}
