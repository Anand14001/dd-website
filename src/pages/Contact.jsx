import { useState } from "react";
import { Container, Reveal, PageHero, Arrow, LayoutLines } from "../components/ui";
import Social from "../components/Social";
import Seo from "../components/Seo";
import { brand } from "../data/site";

const field =
  "w-full rounded-[14px] border border-navy/15 bg-white px-5 py-4 text-[16px] text-navy " +
  "placeholder:text-navy/40 transition-colors focus:border-navy focus:outline-none";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block font-heading text-[13px] font-bold uppercase tracking-[0.12em] text-navy/55">
        {label}
      </span>
      {children}
    </label>
  );
}

function IconBox({ children }) {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-yellow text-navy">
      {children}
    </span>
  );
}

const icons = {
  phone: (
    <path
      d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  mail: (
    <path
      d="M3 7l9 6 9-6M3 7v10h18V7H3z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  pin: (
    <>
      <path
        d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

export default function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to your backend, Formspree, or email service.
    setSent(true);
  };

  return (
    <>
      <Seo
        title="Contact Us – Digital Dude"
        description="Get in touch with Digital Dude in Chennai. Call +91 97870 97006, email wedigitaldude@gmail.com, or send us a project enquiry."
      />

      <PageHero
        eyebrow="Contact"
        title="Explore How We Can Drive Your Success"
        body="Unlock your business potential with Digital Dude's expert solutions. Let's collaborate to identify your needs and skyrocket your brand."
      />

      {/* ── Contact details ──────────────────────────────────────────── */}
      <section className="relative overflow-clip pb-[50px]">
        <LayoutLines />
        <Container className="relative z-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal className="rounded-20 border border-white/10 bg-navy-light p-7">
              <IconBox>
                <Icon name="phone" />
              </IconBox>
              <h2 className="mt-5 font-heading text-[16px] font-bold">Call us</h2>
              <div className="mt-3 flex flex-col gap-1.5">
                {brand.phones.map((p) => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="text-[15px] text-white/65 transition-colors hover:text-yellow"
                  >
                    {p}
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={70} className="rounded-20 border border-white/10 bg-navy-light p-7">
              <IconBox>
                <Icon name="mail" />
              </IconBox>
              <h2 className="mt-5 font-heading text-[16px] font-bold">Mail us</h2>
              <div className="mt-3 flex flex-col gap-1.5">
                {brand.emails.map((e) => (
                  <a
                    key={e}
                    href={`mailto:${e}`}
                    className="break-all text-[15px] text-white/65 transition-colors hover:text-yellow"
                  >
                    {e}
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={140} className="rounded-20 border border-white/10 bg-navy-light p-7">
              <IconBox>
                <Icon name="pin" />
              </IconBox>
              <h2 className="mt-5 font-heading text-[16px] font-bold">Visit us</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/65">{brand.address}</p>
            </Reveal>

            <Reveal delay={210} className="rounded-20 border border-white/10 bg-navy-light p-7">
              <IconBox>
                <Icon name="clock" />
              </IconBox>
              <h2 className="mt-5 font-heading text-[16px] font-bold">Working hours</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/65">{brand.hours}</p>
            </Reveal>
          </div>

          <Reveal delay={120} className="mt-10 flex flex-wrap items-center gap-6">
            <p className="font-heading text-[13px] font-bold uppercase tracking-[0.14em] text-white/40">
              Follow us
            </p>
            <Social />
          </Reveal>
        </Container>
      </section>

      {/* ── Form ─────────────────────────────────────────────────────── */}
      <section className="pb-[50px]">
        <div className="w-full overflow-clip rounded-40 bg-cream py-[70px] text-navy lg:rounded-80 lg:py-[100px]">
          <Container>
            <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
              <div className="lg:sticky lg:top-[140px] lg:self-start">
                <Reveal as="h2" variant="left" className="font-heading text-fluid-h2 font-bold">
                  Let&rsquo;s work together
                </Reveal>
                <Reveal
                  as="p"
                  delay={80}
                  className="mt-6 text-[17px] leading-relaxed text-navy/70 md:text-[19px]"
                >
                  Tell us about your project and we will get back to you during office hours.
                </Reveal>

                <Reveal delay={140} className="mt-10 rounded-20 border border-navy/15 bg-white p-7">
                  <p className="font-heading text-[15px] font-bold">Prefer to call or message?</p>
                  <div className="mt-4 flex flex-col gap-2.5">
                    {brand.phones.map((p) => (
                      <a
                        key={p}
                        href={`tel:${p.replace(/\s/g, "")}`}
                        className="font-heading text-[17px] font-bold transition-colors hover:text-navy/60"
                      >
                        {p}
                      </a>
                    ))}
                    {brand.emails.map((e) => (
                      <a
                        key={e}
                        href={`mailto:${e}`}
                        className="break-all text-[15px] text-navy/65 transition-colors hover:text-navy"
                      >
                        {e}
                      </a>
                    ))}
                  </div>
                  <Social tone="light" className="mt-6" />
                </Reveal>
              </div>

              <Reveal delay={120} variant="right">
                {sent ? (
                  <div className="grid min-h-[420px] place-items-center rounded-20 border border-navy/15 bg-white p-10 text-center">
                    <div>
                      <span className="mx-auto mb-6 grid size-14 place-items-center rounded-full bg-yellow">
                        <svg
                          viewBox="0 0 24 24"
                          className="size-6 text-navy"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M4 12.5l5 5L20 6.5"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <h3 className="font-heading text-fluid-h5 font-bold">
                        Thanks — message sent
                      </h3>
                      <p className="mt-3 text-[16px] text-navy/65">
                        We will get back to you during office hours.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Fields mirror the live digital-dude.com contact form. */
                  <form onSubmit={onSubmit} className="grid gap-5">
                    <Field label="Your name">
                      <input required name="name" className={field} placeholder="Your Name" />
                    </Field>

                    <Field label="Your email">
                      <input
                        required
                        type="email"
                        name="email"
                        className={field}
                        placeholder="Your Email"
                      />
                    </Field>

                    <Field label="Subject">
                      <input required name="subject" className={field} placeholder="Subject" />
                    </Field>

                    <Field label="Message">
                      <textarea
                        required
                        rows={6}
                        name="message"
                        className={`${field} resize-none`}
                        placeholder="Message"
                      />
                    </Field>

                    <div>
                      <button
                        type="submit"
                        className="group inline-flex items-center gap-2.5 rounded-full bg-navy px-9 py-4 font-heading text-[16px] font-bold text-white transition-colors hover:bg-navy-lighter"
                      >
                        Send Message
                        <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </form>
                )}
              </Reveal>
            </div>
          </Container>
        </div>
      </section>

      {/* ── Map ──────────────────────────────────────────────────────── */}
      <section className="pb-[75px]">
        <Container>
          <Reveal variant="scale" className="overflow-clip rounded-40 bg-navy-light p-3">
            <iframe
              title={`${brand.name} office location`}
              src={brand.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[320px] w-full rounded-30 border-0 md:h-[420px]"
            />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
