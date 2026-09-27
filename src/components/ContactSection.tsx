import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { AGENCY_INFO } from '../data/agencyData';
import { ContactFormData } from '../types';

interface ContactSectionProps {
  initialService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialService }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: initialService ? `Inquiry about ${initialService}` : '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Sync external prefilled prop
  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, subject: `Inquiry about ${initialService}` }));
    }
  }, [initialService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate reliable submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 750);
  };

  const timeSlots = [
    'Tomorrow, 10:00 AM IST',
    'Tomorrow, 2:30 PM IST',
    'Thursday, 11:15 AM IST',
    'Thursday, 3:00 PM IST',
    'Friday, 9:00 AM IST',
  ];

  return (
    <section id="contact" className="py-24 lg:py-32 bg-ink relative border-t border-white/10">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <div className="max-w-3xl 2xl:max-w-4xl mx-auto text-center space-y-5 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime/10 border border-lime/20 text-xs font-semibold text-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05]">
            Explore How We Can Drive Your Success
          </h2>

          <p className="text-white/60 text-sm sm:text-base leading-[1.7]">
            Unlock your business potential with Digital Dude&apos;s expert solutions. Let&apos;s
            collaborate to identify your needs and skyrocket your brand.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form or Success */}
          <div className="lg:col-span-7 bg-ink-soft border border-white/10 rounded-2xl p-6 sm:p-9 shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-lime/10 border border-lime/30 text-lime flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                  <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{formData.name}</strong>. We&apos;ve
                    received your message and will get back to you shortly.
                  </p>
                </div>

                {/* Instant Calendar Booking Option */}
                <div className="p-5 rounded-xl bg-ink border border-white/10 text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-lime" />
                      Skip the queue &bull; Book 20-Min Strategy Call
                    </span>
                    <span className="text-[10px] text-lime font-semibold bg-lime/10 px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  </div>

                  <p className="text-xs text-white/50">
                    Lock in an instant slot with our technical marketing architects right now:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
                          selectedSlot === slot
                            ? 'bg-lime text-ink border-lime'
                            : 'bg-white/[0.02] text-white/70 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  {selectedSlot && (
                    <div className="p-3 rounded-lg bg-lime/10 border border-lime/30 text-xs text-lime flex items-center justify-between">
                      <span>Call booked for: {selectedSlot}</span>
                      <span className="font-semibold">Calendar invite sent!</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSelectedSlot(null);
                  }}
                  className="text-xs text-white/50 hover:text-white/80 underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-lg font-bold text-white">Send Us A Message</h3>
                  <span className="text-xs text-white/50 font-medium">No obligation</span>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-semibold text-white/70">
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-ink border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime focus:ring-1 focus:ring-lime"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-semibold text-white/70">
                      Your Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-ink border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime focus:ring-1 focus:ring-lime"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="text-xs font-semibold text-white/70">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="What can we help you with?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ink border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime focus:ring-1 focus:ring-lime"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-semibold text-white/70">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Tell us about your business and what you're looking to achieve..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ink border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime focus:ring-1 focus:ring-lime"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-ink bg-lime hover:bg-lime-dim transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Direct Agency Contact & Credibility */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Card */}
            <div className="rounded-2xl bg-ink-soft border border-white/10 p-7 space-y-6 shadow-xl">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-lime">
                  Direct Agency Contact
                </span>
                <h3 className="text-xl font-bold text-white">Talk With A Growth Strategist</h3>
                <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
                  Prefer direct communication? Reach out directly to our leadership team.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-3 rounded-xl bg-ink border border-white/10 space-y-2">
                  <span className="text-[11px] text-white/50 block font-medium">Email Us</span>
                  {AGENCY_INFO.contact.emails.map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="flex items-center gap-2.5 text-sm font-semibold text-white hover:text-lime transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-lime shrink-0" />
                      <span>{email}</span>
                    </a>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-ink border border-white/10 space-y-2">
                  <span className="text-[11px] text-white/50 block font-medium">Call Us</span>
                  {AGENCY_INFO.contact.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center gap-2.5 text-sm font-semibold text-white hover:text-lime transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-lime shrink-0" />
                      <span>{phone}</span>
                    </a>
                  ))}
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-ink border border-white/10">
                  <div className="w-9 h-9 rounded-lg bg-lime/10 text-lime flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-white/50 block font-medium">Headquarters</span>
                    <span className="text-sm font-semibold text-white">
                      {AGENCY_INFO.contact.office}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-ink border border-white/10">
                  <div className="w-9 h-9 rounded-lg bg-lime/10 text-lime flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-white/50 block font-medium">Office Hours</span>
                    <span className="text-xs font-semibold text-white block">
                      {AGENCY_INFO.contact.hours}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
