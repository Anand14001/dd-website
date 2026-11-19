import { Link } from "react-router-dom";
import {
  Container,
  Reveal,
  Button,
  Arrow,
  LayoutLines,
  Tag,
} from "../components/ui";
import { Testimonials, CtaBand, WhyUs } from "../components/blocks";
import { useParallax } from "../lib/smooth";
import Process from "../components/Process";
import Faq from "../components/Faq";
import Seo from "../components/Seo";
import { hero, faqs, clients, philosophy } from "../data/site";
import { services, servicesIntro } from "../data/services";
import { projects } from "../data/work";

/* Small coloured icon tile used beside each service name, matching the
   reference's brand-coloured app icons. */
const tileColors = [
  "#2a4b9b",
  "#1f6f4a",
  "#7b3fb5",
  "#b5542a",
  "#2a7fb5",
  "#8a2a5c",
  "#4a4a8a",
  "#2a8a6a",
];

function ServiceIcon({ i }) {
  return (
    <span
      className="grid size-12 shrink-0 place-items-center rounded-[14px] font-heading text-[15px] font-bold text-white"
      style={{ backgroundColor: tileColors[i % tileColors.length] }}
      aria-hidden="true"
    >
      {String(i + 1).padStart(2, "0")}
    </span>
  );
}

export default function Home() {
  const glowRef = useParallax(0.3);
  const showcaseRef = useParallax(-0.07);

  return (
    <>
      <Seo
        title="Digital Dude – Your Digital Partner"
        description="Digital Dude is a Chennai-based digital agency offering SEO, social media marketing, website and app development, graphic design, video production and automation."
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[170px] pb-[60px] md:pt-[215px]">
        <LayoutLines />

        {/* Floating team tags */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
          <Tag tone="cyan" className="absolute left-[21%] top-[115px]" style={{ animationDelay: "0s" }}>
            Ads Team
          </Tag>
          <Tag tone="yellow" className="absolute left-[72%] top-[150px]" style={{ animationDelay: "1.2s" }}>
            Design Team
          </Tag>
          <Tag tone="lime" className="absolute left-[8%] top-[600px]" style={{ animationDelay: "2.1s" }}>
            SEO Team
          </Tag>
          <Tag tone="silver" className="absolute left-[85%] top-[595px]" style={{ animationDelay: "0.6s" }}>
            Developers
          </Tag>
        </div>

        <Container className="relative z-20 text-center">
          <Reveal
            as="h1"
            className="mx-auto max-w-[1150px] text-balance font-heading text-fluid-h1 font-bold"
          >
            <span className="grad-word">{hero.title.split(" ")[0]}</span>{" "}
            {hero.title.split(" ").slice(1).join(" ")}
          </Reveal>

          <Reveal
            as="p"
            delay={100}
            className="mx-auto mt-10 max-w-[64ch] text-[18px] leading-relaxed text-white/60 md:text-[19px]"
          >
            {hero.body}
          </Reveal>

          <Reveal delay={180} className="mt-12">
            <Button to="/contact">Start a Project</Button>
          </Reveal>
        </Container>
      </section>

      {/* ── Showcase card ────────────────────────────────────────────── */}
      <section className="relative px-5 pb-[60px] md:px-10">
        <Container className="relative z-10 !px-0">
          <Reveal variant="scale" className="rounded-40 bg-navy-light p-3 md:p-4 lg:rounded-80 lg:p-5">
            <div ref={showcaseRef} className="will-change-transform">
            <div
              className="relative overflow-hidden rounded-30 lg:rounded-[60px]"
              style={{ backgroundColor: projects[0].color }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 70% 15%, rgba(234,255,1,0.14) 0%, transparent 55%)",
                }}
              />
              {/* Browser mock holding the featured project */}
              <div className="relative px-5 py-10 md:px-16 md:py-16">
                <div className="mx-auto max-w-[940px] overflow-hidden rounded-[16px] bg-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.6)]">
                  <div className="flex items-center gap-2 border-b border-navy/10 bg-navy/[0.035] px-5 py-3.5">
                    <span className="size-2.5 rounded-full bg-navy/15" />
                    <span className="size-2.5 rounded-full bg-navy/15" />
                    <span className="size-2.5 rounded-full bg-navy/15" />
                    <span className="ml-4 hidden h-6 flex-1 rounded-full bg-navy/[0.06] sm:block" />
                  </div>
                  <img
                    src={projects[0].image}
                    alt={projects[0].name}
                    className="aspect-[16/9] w-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Client logo strip ────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-[50px]">
        <div className="flex">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              aria-hidden={dup === 1}
              className="flex shrink-0 animate-[marquee_40s_linear_infinite] items-center gap-20 pr-20"
            >
              {clients.map((c) => (
                <img
                  key={c.name}
                  src={c.logo}
                  alt={c.name}
                  className="h-10 w-auto max-w-[150px] shrink-0 object-contain opacity-45 grayscale"
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Services (cream panel, two columns) ──────────────────────── */}
      <section id="services">
        <div className="relative mt-[60px] mb-[100px] w-full overflow-clip rounded-40 bg-cream py-[80px] text-navy md:mb-[160px] lg:rounded-80 lg:py-[130px]">
          <LayoutLines light />

          <div className="relative z-10 mx-auto w-full max-w-[1800px] px-5 md:px-10 lg:px-[clamp(40px,3.5vw,90px)]">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
              {/* Sticky left column */}
              <div className="lg:sticky lg:top-[140px] lg:self-start">
                <Reveal as="h2" variant="left" className="max-w-[12ch] font-heading text-fluid-h2 font-bold">
                  {servicesIntro.title}
                </Reveal>
                <Reveal
                  as="p"
                  delay={80}
                  className="mt-8 max-w-[44ch] text-[17px] leading-relaxed text-navy/70 md:text-[18px]"
                >
                  {servicesIntro.body}
                </Reveal>
                <Reveal delay={150} className="mt-10">
                  <Button to="/contact">Start a Project</Button>
                </Reveal>
              </div>

              {/* Service list */}
              <div className="flex flex-col gap-14">
                {services.map((s, i) => (
                  <Reveal key={s.slug} variant="right" delay={(i % 3) * 60}>
                    <Link to={`/services/${s.slug}`} className="group block">
                      <div className="flex items-center gap-5">
                        <ServiceIcon i={i} />
                        <h3 className="font-heading text-[22px] font-bold transition-colors group-hover:text-navy/60 md:text-[25px]">
                          {s.name}
                        </h3>
                      </div>
                      <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-navy/65 md:text-[17px]">
                        {s.summary}
                      </p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured work ────────────────────────────────────────────── */}
      <section className="relative my-[100px] overflow-hidden lg:my-[160px]">
        <LayoutLines />
        <Container className="relative z-10">
          <Reveal
            as="h2"
            className="mx-auto mb-[80px] max-w-[16ch] text-center font-heading text-fluid-h2 font-bold"
          >
            New &amp; featured work
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.name} variant="scale" delay={(i % 2) * 80}>
                <Link
                  to="/portfolio"
                  className="group block overflow-hidden rounded-40 bg-navy-light p-3 transition-all duration-400 hover:-translate-y-1.5"
                >
                  <div
                    className="relative overflow-hidden rounded-30"
                    style={{ backgroundColor: p.color }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="px-6 pb-6 pt-7">
                    <span className="font-heading text-[12px] font-bold uppercase tracking-[0.14em] text-yellow">
                      {p.tag}
                    </span>
                    <h3 className="mt-3 font-heading text-[23px] font-bold">{p.name}</h3>
                    <p className="mt-2 max-w-[46ch] text-[16px] leading-relaxed text-white/60">
                      {p.blurb}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="mt-14 text-center">
            <Button variant="outline" to="/portfolio" arrow>
              See all work
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* ── Agency panel: tabs + stats ───────────────────────────────── */}
      <section>
        <div className="relative my-[100px] w-full overflow-clip rounded-40 bg-cream py-[80px] text-navy lg:my-[160px] lg:rounded-80 lg:py-[120px]">
          <LayoutLines light />
          <div className="relative z-10 mx-auto w-full max-w-[1800px] px-5 md:px-10 lg:px-[clamp(40px,3.5vw,90px)]">
            <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
              {/* Left cards */}
              <div className="flex flex-col gap-5">
                {philosophy.items.map((item, i) => (
                  <Reveal
                    key={item.title}
                    delay={i * 70}
                    className="rounded-30 bg-white p-8 shadow-[0_18px_50px_-30px_rgba(28,29,44,0.5)]"
                  >
                    <h3 className="font-heading text-[21px] font-bold">{item.title}</h3>
                    <p className="mt-4 text-[16px] leading-relaxed text-navy/65">{item.body}</p>
                  </Reveal>
                ))}
              </div>

              {/* Right feature */}
              <div className="lg:sticky lg:top-[140px] lg:self-start">
                <Reveal as="h2" className="font-heading text-fluid-h2 font-bold">
                  Rooted in Chennai,{" "}
                  <span className="relative inline-block">
                    working worldwide
                    <svg
                      viewBox="0 0 300 12"
                      className="absolute -bottom-1 left-0 w-full"
                      aria-hidden="true"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="swoosh" x1="0" x2="1">
                          <stop offset="0%" stopColor="#d3e601" />
                          <stop offset="100%" stopColor="#51dbea" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M2 9C60 3 240 2 298 7"
                        stroke="url(#swoosh)"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </Reveal>

                <Reveal
                  as="p"
                  delay={90}
                  className="mt-9 max-w-[62ch] text-[17px] leading-relaxed text-navy/70 md:text-[18px]"
                >
                  {philosophy.body} From local startups to global brands, we deliver work that moves
                  the needle — with precision, agility and a focus on what matters most: your
                  success.
                </Reveal>

                <Reveal delay={150} className="mt-12 grid grid-cols-3 gap-6">
                  {hero.stats.map((s) => (
                    <div key={s.label}>
                      <p className="font-heading text-[46px] font-bold leading-none md:text-[58px]">
                        {s.value}
                      </p>
                      <p className="mt-3 text-[15px] text-navy/60">{s.label}</p>
                    </div>
                  ))}
                </Reveal>

                <Reveal delay={210} className="mt-12">
                  <Button to="/contact">Start a Project</Button>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Process />

      <WhyUs />

      <Testimonials />
      <Faq items={faqs} />
      <CtaBand />
    </>
  );
}
