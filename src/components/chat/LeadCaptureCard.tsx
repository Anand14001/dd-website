/**
 * In-chat contact capture.
 *
 * Two required fields up front — name and WhatsApp number — because every extra
 * field costs completions. Everything else sits behind an optional "Add project
 * details" step, so a visitor who wants to share budget and timeline can, and one
 * who does not still gets captured. Anything left blank is inferred from the
 * conversation server-side.
 */
import React, { useState } from 'react';
import { Check, ChevronDown, Loader2, Send } from 'lucide-react';

/** Mirrors SERVICE_CATALOG ids in api/_lib/leadIntelligence.ts. */
const SERVICE_OPTIONS: { id: string; label: string }[] = [
  { id: 'web_development', label: 'Website' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'mobile_app', label: 'Mobile app' },
  { id: 'social_media', label: 'Social media' },
  { id: 'video', label: 'Reels & video' },
  { id: 'ads', label: 'Ads & leads' },
  { id: 'seo', label: 'SEO' },
  { id: 'branding', label: 'Branding & design' },
  { id: 'influencer', label: 'Influencer' },
  { id: 'maintenance', label: 'Maintenance' },
];

const BUDGET_OPTIONS = ['Under 25k', '25k–50k', '50k–1L', '1L–3L', '3L+', 'Not sure yet'];
const TIMELINE_OPTIONS = ['ASAP', 'This month', '1–3 months', 'Just exploring'];

const pillClass = (active: boolean) =>
  `rounded-full border px-2.5 py-1 text-[11px] transition ${
    active
      ? 'border-lime/60 bg-lime/15 text-lime'
      : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
  }`;

const inputClass =
  'w-full rounded-lg border border-white/10 bg-ink px-3 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:border-lime/50';

export interface LeadCapturePayload {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  businessType?: string;
  services: string[];
  budget?: string;
  timeline?: string;
  consent: boolean;
}

export const LeadCaptureCard: React.FC<{
  onSubmit: (payload: LeadCapturePayload) => Promise<void>;
  onDismiss: () => void;
}> = ({ onSubmit, onDismiss }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');

  const [expanded, setExpanded] = useState(false);
  const [consent, setConsent] = useState(true);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleService = (id: string) =>
    setServices((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );

  const phoneDigits = phone.replace(/\D/g, '').slice(-10);
  const phoneValid = /^[6-9]\d{9}$/.test(phoneDigits);
  const canSubmit = name.trim().length > 1 && phoneValid && consent && !busy;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setBusy(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        phone: phoneDigits,
        email: email.trim() || undefined,
        company: company.trim() || undefined,
        businessType: businessType.trim() || undefined,
        services,
        budget: budget || undefined,
        timeline: timeline || undefined,
        consent,
      });
      setDone(true);
    } catch {
      setError('Could not send that. Please try again, or WhatsApp us on +91 97870 97006.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-lime/30 bg-lime/[0.07] px-3.5 py-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-lime">
          <Check size={13} /> Got it, {name.split(' ')[0]}!
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-white/70">
          Our team will reach out on WhatsApp shortly. Meanwhile, ask me anything else about what
          we do.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-lime/25 bg-white/[0.03] px-3.5 py-3"
    >
      <p className="text-xs font-semibold text-white">Want our team to call you back?</p>
      <p className="mt-1 text-[11px] leading-relaxed text-white/55">
        Drop your details and we&apos;ll get back with a clear plan and pricing.
      </p>

      <div className="mt-3 flex flex-col gap-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className={inputClass}
          autoComplete="name"
        />
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="WhatsApp number"
          inputMode="tel"
          className={inputClass}
          autoComplete="tel"
        />
        {phone.length > 0 && !phoneValid && (
          <p className="text-[11px] text-amber-400">
            Please enter a 10-digit Indian mobile number.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mt-2.5 flex items-center gap-1 text-[11px] text-white/50 transition hover:text-white/80"
      >
        <ChevronDown
          size={12}
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
        {expanded ? 'Hide project details' : 'Add project details (optional)'}
      </button>

      {expanded && (
        <div className="mt-2.5 flex flex-col gap-2.5 border-t border-white/[0.07] pt-2.5">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email (optional)"
            className={inputClass}
            autoComplete="email"
          />
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder="Business name (optional)"
            className={inputClass}
            autoComplete="organization"
          />
          <input
            value={businessType}
            onChange={(event) => setBusinessType(event.target.value)}
            placeholder="What kind of business? e.g. bakery, clinic"
            className={inputClass}
          />

          <div>
            <p className="mb-1.5 text-[11px] text-white/50">What do you need?</p>
            <div className="flex flex-wrap gap-1.5">
              {SERVICE_OPTIONS.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className={pillClass(services.includes(service.id))}
                >
                  {service.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[11px] text-white/50">Rough budget</p>
            <div className="flex flex-wrap gap-1.5">
              {BUDGET_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setBudget(budget === option ? '' : option)}
                  className={pillClass(budget === option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[11px] text-white/50">When do you want to start?</p>
            <div className="flex flex-wrap gap-1.5">
              {TIMELINE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTimeline(timeline === option ? '' : option)}
                  className={pillClass(timeline === option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <label className="mt-3 flex items-start gap-2 text-[10px] leading-relaxed text-white/45">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 accent-lime"
        />
        <span>
          I agree that Digital Dude may store these details and contact me about my enquiry.
        </span>
      </label>

      {error && <p className="mt-2 text-[11px] text-amber-400">{error}</p>}

      <div className="mt-3 flex items-center gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-lime px-3 py-2 text-xs font-semibold text-ink transition hover:bg-lime-dim disabled:cursor-not-allowed disabled:opacity-45"
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          {busy ? 'Sending…' : 'Send my details'}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg px-2.5 py-2 text-[11px] text-white/40 transition hover:text-white/70"
        >
          Not now
        </button>
      </div>
    </form>
  );
};
