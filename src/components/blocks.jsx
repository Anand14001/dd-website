
import { Link } from "react-router-dom";
import { Container, Reveal, Button, Arrow, SectionTitle, LayoutLines } from "./ui";
import { whyUs, testimonials, clients, philosophy, hero } from "../data/site";

export { default as Process } from "./Process";

/* ── Why us ──────────────────────────────────────────────────────────────
   Editorial split: stacked photography with an overlapping stat badge on
   one side, a numbered rule-separated list on the other. Deliberately not
   a card grid — the page already has several of those.
   ──────────────────────────────────────────────────────────────────────── */
export function WhyUs() {
  return (
    <section className="relative overflow-clip py-[70px] md:py-[110px]">
      <LayoutLines />

      <Container className="relative z-10">
        <div className="grid items-start gap-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
          {/* Media */}
          <Reveal variant="left" className="relative lg:sticky lg:top-[130px]">
            <div className="relative overflow-clip rounded-40">
              <img
                src="/about/team-meeting.jpeg"
                alt="The Digital Dude team at work"
                loading="lazy"
                width={1600}
                height={1067}
                className="aspect-[4/3] w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgba(28,29,44,0.65) 0%, transparent 55%)",
                }}
              />
            </div>

            {/* Stat badge */}
            <div className="absolute bottom-6 left-6 rounded-30 bg-yellow px-7 py-5 text-navy shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]">
              <p className="font-heading text-[38px] font-bold leading-none">
                {hero.stats[1].value}
              </p>
              <p className="mt-1.5 text-[13px] font-bold">{hero.stats[1].label}</p>
            </div>
          </Reveal>

          {/* Copy */}
          <div>
            <Reveal
              as="p"
              className="mb-5 font-heading text-[13px] font-bold uppercase tracking-[0.18em] text-yellow"
            >
              Why choose Digital Dude
            </Reveal>

            <Reveal as="h2" delay={60} className="font-heading text-fluid-h3 font-bold">
              {whyUs.title}
            </Reveal>

            <Reveal
              as="p"
              delay={110}
              className="mt-6 max-w-[56ch] text-[17px] leading-relaxed text-white/60"
            >
              {whyUs.body}
            </Reveal>

            <ul className="mt-12">
              {whyUs.items.map((item, i) => (
                <Reveal
                  as="li"
                  key={item.title}
                  delay={150 + i * 70}
                  className="group border-t border-white/12 py-6 last:border-b"
                >
                  <div className="flex gap-6 transition-transform duration-400 group-hover:translate-x-2">
                    <span className="mt-1 font-heading text-[13px] font-bold tabular-nums text-white/30 transition-colors group-hover:text-yellow">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-heading text-[20px] font-bold transition-colors group-hover:text-yellow md:text-[22px]">
                        {item.title}
                      </h3>
                      <p className="mt-2.5 max-w-[60ch] text-[16px] leading-relaxed text-white/60">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={420} className="mt-10">
              <Button to="/contact">Start a Project</Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Philosophy / Vision / Mission ───────────────────────────────────── */
export function Philosophy() {
  return (
    <section>
      <div className="my-[100px] w-full rounded-40 bg-cream py-[70px] text-navy lg:my-[160px] lg:rounded-80 lg:py-[110px]">
        <Container>
          <div className="max-w-[900px]">
            <Reveal
              as="p"
              className="mb-5 font-heading text-[13px] font-bold uppercase tracking-[0.18em] text-navy/45"
            >
              Who we are
            </Reveal>
            <Reveal as="h2" delay={60} className="font-heading text-fluid-h3 font-bold">
              {philosophy.title}
            </Reveal>
            <Reveal as="p" delay={120} className="mt-6 text-[17px] leading-relaxed text-navy/70 md:text-[19px]">
              {philosophy.body}
            </Reveal>
          </div>

          <div className="mt-[70px] grid gap-6 lg:grid-cols-3">
            {philosophy.items.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 80}
                className="rounded-20 border border-navy/10 bg-white p-8 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-28px_rgba(28,29,44,0.4)]"
              >
                <h3 className="font-heading text-fluid-h6 font-bold">{item.title}</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-navy/65">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}

/* ── Client logos ────────────────────────────────────────────────────── */
export function Clients() {
  return (
    <section className="py-[50px]">
      <Container>
        <Reveal
          as="p"
          className="mb-10 text-center font-heading text-[13px] font-bold uppercase tracking-[0.18em] text-white/40"
        >
          Transforming brands with proven strategies
        </Reveal>
        <Reveal
          delay={80}
          className="grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6"
        >
          {clients.map((c) => (
            <div key={c.name} className="flex items-center justify-center">
              <img
                src={c.logo}
                alt={c.name}
                loading="lazy"
                className="max-h-12 w-auto max-w-[140px] object-contain opacity-55 grayscale transition-all duration-400 hover:opacity-100 hover:grayscale-0"
              />
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

/* ── Testimonials ────────────────────────────────────────────────────── */
function Stars() {
  return (
    <div className="flex gap-1" aria-label="5 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="size-4 fill-yellow" aria-hidden="true">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-[50px] md:py-[75px]">
      <Container>
        <SectionTitle
          eyebrow="Testimonials"
          title={testimonials.title}
          body={testimonials.body}
          align="center"
        />
        <div className="mt-[70px] grid gap-6 md:grid-cols-2">
          {testimonials.items.map((r, i) => (
            <Reveal
              key={r.author}
              delay={(i % 2) * 80}
              className="flex flex-col justify-between rounded-20 border border-white/10 bg-navy-light p-8 transition-colors duration-300 hover:border-white/25 md:p-10"
            >
              <div>
                <Stars />
                <p className="mt-6 font-heading text-[19px] font-bold leading-snug md:text-[21px]">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-yellow font-heading text-[13px] font-bold text-navy">
                  {r.author.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <p className="font-heading text-[15px] font-bold">{r.author}</p>
                  <p className="text-[14px] text-white/50">{r.org}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── Closing CTA ─────────────────────────────────────────────────────── */
export function CtaBand() {
  return (
    <section>
      <div className="my-[100px] w-full overflow-clip rounded-40 bg-yellow px-8 py-[70px] text-navy lg:rounded-80 lg:py-[100px]">
        <Container>
          <div className="mx-auto max-w-[860px] text-center">
            <Reveal as="h2" className="font-heading text-fluid-h2 font-bold">
              Unlock Your Potential, Reach Out and Transform Your Business!
            </Reveal>
            <Reveal as="p" delay={80} className="mt-6 text-[18px] leading-relaxed text-navy/75">
              Let&rsquo;s collaborate to identify your needs and skyrocket your brand.
            </Reveal>
            <Reveal delay={150} className="mt-10 flex flex-wrap justify-center gap-4">
              <Button variant="dark" to="/contact">
                Start a Project
              </Button>
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2.5 rounded-full border border-navy/30 px-9 py-4 font-heading text-[16px] font-bold leading-none transition-colors hover:border-navy hover:bg-navy hover:text-yellow"
              >
                See our work
                <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
}
