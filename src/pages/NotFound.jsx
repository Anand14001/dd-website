import { Link } from "react-router-dom";
import { Container, Reveal, Button } from "../components/ui";
import Seo from "../components/Seo";
import { nav } from "../data/site";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found – Digital Dude" description="The page you were looking for does not exist." />

      <section className="relative grid min-h-[80vh] place-items-center overflow-hidden pt-[150px] pb-[75px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/3 size-[700px] -translate-x-1/2 rounded-full opacity-[0.14] blur-[130px]"
          style={{ background: "radial-gradient(circle, #eaff01 0%, transparent 65%)" }}
        />
        <Container className="relative text-center">
          <Reveal
            as="p"
            className="font-heading text-[110px] font-bold leading-none text-yellow md:text-[150px]"
          >
            404
          </Reveal>
          <Reveal as="h1" delay={70} className="mt-4 font-heading text-fluid-h3 font-bold">
            This page does not exist
          </Reveal>
          <Reveal
            as="p"
            delay={130}
            className="mx-auto mt-6 max-w-[48ch] text-[17px] leading-relaxed text-white/60"
          >
            The link may be broken, or the page may have moved. Try one of these instead.
          </Reveal>

          <Reveal delay={190} className="mt-10 flex flex-wrap justify-center gap-3">
            {nav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-full border border-white/20 px-5 py-2.5 font-heading text-[14px] font-bold text-white/70 transition-colors hover:border-yellow hover:text-yellow"
              >
                {item.label}
              </Link>
            ))}
          </Reveal>

          <Reveal delay={250} className="mt-10">
            <Button to="/">Back to home</Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
