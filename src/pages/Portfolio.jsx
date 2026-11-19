import { Container, Reveal, PageHero, Button, LayoutLines } from "../components/ui";
import { WhyUs, Testimonials, CtaBand } from "../components/blocks";
import Seo from "../components/Seo";
import { projects, logoWorks, portfolioIntro } from "../data/work";

export default function Portfolio() {
  return (
    <>
      <Seo
        title="Portfolio – Digital Dude"
        description="Websites, online stores and brand identity work delivered by Digital Dude — including Tiny Little Toes, Razzus Automotive, LetsPropStore, Electronics Avenue and more."
      />

      <PageHero eyebrow="Portfolio" title={portfolioIntro.title} body={portfolioIntro.body}>
        <Button to="/contact">Start your project</Button>
      </PageHero>

      {/* ── Website & app work ───────────────────────────────────────── */}
      <section className="relative overflow-hidden py-[50px] md:py-[75px]">
        <LayoutLines />
        <Container className="relative z-10">
          <Reveal
            as="h2"
            className="font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-yellow"
          >
            Websites &amp; applications
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal
                key={p.name}
                variant="scale"
                delay={(i % 2) * 70}
                className="group overflow-hidden rounded-40 bg-navy-light p-3 transition-all duration-400 hover:-translate-y-1.5"
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
                  <span className="absolute right-5 top-5 rounded-full border border-white/25 bg-navy/60 px-3.5 py-1.5 font-heading text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur-sm">
                    {p.tag}
                  </span>
                </div>
                <div className="px-6 pb-6 pt-7">
                  <h3 className="font-heading text-[23px] font-bold">{p.name}</h3>
                  <p className="mt-2 max-w-[48ch] text-[16px] leading-relaxed text-white/60">
                    {p.blurb}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Logo work ────────────────────────────────────────────────── */}
      <section>
        <div className="relative my-[100px] w-full overflow-clip rounded-40 bg-cream py-[80px] text-navy lg:my-[140px] lg:rounded-80 lg:py-[110px]">
          <LayoutLines light />
          <div className="relative z-10 mx-auto w-full max-w-[1800px] px-5 md:px-10 lg:px-[clamp(40px,3.5vw,90px)]">
            <Reveal
              as="p"
              className="font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-navy/45"
            >
              Logo works
            </Reveal>
            <Reveal as="h2" delay={60} className="mt-5 max-w-[16ch] font-heading text-fluid-h2 font-bold">
              Brand identities we have shaped
            </Reveal>
            <Reveal as="p" delay={110} className="mt-7 max-w-[60ch] text-[17px] leading-relaxed text-navy/70">
              Logos and visual identities designed for startups, stores and service businesses
              across India.
            </Reveal>

            <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {logoWorks.map((l, i) => (
                <Reveal
                  key={l.name}
                  variant="scale"
                  delay={(i % 5) * 60}
                  className="group flex aspect-square flex-col items-center justify-center gap-4 rounded-30 bg-white p-6 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-28px_rgba(28,29,44,0.45)]"
                >
                  <img
                    src={l.logo}
                    alt={l.name}
                    loading="lazy"
                    className="max-h-[72px] w-auto max-w-[80%] object-contain"
                  />
                  <p className="text-center font-heading text-[12px] font-bold leading-tight text-navy/55">
                    {l.name}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WhyUs />
      <Testimonials />
      <CtaBand />
    </>
  );
}
