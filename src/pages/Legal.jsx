import { useLocation, Navigate } from "react-router-dom";
import { Container, Reveal, PageHero } from "../components/ui";
import Seo from "../components/Seo";
import { getLegal } from "../data/legal";

export default function Legal() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/|\/$/g, "");
  const page = getLegal(slug);

  if (!page) return <Navigate to="/404" replace />;

  return (
    <>
      <Seo title={`${page.title} – Digital Dude`} description={`${page.title} for Digital Dude.`} />

      <PageHero eyebrow="Legal" title={page.title} />

      <section className="pb-[75px]">
        <Container>
          <div className="max-w-[78ch]">
            {page.blocks.map((b, i) => {
              if (b.k === "h") {
                return (
                  <Reveal
                    as="h2"
                    key={i}
                    className="mt-12 font-heading text-fluid-h6 font-bold first:mt-0"
                  >
                    {b.t}
                  </Reveal>
                );
              }
              if (b.k === "li") {
                return (
                  <Reveal
                    key={i}
                    className="mt-4 flex gap-4 text-[16px] leading-[1.75] text-white/65"
                  >
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-yellow" />
                    <span>{b.t}</span>
                  </Reveal>
                );
              }
              return (
                <Reveal
                  as="p"
                  key={i}
                  className="mt-5 text-[16px] leading-[1.75] text-white/65"
                >
                  {b.t}
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
