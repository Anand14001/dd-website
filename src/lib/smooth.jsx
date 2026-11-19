import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";

/* ─────────────────────────────────────────────────────────────────────────
   Lenis smooth scrolling.

   One instance lives at the app root. Everything that needs to read scroll
   position (progress bar, parallax) subscribes to Lenis' own scroll event
   rather than adding its own listener, so there is a single source of truth
   and a single rAF loop.

   Honours prefers-reduced-motion: when set, Lenis never starts and the
   browser's native scrolling is left alone.
   ──────────────────────────────────────────────────────────────────────── */

const LenisContext = createContext(null);

export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;

    const instance = new Lenis({
      duration: 1.05,
      // expo-out: quick to respond, settles softly
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    let frame;
    const raf = (time) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    setLenis(instance);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  /* In-page anchors (#contact, #event-work) must go through Lenis,
     otherwise the native jump fights the smooth scroller. */
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -100 });
      else target.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/* ── Scroll progress bar ─────────────────────────────────────────────── */
export function ScrollProgress() {
  const lenis = useLenis();
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const set = (p) => {
      el.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };

    if (lenis) {
      const onScroll = ({ progress }) => set(progress);
      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    }

    // Reduced-motion / pre-init fallback.
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      set(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        ref={ref}
        className="h-full origin-left scale-x-0 bg-yellow will-change-transform"
      />
    </div>
  );
}

/* ── Parallax ────────────────────────────────────────────────────────────
   Translates an element by a fraction of its distance through the viewport.
   Driven by the shared Lenis loop; no-ops under reduced motion.
   ──────────────────────────────────────────────────────────────────────── */
export function useParallax(speed = 0.12) {
  const lenis = useLenis();
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -200 || r.top > vh + 200) return;
      // -1 above the fold .. +1 below it
      const progress = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = `translate3d(0, ${(progress * speed * 100).toFixed(2)}px, 0)`;
    };

    const request = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();

    if (lenis) {
      lenis.on("scroll", request);
      return () => lenis.off("scroll", request);
    }
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [lenis, speed]);

  return ref;
}
