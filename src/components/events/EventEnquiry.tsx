import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MessageCircle,
  PhoneCall,
  Send,
} from 'lucide-react';
import { AGENCY_INFO } from '../../data/agencyData';
import { ENQUIRY_NEEDS, EVENT_TYPES } from '../../data/eventsPageData';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/** Matches the cream field styling used by the main contact form. */
const FIELD_CLASS =
  'w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black placeholder-black/25 outline-none transition focus:border-black/40 focus:ring-2 focus:ring-lime-shadow/20';

const LABEL_CLASS = 'mb-1.5 block text-xs font-bold text-black/70';

const WHATSAPP_NUMBER = '919787097006';

/**
 * Final CTA: the event enquiry form.
 *
 * Event-specific fields rather than a generic contact form, because the answers
 * are what the team needs before a first call — the event, its date, rough
 * attendee numbers and which pieces are actually missing. They are folded into a
 * single readable enquiry and posted to the existing `/api/contact` endpoint, so
 * these leads land in the same pipeline as every other enquiry with no backend
 * change. The requirement checkboxes travel as `services`, which is what the
 * lead-scoring layer already reads.
 */
export const EventEnquiry: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organisation: '',
    eventName: '',
    eventType: '',
    eventDate: '',
    attendees: '',
    message: '',
  });
  const [needs, setNeeds] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: '' }));
    };

  const toggleNeed = (need: string) => {
    setNeeds((prev) => (prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]));
  };

  /** Folds the event fields into one enquiry body, so nothing is lost on the way to the inbox. */
  const composeMessage = (): string => {
    const lines = [
      form.eventName && `Event: ${form.eventName}`,
      form.eventType && `Type: ${form.eventType}`,
      form.eventDate && `Date: ${form.eventDate}`,
      form.attendees && `Expected attendees: ${form.attendees}`,
      needs.length > 0 && `Needs: ${needs.join(', ')}`,
      form.message && `\n${form.message}`,
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validated client-side too, so a mistake is caught before a round trip.
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = 'Please tell us your name.';
    if (!form.email.trim()) nextErrors.email = 'We need an email to reply to.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      nextErrors.email = 'That email address looks wrong.';
    if (!form.eventName.trim() && !form.message.trim())
      nextErrors.eventName = 'Add the event name, or tell us about it below.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrors({});

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.organisation,
          message: composeMessage(),
          services: ['Event Technology & Digital Solutions', ...needs],
        }),
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
      setFormError('Could not reach the server. Please try again, or message us on WhatsApp.');
      setStatus('error');
    }
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi Digital Dude — I'm planning an event and would like to discuss the website, registration and ticketing.",
  )}`;

  const primaryEmail = AGENCY_INFO.contact.emails[0];

  return (
    <section id="event-enquiry" className="scroll-mt-24 bg-ink pb-24 pt-20 lg:pb-32 lg:pt-28">
      <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-lime">
            Plan your event with us
          </span>
          <h2 className="mt-5 text-4xl font-bold leading-[1.04] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.5rem]">
            Planning an event?{' '}
            <span className="text-lime">Let&apos;s build the digital experience around it.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-[1.75] text-white/60">
            Tell us about the event — from the first landing-page visit to registration
            and event-day support, we will come back with what we would build and what
            it takes.
          </p>
        </motion.div>

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-12">
          {/* ---- Form ---- */}
          <div className="lg:col-span-7">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-h-[34rem] flex-col items-center justify-center rounded-3xl bg-[#f5f5f0] p-10 text-center"
                role="status"
              >
                <CheckCircle2 className="h-14 w-14 text-lime-shadow" />
                <h3 className="mt-6 text-2xl font-bold text-black">Enquiry received.</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-black/60">
                  Thanks {form.name.split(' ')[0] || 'for reaching out'} — we have the details
                  for {form.eventName || 'your event'} and will come back to you within one
                  working day.
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-bold text-lime transition-opacity hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Or message us now on WhatsApp
                </a>
              </motion.div>
            ) : (
              <div className="rounded-3xl bg-[#f5f5f0] p-7 sm:p-10">
                <h3 className="text-2xl font-bold tracking-[-0.02em] text-black sm:text-3xl">
                  TELL US ABOUT YOUR EVENT.
                </h3>
                <p className="mt-2 text-sm text-black/50">
                  Fields marked * are required. Everything else just helps us prepare.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ev-name" className={LABEL_CLASS}>
                        Your name *
                      </label>
                      <input
                        id="ev-name"
                        type="text"
                        required
                        autoComplete="name"
                        value={form.name}
                        onChange={update('name')}
                        placeholder="Your full name"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'ev-name-error' : undefined}
                        className={FIELD_CLASS}
                      />
                      {errors.name && (
                        <p id="ev-name-error" className="mt-1.5 text-xs text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="ev-organisation" className={LABEL_CLASS}>
                        Organisation
                      </label>
                      <input
                        id="ev-organisation"
                        type="text"
                        autoComplete="organization"
                        value={form.organisation}
                        onChange={update('organisation')}
                        placeholder="Company or event brand"
                        className={FIELD_CLASS}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ev-email" className={LABEL_CLASS}>
                        Email *
                      </label>
                      <input
                        id="ev-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={update('email')}
                        placeholder="you@organisation.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'ev-email-error' : undefined}
                        className={FIELD_CLASS}
                      />
                      {errors.email && (
                        <p id="ev-email-error" className="mt-1.5 text-xs text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="ev-phone" className={LABEL_CLASS}>
                        Phone / WhatsApp
                      </label>
                      <input
                        id="ev-phone"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={update('phone')}
                        placeholder="+91 90000 00000"
                        className={FIELD_CLASS}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ev-event-name" className={LABEL_CLASS}>
                        Event name *
                      </label>
                      <input
                        id="ev-event-name"
                        type="text"
                        value={form.eventName}
                        onChange={update('eventName')}
                        placeholder="e.g. Chennai Founders Summit 2027"
                        aria-invalid={Boolean(errors.eventName)}
                        aria-describedby={errors.eventName ? 'ev-event-name-error' : undefined}
                        className={FIELD_CLASS}
                      />
                      {errors.eventName && (
                        <p id="ev-event-name-error" className="mt-1.5 text-xs text-red-600">
                          {errors.eventName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="ev-type" className={LABEL_CLASS}>
                        Event type
                      </label>
                      <select
                        id="ev-type"
                        value={form.eventType}
                        onChange={update('eventType')}
                        className={`${FIELD_CLASS} appearance-none`}
                      >
                        <option value="">Select a type</option>
                        {EVENT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ev-date" className={LABEL_CLASS}>
                        Event date (or rough timing)
                      </label>
                      <input
                        id="ev-date"
                        type="text"
                        value={form.eventDate}
                        onChange={update('eventDate')}
                        placeholder="e.g. April 2027, or not fixed yet"
                        className={FIELD_CLASS}
                      />
                    </div>

                    <div>
                      <label htmlFor="ev-attendees" className={LABEL_CLASS}>
                        Expected attendees
                      </label>
                      <input
                        id="ev-attendees"
                        type="text"
                        inputMode="numeric"
                        value={form.attendees}
                        onChange={update('attendees')}
                        placeholder="e.g. 250"
                        className={FIELD_CLASS}
                      />
                    </div>
                  </div>

                  {/* Requirement checkboxes, carried through as the lead's service tags. */}
                  <fieldset>
                    <legend className={LABEL_CLASS}>What do you need?</legend>
                    <div className="flex flex-wrap gap-2">
                      {ENQUIRY_NEEDS.map((need) => {
                        const active = needs.includes(need);
                        return (
                          <button
                            key={need}
                            type="button"
                            onClick={() => toggleNeed(need)}
                            aria-pressed={active}
                            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-shadow/40 ${
                              active
                                ? 'border-black bg-black text-lime'
                                : 'border-black/10 bg-white text-black/70 hover:border-black/30'
                            }`}
                          >
                            {need}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="ev-message" className={LABEL_CLASS}>
                      Anything else we should know?
                    </label>
                    <textarea
                      id="ev-message"
                      rows={4}
                      value={form.message}
                      onChange={update('message')}
                      placeholder="The audience, how registration works today, what went wrong last time, or a deadline we should know about."
                      className={`${FIELD_CLASS} resize-y`}
                    />
                  </div>

                  {formError && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-700" role="alert">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 text-sm font-bold text-lime transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-shadow focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending your enquiry…
                      </>
                    ) : (
                      <>
                        Send event enquiry
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] leading-relaxed text-black/40">
                    We reply within one working day. Your details are used only to respond
                    to this enquiry.
                  </p>
                </form>
              </div>
            )}
          </div>

          {/* ---- Direct contact ---- */}
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-ink-soft p-7 lg:p-8">
              <h3 className="text-lg font-bold tracking-tight text-white">
                In a hurry? Talk to us now.
              </h3>
              <p className="mt-2.5 text-sm leading-[1.7] text-white/50">
                Event timelines do not wait. If your event is close, call or message —
                you will reach the team working on it, not a queue.
              </p>

              <div className="mt-7 space-y-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3.5 rounded-xl border border-lime/25 bg-lime/[0.07] px-5 py-4 transition-colors hover:bg-lime/[0.12] focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime/15">
                    <MessageCircle className="h-5 w-5 text-lime" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-white">WhatsApp us</span>
                    <span className="mt-0.5 block text-xs text-white/45">
                      Fastest reply during working hours
                    </span>
                  </span>
                </a>

                {AGENCY_INFO.contact.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                    className="group flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                      <PhoneCall className="h-5 w-5 text-white/55 transition-colors group-hover:text-lime" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-white">{phone}</span>
                      <span className="mt-0.5 block text-xs text-white/45">Call the team</span>
                    </span>
                  </a>
                ))}

                <a
                  href={`mailto:${primaryEmail}?subject=${encodeURIComponent(
                    'Event technology enquiry',
                  )}`}
                  className="group flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                    <Mail className="h-5 w-5 text-white/55 transition-colors group-hover:text-lime" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-white">
                      {primaryEmail}
                    </span>
                    <span className="mt-0.5 block text-xs text-white/45">Email the team</span>
                  </span>
                </a>
              </div>

              <p className="mt-7 flex items-center gap-2 border-t border-white/10 pt-6 text-xs text-white/40">
                <Clock className="h-3.5 w-3.5 shrink-0 text-lime/70" />
                {AGENCY_INFO.contact.hours}
              </p>
            </div>

            {/* What happens next — removes the uncertainty that stops people enquiring. */}
            <div className="rounded-3xl border border-white/10 bg-ink-soft p-7 lg:p-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-lime">
                What happens next
              </h3>
              <ol className="mt-5 space-y-4">
                {[
                  'We read the details and reply within one working day.',
                  'A short call to understand the event and the deadline.',
                  'A written scope and timeline — no obligation to proceed.',
                ].map((line, i) => (
                  <li key={line} className="flex gap-3.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime/12 text-[10px] font-bold text-lime">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-[1.65] text-white/60">{line}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
