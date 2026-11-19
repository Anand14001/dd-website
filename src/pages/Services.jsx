import { Link } from "react-router-dom";
import { Container, Reveal, PageHero, Arrow } from "../components/ui";
import { Process, WhyUs, CtaBand } from "../components/blocks";
import Faq from "../components/Faq";
import Seo from "../components/Seo";
import { services, servicesIntro, extraServices } from "../data/services";
import { faqs } from "../data/site";

export default function Services() {
  return (
    <>
      <Seo
        title="Services – Digital Dude"
        description="SEO & SMM, website and app development, social media advertising, digital marketing, graphic design, video production, influencer marketing and automation."
      />

      <PageHero
        eyebrow="Services"
        title={servicesIntro.title}
        body={servicesIntro.body}
      />

      <section className="py-[50px]">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 2) * 70}>
                <Link
                  to={`/services/${s.slug}`}
                  className="group flex h-full flex-col justify-between rounded-20 border border-white/10 bg-navy-light p-8 transition-all duration-400 hover:-translate-y-1.5 hover:border-yellow/50 md:p-10"
                >
                  <div>
                    <div className="flex items-start justify-between gap-5">
                      <span className="font-heading text-[13px] font-bold text-white/35">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="grid size-10 place-items-center rounded-full border border-white/20 transition-colors group-hover:border-yellow group-hover:bg-yellow group-hover:text-navy">
                        <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                    <h2 className="mt-7 font-heading text-fluid-h5 font-bold transition-colors group-hover:text-yellow">
                      {s.name}
                    </h2>
                    <p className="mt-4 text-[16px] leading-relaxed text-white/60">{s.summary}</p>
                  </div>

                  <ul className="mt-8 flex flex-wrap gap-2">
                    {s.features.slice(0, 3).map((f) => (
                      <li
                        key={f.title}
                        className="rounded-full bg-white/8 px-3.5 py-1.5 text-[13px] text-white/60"
                      >
                        {f.title}
                      </li>
                    ))}
                  </ul>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {extraServices.map((s, i) => (
              <Reveal
                key={s.title}
                delay={i * 70}
                className="rounded-20 border border-dashed border-white/15 p-8 md:p-10"
              >
                <h2 className="font-heading text-fluid-h5 font-bold">{s.title}</h2>
                <p className="mt-4 text-[16px] leading-relaxed text-white/60">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Process />
      <WhyUs />
      <Faq items={faqs} />
      <CtaBand />
    </>
  );
}
