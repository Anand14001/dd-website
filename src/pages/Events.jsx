import { Link } from "react-router-dom";
import { Container, Reveal, Button, LayoutLines, Tag, Arrow } from "../components/ui";
import { CtaBand } from "../components/blocks";
import Seo from "../components/Seo";
import {
  eventsHero,
  nextEvent,
  whereWeFit,
  journey,
  eventServices,
  eventProjects,
  platform,
  eventProcess,
  eventWhy,
} from "../data/events";

function Check({ tone = "yellow" }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
        tone === "yellow" ? "bg-yellow text-navy" : "border border-white/25 text-white/50"
      }`}
    >
      <svg viewBox="0 0 16 16" className="size-3" fill="none">
        <path
          d={tone === "yellow" ? "M3 8.5l3.2 3.2L13 5" : "M4 4l8 8M12 4l-8 8"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function Events() {
  return (
    <>
      <Seo
        title="Event Technology & Digital Solutions – Digital Dude"
        description="Event websites, ticket booking, registration, attendee communication and post-event reporting. Digital Dude is the technology partner behind events across Tamil Nadu."
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[170px] pb-[60px] md:pt-[215px]">
        <LayoutLines />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
          <Tag tone="cyan" className="absolute left-[12%] top-[150px]">Registration</Tag>
          <Tag tone="yellow" className="absolute left-[80%] top-[190px]">Event sites</Tag>
          <Tag tone="lime" className="absolute left-[8%] top-[520px]">Ticketing</Tag>
          <Tag tone="silver" className="absolute left-[84%] top-[540px]">Reporting</Tag>
        </div>

        <Container className="relative z-20 text-center">
          <Reveal
            as="p"
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 px-4 py-2 font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-white/70"
          >
            <span className="size-2 rounded-full bg-yellow" />
            {eventsHero.eyebrow}
          </Reveal>

          <Reveal
            as="h1"
            delay={70}
            className="mx-auto max-w-[925px] font-heading text-fluid-h1 font-bold"
          >
            {eventsHero.title}
          </Reveal>

          <Reveal
            as="p"
            delay={130}
            className="mx-auto mt-9 max-w-[66ch] text-[18px] leading-relaxed text-white/60 md:text-[19px]"
          >
            {eventsHero.body}
          </Reveal>

          <Reveal delay={190} className="mt-11 flex flex-wrap justify-center gap-4">
            <Button to={eventsHero.ctaPrimary.to}>{eventsHero.ctaPrimary.label}</Button>
            <Button variant="outline" href="#event-work">
              {eventsHero.ctaSecondary.label}
            </Button>
          </Reveal>

          {/* Stats */}
          <Reveal
            delay={260}
            className="mx-auto mt-16 grid max-w-[900px] grid-cols-2 gap-px overflow-hidden rounded-20 border border-white/10 bg-white/10 sm:grid-cols-4"
          >
            {eventsHero.stats.map((s) => (
              <div key={s.label} className="bg-navy px-6 py-7">
                <p className="font-heading text-[34px] font-bold leading-none text-yellow">
                  {s.value}
                </p>
                <p className="mt-3 text-[14px] text-white/55">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* ── Next event ───────────────────────────────────────────────── */}
      <section>
        <Reveal className="mx-auto max-w-[1800px] rounded-40 bg-navy-light p-8 md:p-12">
          <p className="font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-yellow">
            {nextEvent.eyebrow}
          </p>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="font-heading text-fluid-h4 font-bold">{nextEvent.name}</h2>
              <p className="mt-3 text-[16px] text-white/60">
                {nextEvent.date} · {nextEvent.place}
              </p>
            </div>
            <p className="text-[15px] text-white/45">{nextEvent.note}</p>
          </div>
        </Reveal>
      </section>

      {/* ── Where we fit ─────────────────────────────────────────────── */}
      <section>
        <div className="relative my-[100px] w-full overflow-clip rounded-40 bg-cream py-[80px] text-navy lg:my-[140px] lg:rounded-80 lg:py-[110px]">
          <LayoutLines light />
          <div className="relative z-10 mx-auto w-full max-w-[1800px] px-5 md:px-10 lg:px-[clamp(40px,3.5vw,90px)]">
            <Reveal
              as="p"
              className="font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-navy/45"
            >
              {whereWeFit.eyebrow}
            </Reveal>
            <Reveal as="h2" delay={60} className="mt-5 max-w-[20ch] font-heading text-fluid-h2 font-bold">
              {whereWeFit.title}
            </Reveal>
            <Reveal as="p" delay={110} className="mt-7 max-w-[70ch] text-[17px] leading-relaxed text-navy/70 md:text-[18px]">
              {whereWeFit.body}
            </Reveal>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {[whereWeFit.handle, whereWeFit.leave].map((col, ci) => (
                <Reveal
                  key={col.title}
                  delay={ci * 80}
                  className={`rounded-30 p-8 ${ci === 0 ? "bg-navy text-white" : "bg-white"}`}
                >
                  <h3
                    className={`font-heading text-[12px] font-bold uppercase tracking-[0.14em] ${
                      ci === 0 ? "text-yellow" : "text-navy/45"
                    }`}
                  >
                    {col.title}
                  </h3>
                  <ul className="mt-6 flex flex-col gap-4">
                    {col.items.map((it) => (
                      <li key={it} className="flex gap-3.5">
                        {ci === 0 ? <Check /> : <Check tone="muted" />}
                        <span
                          className={`text-[16px] leading-snug ${
                            ci === 0 ? "text-white/85" : "text-navy/70"
                          }`}
                        >
                          {it}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}

              <Reveal delay={160} className="rounded-30 border border-navy/15 p-8">
                <h3 className="font-heading text-[12px] font-bold uppercase tracking-[0.14em] text-navy/45">
                  {whereWeFit.fit.title}
                </h3>
                <p className="mt-6 text-[16px] leading-relaxed text-navy/70">
                  {whereWeFit.fit.body}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Attendee journey ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-[60px] md:py-[90px]">
        <LayoutLines />
        <Container className="relative z-10">
          <Reveal
            as="p"
            className="text-center font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-yellow"
          >
            {journey.eyebrow}
          </Reveal>
          <Reveal as="h2" delay={60} className="mx-auto mt-5 max-w-[18ch] text-center font-heading text-fluid-h2 font-bold">
            {journey.title}
          </Reveal>
          <Reveal as="p" delay={110} className="mx-auto mt-6 max-w-[62ch] text-center text-[17px] leading-relaxed text-white/60">
            {journey.body}
          </Reveal>

          <div className="mt-[70px] grid gap-5 md:grid-cols-3 lg:grid-cols-5">
            {journey.steps.map((s, i) => (
              <Reveal
                key={s.title}
                variant="scale"
                delay={i * 70}
                className="flex flex-col rounded-30 bg-navy-light p-7 transition-transform duration-400 hover:-translate-y-1.5"
              >
                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.14em] ${
                    s.when === "Before"
                      ? "bg-yellow text-navy"
                      : s.when === "During"
                        ? "bg-cyan text-navy"
                        : "bg-lime text-navy"
                  }`}
                >
                  {s.when}
                </span>
                <h3 className="mt-6 font-heading text-[20px] font-bold">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/60">{s.body}</p>
                <span className="mt-6 font-heading text-[34px] font-bold leading-none text-white/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Event services ───────────────────────────────────────────── */}
      <section>
        <div className="relative my-[100px] w-full overflow-clip rounded-40 bg-cream py-[80px] text-navy lg:my-[140px] lg:rounded-80 lg:py-[120px]">
          <LayoutLines light />
          <div className="relative z-10 mx-auto w-full max-w-[1800px] px-5 md:px-10 lg:px-[clamp(40px,3.5vw,90px)]">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
              <div className="lg:sticky lg:top-[140px] lg:self-start">
                <Reveal
                  as="p"
                  className="font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-navy/45"
                >
                  {eventServices.eyebrow}
                </Reveal>
                <Reveal as="h2" delay={60} className="mt-5 max-w-[12ch] font-heading text-fluid-h2 font-bold">
                  {eventServices.title}
                </Reveal>
                <Reveal as="p" delay={110} className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-navy/70">
                  {eventServices.body}
                </Reveal>
                <Reveal delay={170} className="mt-10">
                  <Button to="/contact">Talk to our team</Button>
                </Reveal>
              </div>

              <div className="flex flex-col gap-12">
                {eventServices.items.map((s, i) => (
                  <Reveal key={s.title} delay={(i % 3) * 60}>
                    <div className="flex items-start gap-5">
                      <span className="mt-1 font-heading text-[13px] font-bold text-navy/35">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-heading text-[21px] font-bold md:text-[23px]">
                          {s.title}
                        </h3>
                        <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-navy/65">
                          {s.body}
                        </p>
                        <Link
                          to="/contact"
                          className="group mt-4 inline-flex items-center gap-2 font-heading text-[13px] font-bold uppercase tracking-[0.12em] text-navy/50 transition-colors hover:text-navy"
                        >
                          Enquire about this
                          <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Event projects ───────────────────────────────────────────── */}
      <section id="event-work" className="relative overflow-hidden py-[60px] md:py-[90px]">
        <LayoutLines />
        <Container className="relative z-10">
          <Reveal
            as="p"
            className="font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-yellow"
          >
            {eventProjects.eyebrow}
          </Reveal>
          <Reveal as="h2" delay={60} className="mt-5 max-w-[16ch] font-heading text-fluid-h2 font-bold">
            {eventProjects.title}
          </Reveal>
          <Reveal as="p" delay={110} className="mt-7 max-w-[72ch] text-[17px] leading-relaxed text-white/60">
            {eventProjects.body}
          </Reveal>

          <div className="mt-[70px] flex flex-col gap-6">
            {eventProjects.items.map((p, i) => (
              <Reveal
                key={p.name}
                variant="scale"
                delay={(i % 2) * 70}
                className="overflow-hidden rounded-40 bg-navy-light p-3 transition-transform duration-400 hover:-translate-y-1"
              >
                <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative overflow-hidden rounded-30 bg-navy">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="aspect-[16/10] h-full w-full object-cover"
                    />
                    <span
                      className={`absolute left-5 top-5 rounded-full px-3.5 py-1.5 font-heading text-[11px] font-bold uppercase tracking-[0.14em] ${
                        p.status === "Upcoming" ? "bg-cyan text-navy" : "bg-yellow text-navy"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="px-6 py-8 md:px-10 md:py-10">
                    <h3 className="font-heading text-fluid-h5 font-bold">{p.name}</h3>
                    <p className="mt-3 text-[15px] text-white/50">
                      {[p.date, p.place, p.client].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-5 max-w-[56ch] text-[16px] leading-relaxed text-white/65">
                      {p.body}
                    </p>

                    <p className="mt-7 font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
                      Our scope
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {p.scope.map((s) => (
                        <li
                          key={s}
                          className="rounded-full bg-white/8 px-3.5 py-1.5 text-[13px] text-white/70"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal as="p" delay={100} className="mt-10 max-w-[80ch] text-[14px] leading-relaxed text-white/35">
            {eventProjects.note}
          </Reveal>
        </Container>
      </section>

      {/* ── Platform ─────────────────────────────────────────────────── */}
      <section>
        <div className="relative my-[100px] w-full overflow-clip rounded-40 bg-cream py-[80px] text-navy lg:my-[140px] lg:rounded-80 lg:py-[110px]">
          <LayoutLines light />
          <div className="relative z-10 mx-auto w-full max-w-[1800px] px-5 md:px-10 lg:px-[clamp(40px,3.5vw,90px)]">
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
              <div>
                <Reveal
                  as="p"
                  className="font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-navy/45"
                >
                  {platform.eyebrow}
                </Reveal>
                <Reveal as="h2" delay={60} className="mt-5 max-w-[12ch] font-heading text-fluid-h2 font-bold">
                  {platform.title}
                </Reveal>
                <Reveal as="p" delay={110} className="mt-7 max-w-[48ch] text-[17px] leading-relaxed text-navy/70">
                  {platform.body}
                </Reveal>
                <Reveal delay={170} className="mt-9">
                  <Button
                    href={platform.cta.href}
                    target="_blank"
                    rel="noreferrer"
                    arrow
                  >
                    {platform.cta.label}
                  </Button>
                </Reveal>
              </div>

              <div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {platform.features.map((f, i) => (
                    <Reveal key={f.title} delay={i * 60} className="rounded-30 bg-white p-7">
                      <h3 className="font-heading text-[17px] font-bold">{f.title}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-navy/65">{f.body}</p>
                    </Reveal>
                  ))}
                </div>

                <Reveal delay={200} className="mt-8">
                  <p className="font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-navy/45">
                    Events running on it
                  </p>
                  <ul className="mt-4 flex flex-col gap-3">
                    {platform.running.map((r) => (
                      <li
                        key={r.name}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-navy/12 px-5 py-4"
                      >
                        <div>
                          <p className="font-heading text-[15px] font-bold">{r.name}</p>
                          <p className="text-[14px] text-navy/50">{r.url}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.14em] ${
                            r.status === "Upcoming" ? "bg-cyan text-navy" : "bg-navy text-yellow"
                          }`}
                        >
                          {r.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-[60px] md:py-[90px]">
        <LayoutLines />
        <Container className="relative z-10">
          <Reveal
            as="p"
            className="text-center font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-yellow"
          >
            {eventProcess.eyebrow}
          </Reveal>
          <Reveal as="h2" delay={60} className="mt-5 text-center font-heading text-fluid-h2 font-bold">
            {eventProcess.title}
          </Reveal>

          <div className="mt-[70px] grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {eventProcess.steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 70} className="rounded-30 bg-navy-light p-8">
                <span className="font-heading text-[40px] font-bold leading-none text-white/12">
                  {s.n.padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-heading text-[20px] font-bold">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/60">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Why us ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-[60px] md:py-[90px]">
        <LayoutLines />
        <Container className="relative z-10">
          <Reveal as="h2" className="mx-auto max-w-[20ch] text-center font-heading text-fluid-h3 font-bold">
            {eventWhy.title}
          </Reveal>

          <div className="mt-[70px] grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventWhy.items.map((w, i) => (
              <Reveal
                key={w.title}
                delay={(i % 3) * 70}
                className="rounded-30 border border-white/10 p-8 transition-colors duration-300 hover:border-yellow/40"
              >
                <h3 className="font-heading text-[19px] font-bold">{w.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-white/60">{w.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
