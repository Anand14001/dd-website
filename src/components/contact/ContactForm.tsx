import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { SERVICES } from '../../data/agencyData';

interface ContactFormProps {
  /** Service title carried over from the services page; preselects its pill. */
  initialService?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const FIELD_CLASS =
  'w-full rounded-xl border border-black/10 bg-[#f5f5f0] px-4 py-3 text-sm text-black placeholder-black/25 outline-none transition focus:border-black/40 focus:ring-2 focus:ring-lime-shadow/20';

export const ContactForm: React.FC<ContactFormProps> = ({ initialService }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [services, setServices] = useState<string[]>(initialService ? [initialService] : []);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Keep the preselected pill in sync when arriving from a service card.
  useEffect(() => {
    if (initialService) {
      setServices((prev) => (prev.includes(initialService) ? prev : [...prev, initialService]));
    }
  }, [initialService]);

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: '' }));
    };

  const toggleService = (title: string) => {
    setServices((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setFormError(null);
    setErrors({});

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, services }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrors(data.errors ?? {});
        setFormError(data.errors ? null : 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setFormError('Could not reach the server. Please try again or call us directly.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-[32rem] flex-col items-center justify-center rounded-3xl bg-[#f5f5f0] p-10 text-center"
      >
        <CheckCircle2 className="h-14 w-14 text-lime-shadow" />
        <h3 className="mt-6 text-2xl font-bold text-black">Message received.</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-black/60">
          Thanks {form.name.split(' ')[0] || 'for reaching out'} &mdash; we&apos;ll come back to you
          within one working day.
        </p>
      </motion.div>
    );
  }

  return (
    <div id="enquiry" className="rounded-3xl bg-[#f5f5f0] p-7 sm:p-10">
      <h2 className="text-3xl font-bold tracking-[-0.02em] text-black sm:text-4xl">
        START YOUR PROJECT.
      </h2>
      <p className="mt-2 text-sm text-black/50">
        Fields marked * are required. Everything else just helps us prepare.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-bold text-black/70">
            Your Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={update('name')}
            placeholder="Lalith Kumar"
            aria-invalid={Boolean(errors.name)}
            className={FIELD_CLASS}
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-black/70">
              Email *
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={update('email')}
              placeholder="you@company.com"
              aria-invalid={Boolean(errors.email)}
              className={FIELD_CLASS}
            />
            {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-xs font-bold text-black/70">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={update('phone')}
              placeholder="+91 90000 00000"
              className={FIELD_CLASS}
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="mb-1.5 block text-xs font-bold text-black/70">
            Company / Website
          </label>
          <input
            id="company"
            type="text"
            value={form.company}
            onChange={update('company')}
            placeholder="yourcompany.com"
            className={FIELD_CLASS}
          />
        </div>

        {/* Service pills - multi-select, driven by the real services list. */}
        <fieldset>
          <legend className="mb-2.5 text-xs font-bold text-black/70">Services Interested In</legend>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((service) => {
              const active = services.includes(service.title);
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.title)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                    active
                      ? 'border-black bg-black text-lime'
                      : 'border-black/10 bg-[#f5f5f0] text-black/70 hover:border-black/30'
                  }`}
                >
                  {service.title}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-xs font-bold text-black/70">
            Tell us about your project *
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={form.message}
            onChange={update('message')}
            placeholder="What are your goals? Rough budget? Timeline?"
            aria-invalid={Boolean(errors.message)}
            className={`${FIELD_CLASS} resize-y`}
          />
          {errors.message && <p className="mt-1.5 text-xs text-red-600">{errors.message}</p>}
        </div>

        {formError && (
          <p role="alert" className="text-sm text-red-600">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-black uppercase tracking-wider text-lime transition-all duration-300 hover:bg-lime hover:text-black disabled:opacity-60"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send message
            </>
          )}
        </button>

        <p className="text-center text-xs text-black/40">
          We reply within one working day &mdash; usually sooner.
        </p>
      </form>
    </div>
  );
};
