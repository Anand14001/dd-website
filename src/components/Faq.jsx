import { useRef, useState } from "react";
import { Container, Reveal } from "./ui";

function Item({ q, a, open, onToggle, index }) {
  const bodyRef = useRef(null);

  return (
    <Reveal delay={index * 45} className="w-full border-b border-white/12">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-start justify-between gap-6 py-7 text-left font-heading text-fluid-h6 font-bold transition-colors hover:text-yellow"
        >
          <span>{q}</span>
          <span
            className={`mt-1 grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
              open ? "rotate-45 border-yellow bg-yellow text-navy" : "border-white/25"
            }`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 16 16" className="size-3.5">
              <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </h3>

      <div
        ref={bodyRef}
        style={{ height: open ? bodyRef.current?.scrollHeight ?? "auto" : 0 }}
        className="overflow-hidden transition-[height] duration-400 ease-[var(--ease-out-soft)]"
      >
        <p className="max-w-[80ch] pb-8 pr-14 text-[17px] leading-relaxed text-white/65">{a}</p>
      </div>
    </Reveal>
  );
}

export default function Faq({
  items,
  title = "Questions, answered",
  body = "Still stuck? Drop us a line and a real human will get back to you.",
}) {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-[50px] md:py-[75px]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal
              as="p"
              className="mb-5 font-heading text-[13px] font-bold uppercase tracking-[0.18em] text-yellow"
            >
              FAQs
            </Reveal>
            <Reveal as="h2" delay={60} className="font-heading text-fluid-h2 font-bold">
              {title}
            </Reveal>
            <Reveal as="p" delay={120} className="mt-6 text-[17px] leading-relaxed text-white/65">
              {body}
            </Reveal>
          </div>

          <div>
            {items.map((f, i) => (
              <Item
                key={f.q}
                index={i}
                q={f.q}
                a={f.a}
                open={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
