import { Container, Reveal, PageHero, Button } from "../components/ui";
import { Philosophy, WhyUs, Process, Testimonials, Clients, CtaBand } from "../components/blocks";
import Seo from "../components/Seo";
import { brand, hero } from "../data/site";

export default function About() {
  return (
    <>
      <Seo
        title="About Us – Digital Dude"
        description="Digital Dude empowers businesses to grow with the right blend of technology and marketing. Learn about our philosophy, vision and mission."
      />

      <PageHero
        eyebrow="About us"
        title="Who are we?"
        body="At Digital Dude, we empower businesses to grow with the right blend of technology and marketing."
      >
        <Button to="/contact">Work with us</Button>
      </PageHero>

      <section className="py-[50px]">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="font-heading text-fluid-h5 font-bold leading-snug">
                We craft tailored digital solutions that enhance visibility, attract the right
                audience, and drive measurable sales.
              </p>
              <p className="mt-6 text-[17px] leading-relaxed text-white/65">
                Our mission is simple — to transform businesses with smart strategies and unlock
                their true growth potential.
              </p>
              <p className="mt-6 text-[17px] leading-relaxed text-white/65">
                Digital Dude is a brand under our parent company{" "}
                <span className="text-white">{brand.parent}</span>, operating out of Chennai and
                working with clients across India and beyond.
              </p>
            </Reveal>

            <Reveal
              delay={120}
              className="grid grid-cols-1 gap-px overflow-hidden rounded-20 border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-1"
            >
              {hero.stats.map((s) => (
                <div key={s.label} className="bg-navy px-8 py-8">
                  <p className="font-heading text-[44px] font-bold leading-none text-yellow">
                    {s.value}
                  </p>
                  <p className="mt-3 text-[15px] text-white/55">{s.label}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </Container>
      </section>

      <Philosophy />
      <WhyUs />
      <Process />
      <Clients />
      <Testimonials />
      <CtaBand />
    </>
  );
}
