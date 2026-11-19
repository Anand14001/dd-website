import { Link, useParams, Navigate } from "react-router-dom";
import { Container, Reveal, PageHero, Button, Arrow } from "../components/ui";
import { Testimonials, CtaBand, WhyUs } from "../components/blocks";
import Seo from "../components/Seo";
import { services, getService } from "../data/services";

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getService(slug);

  if (!service) return <Navigate to="/404" replace />;

  const others = services.filter((s) => s.slug !== slug).slice(0, 4);

  return (
    <>
      <Seo
        title={`${service.name} – Digital Dude`}
        description={service.summary}
      />

      <PageHero eyebrow="Service" title={service.heading} body={service.summary}>
        <Button to="/contact">Start a Project</Button>
      </PageHero>

      <section className="py-[50px] md:py-[75px]">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
            {/* Main */}
            <div>
              <Reveal
                as="h2"
                className="font-heading text-[13px] font-bold uppercase tracking-[0.18em] text-yellow"
              >
                Overview
              </Reveal>
              <div className="mt-6 flex flex-col gap-5">
                {service.overview.map((p, i) => (
                  <Reveal
                    as="p"
                    key={i}
                    delay={i * 60}
                    className="text-[17px] leading-relaxed text-white/70 md:text-[19px]"
                  >
                    {p}
                  </Reveal>
                ))}
              </div>

              <Reveal as="h2" className="mt-14 font-heading text-fluid-h4 font-bold">
                {service.featuresTitle}
              </Reveal>

              <ul className="mt-8 flex flex-col">
                {service.features.map((f, i) => (
                  <Reveal
                    as="li"
                    key={f.title}
                    delay={i * 60}
                    className="group border-t border-white/12 py-7 last:border-b"
                  >
                    <div className="flex gap-5">
                      <span className="mt-1 font-heading text-[13px] font-bold text-white/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-heading text-fluid-h6 font-bold transition-colors group-hover:text-yellow">
                          {f.title}
                        </h3>
                        <p className="mt-3 text-[16px] leading-relaxed text-white/60">{f.body}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <Reveal className="rounded-20 border border-white/10 bg-navy-light p-8">
                <h2 className="font-heading text-fluid-h6 font-bold">Other services</h2>
                <ul className="mt-6 flex flex-col gap-1">
                  {others.map((s) => (
                    <li key={s.slug}>
                      <Link
                        to={`/services/${s.slug}`}
                        className="group flex items-center justify-between gap-4 rounded-[12px] px-4 py-3 transition-colors hover:bg-white/8"
                      >
                        <span className="font-heading text-[15px] font-bold transition-colors group-hover:text-yellow">
                          {s.name}
                        </span>
                        <Arrow className="shrink-0 text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-yellow" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/services"
                  className="mt-6 inline-flex items-center gap-2 font-heading text-[14px] font-bold text-white/55 transition-colors hover:text-yellow"
                >
                  All services
                  <Arrow />
                </Link>
              </Reveal>

              <Reveal delay={100} className="mt-6 rounded-20 bg-yellow p-8 text-navy">
                <h2 className="font-heading text-fluid-h6 font-bold">
                  Ready to start?
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-navy/75">
                  Tell us what you need and we will come back with a scoped, fixed quote.
                </p>
                <Button variant="dark" to="/contact" className="mt-6">
                  Contact us
                </Button>
              </Reveal>
            </aside>
          </div>
        </Container>
      </section>

      <WhyUs />
      <Testimonials />
      <CtaBand />
    </>
  );
}
