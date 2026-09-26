import React from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { AGENCY_INFO } from '../../data/agencyData';
import { dialable } from './utils';

/** Direct routes to the team, for anyone who would rather not fill in a form. */
export const ContactDetails: React.FC = () => {
  const { emails, phones, office, hours } = AGENCY_INFO.contact;

  return (
    <div className="rounded-3xl border border-white/10 bg-ink-soft p-7 sm:p-8">
      <h2 className="text-xl font-bold text-white">Rather talk directly?</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/50">
        Call or message us during working hours and you&apos;ll reach the team, not a queue.
      </p>

      <dl className="mt-8 space-y-7">
        <div>
          <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-lime">
            <Phone className="h-3.5 w-3.5" />
            Phone
          </dt>
          <dd className="mt-2.5 space-y-1">
            {phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${dialable(phone)}`}
                className="block text-sm text-white/70 transition-colors hover:text-lime"
              >
                {phone}
              </a>
            ))}
          </dd>
        </div>

        <div>
          <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-lime">
            <Mail className="h-3.5 w-3.5" />
            Email
          </dt>
          <dd className="mt-2.5 space-y-1">
            {emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="block break-all text-sm text-white/70 transition-colors hover:text-lime"
              >
                {email}
              </a>
            ))}
          </dd>
        </div>

        <div>
          <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-lime">
            <MapPin className="h-3.5 w-3.5" />
            Office
          </dt>
          <dd className="mt-2.5 text-sm leading-relaxed text-white/70">{office}</dd>
        </div>

        <div>
          <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-lime">
            <Clock className="h-3.5 w-3.5" />
            Hours
          </dt>
          <dd className="mt-2.5 text-sm leading-relaxed text-white/70">{hours}</dd>
        </div>
      </dl>
    </div>
  );
};
