import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/** Persistent yellow CTA pinned to the bottom-right, as on the reference. */
export default function FloatingCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Link
      to="/contact"
      className={`fixed bottom-6 right-6 z-40 hidden rounded-full bg-yellow px-8 py-4 font-heading text-[16px] font-bold leading-none text-navy shadow-[0_18px_40px_-14px_rgba(0,0,0,0.8)] transition-all duration-400 hover:brightness-95 md:block ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      Let&rsquo;s Talk
    </Link>
  );
}
