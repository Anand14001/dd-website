import { useState } from "react";
import { Container, Reveal, LayoutLines } from "./ui";
import { process } from "../data/site";

/* Pill tabs joined by dotted connectors, with a large detail card below —
   matching the reference's process section. */

const STEP_MS = 2000;

export default function Process() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const step = process.steps[active];

  const next = () => setActive((v) => (v + 1) % process.steps.length);

  /* Pause while the pointer or keyboard focus is inside the carousel. */
  const holdProps = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: () => setPaused(false),
  };

  return (
    <section className="relative overflow-hidden py-[60px] md:py-[90px]">
      <LayoutLines />

      <Container className="relative z-10">
        <Reveal as="h2" className="text-center font-heading text-fluid-h2 font-bold">
          {process.title}
        </Reveal>
        <Reveal
          as="p"
          delay={80}
          className="mx-auto mt-6 max-w-[60ch] text-center text-[17px] leading-relaxed text-white/60 md:text-[18px]"
        >
          {process.body}
        </Reveal>

        {/* Tabs */}
        <Reveal
          {...holdProps}
          delay={140}
          className="mt-12 flex items-center justify-start gap-0 overflow-x-auto pb-3 md:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {process.steps.map((s, i) => (
            <div key={s.n} className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active}
                className={`relative shrink-0 overflow-hidden rounded-full px-6 py-3 font-heading text-[14px] font-bold transition-all duration-300 ${
                  i === active
                    ? "bg-yellow text-navy"
                    : "bg-navy-light text-white/75 hover:text-white"
                }`}
              >
                {s.short}

                {/* The bar finishing is what moves us to the next step, so the
                    countdown and the indicator stay in lockstep when paused. */}
                {i === active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[3px] bg-navy/15"
                  >
                    <span
                      key={active}
                      onAnimationEnd={next}
                      style={{
                        animationDuration: `${STEP_MS}ms`,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                      className="block h-full origin-left animate-[grow_2s_linear_forwards] bg-navy/50"
                    />
                  </span>
                )}
              </button>

              {i < process.steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="mx-2 shrink-0 text-[13px] tracking-[0.3em] text-white/25"
                >
                  ····
                </span>
              )}
            </div>
          ))}
        </Reveal>

        {/* Detail card: image on one side, substance on the other */}
        <Reveal {...holdProps} delay={190} className="mt-10 rounded-40 bg-navy-light p-3">
          <div
            key={active}
            className="grid animate-[fadeUp_0.5s_var(--ease-out-soft)] gap-0 lg:grid-cols-[0.82fr_1.18fr]"
          >
            {/* Image */}
            <div className="relative overflow-clip rounded-30">
              <img
                src={step.image}
                alt={step.alt}
                loading="lazy"
                className="h-full min-h-[260px] w-full object-cover md:min-h-[380px]"
              />
            </div>

            {/* Content */}
            <div className="px-2 py-8 md:px-10 md:py-10 lg:px-14 lg:py-12">
              <h3 className="max-w-[18ch] font-heading text-fluid-h4 font-bold">{step.title}</h3>
              <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-white/60">
                {step.body}
              </p>

              <ul className="mt-9 grid gap-4 sm:grid-cols-2">
                {step.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-yellow text-navy"
                    >
                      <svg viewBox="0 0 16 16" className="size-3" fill="none">
                        <path
                          d="M3 8.5l3.2 3.2L13 5"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-[15px] leading-snug text-white/75">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
