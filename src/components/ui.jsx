import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ── Container ───────────────────────────────────────────────────────── */
export function Container({ className = "", children }) {
  return (
    <div className={`mx-auto w-full max-w-[1800px] px-5 md:px-10 lg:px-[clamp(40px,3.5vw,90px)] ${className}`}>
      {children}
    </div>
  );
}

/* ── Scroll reveal ───────────────────────────────────────────────────────
   `variant` picks the entry direction, `delay` offsets it, and `stagger`
   cascades the element's own children instead of the wrapper.
   ──────────────────────────────────────────────────────────────────────── */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  variant = "up",
  once = true,
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // Already on screen at mount (e.g. above the fold) — show immediately.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal reveal-${variant} ${shown ? "is-visible" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ── Stagger ─────────────────────────────────────────────────────────────
   Wraps each child in its own Reveal with an incrementing delay, so grids
   and lists cascade in rather than appearing all at once.
   ──────────────────────────────────────────────────────────────────────── */
export function Stagger({
  as: Tag = "div",
  step = 70,
  start = 0,
  variant = "up",
  max = 6,
  className = "",
  childClassName = "",
  children,
  ...rest
}) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <Tag className={className} {...rest}>
      {items.filter(Boolean).map((child, i) => (
        <Reveal
          key={child?.key ?? i}
          variant={variant}
          delay={start + Math.min(i, max) * step}
          className={childClassName}
        >
          {child}
        </Reveal>
      ))}
    </Tag>
  );
}

/* ── Arrow glyph ─────────────────────────────────────────────────────── */
export function Arrow({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`size-4 ${className}`} aria-hidden="true">
      <path
        d="M5 12h13M12 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Layout guide lines ──────────────────────────────────────────────────
   The reference draws 4 vertical rules across a 1620px band centred on a
   1440px viewport, splitting it into 5 equal columns.
   ──────────────────────────────────────────────────────────────────────── */
export function LayoutLines({ light = false, fixed = false }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-y-0 left-[-6.25%] z-0 flex w-[112.5%]`}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`h-full flex-1 border-l first:border-l-0 ${
            light ? "border-navy/[0.07]" : "border-white/[0.045]"
          }`}
        />
      ))}
    </div>
  );
}

/* ── Floating team tag ───────────────────────────────────────────────── */
const tagTones = {
  yellow: "bg-yellow text-navy",
  lime: "bg-lime text-navy",
  cyan: "bg-cyan text-navy",
  silver: "bg-silver text-navy",
};

export function Tag({ tone = "yellow", className = "", style, children }) {
  return (
    <span
      style={style}
      className={`float-tag inline-flex items-center rounded-full px-3 py-1 font-heading text-[11px] font-bold leading-none ${tagTones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ── Buttons ─────────────────────────────────────────────────────────── */
const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-full font-heading font-bold " +
  "px-9 py-4 text-[16px] leading-none transition-all duration-300 " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-yellow";

const variants = {
  solid: "bg-yellow text-navy hover:brightness-95",
  outline: "border border-white/30 text-white hover:border-yellow hover:text-yellow",
  dark: "bg-navy text-white hover:bg-navy-lighter",
  darkOutline: "border border-navy/25 text-navy hover:border-navy hover:bg-navy hover:text-white",
};

export function Button({
  variant = "solid",
  to,
  href,
  className = "",
  arrow = false,
  children,
  ...rest
}) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />}
    </>
  );

  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={to || "/"} className={cls} {...rest}>
      {inner}
    </Link>
  );
}

/* ── Section heading ─────────────────────────────────────────────────── */
export function SectionTitle({
  eyebrow,
  title,
  body,
  align = "left",
  light = false,
  className = "",
}) {
  const alignCls =
    align === "center" ? "text-center mx-auto max-w-[820px]" : "max-w-[860px]";
  return (
    <div className={`${alignCls} ${className}`}>
      {eyebrow && (
        <Reveal
          as="p"
          className={`mb-5 font-heading text-[13px] font-bold uppercase tracking-[0.18em] ${
            light ? "text-navy/45" : "text-yellow"
          }`}
        >
          {eyebrow}
        </Reveal>
      )}
      <Reveal as="h2" delay={60} className="font-heading text-fluid-h2 font-bold">
        {title}
      </Reveal>
      {body && (
        <Reveal
          as="p"
          delay={120}
          className={`mt-6 text-[17px] leading-relaxed md:text-[19px] ${
            light ? "text-navy/70" : "text-white/65"
          }`}
        >
          {body}
        </Reveal>
      )}
    </div>
  );
}

/* ── Page hero (inner pages) ─────────────────────────────────────────── */
export function PageHero({ eyebrow, title, body, children }) {
  return (
    <section className="relative overflow-hidden pt-[150px] pb-[60px] md:pt-[200px] md:pb-[80px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 left-1/2 size-[800px] -translate-x-1/2 rounded-full opacity-[0.14] blur-[130px]"
        style={{ background: "radial-gradient(circle, #eaff01 0%, transparent 65%)" }}
      />
      <Container className="relative">
        {eyebrow && (
          <Reveal
            as="p"
            className="mb-5 font-heading text-[13px] font-bold uppercase tracking-[0.18em] text-yellow"
          >
            {eyebrow}
          </Reveal>
        )}
        <Reveal as="h1" delay={60} className="max-w-[20ch] font-heading text-fluid-h1 font-bold">
          {title}
        </Reveal>
        {body && (
          <Reveal
            as="p"
            delay={120}
            className="mt-7 max-w-[680px] text-[18px] leading-relaxed text-white/65 md:text-[20px]"
          >
            {body}
          </Reveal>
        )}
        {children && (
          <Reveal delay={190} className="mt-10">
            {children}
          </Reveal>
        )}
      </Container>
    </section>
  );
}
