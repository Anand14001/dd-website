import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { brand, nav } from "../data/site";
import { services } from "../data/services";

/* Header geometry mirrors the reference build:
   18px gutter, two translucent groups at radius 16px with 3px inner padding,
   and 54px-tall items. The row is full-width, never capped. */

const GROUP =
  "flex items-center rounded-full bg-[rgba(130,130,130,0.10)] p-[3px] backdrop-blur-xl";
const ITEM = "flex h-[54px] items-center rounded-full font-heading text-[16px] font-bold";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the mobile drawer on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const primary = nav.filter((n) => n.label !== "Home");

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 p-[18px]">
      <div className="flex w-full items-start justify-between gap-4">
        {/* ── Left group: logo + nav ─────────────────────────────── */}
        <div className={`pointer-events-auto relative ${GROUP}`}>
          <Link
            to="/"
            aria-label={brand.name}
            className="grid size-[54px] shrink-0 place-items-center rounded-full bg-white"
          >
            <img src={brand.icon} alt="" className="size-8 object-contain" />
          </Link>

          <nav className="hidden items-center lg:flex">
            {primary.map((item) =>
              item.label === "Services" ? (
                <div
                  key={item.label}
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `${ITEM} gap-2 px-5 transition-colors ${
                        isActive ? "text-yellow" : "text-white hover:text-yellow"
                      }`
                    }
                  >
                    <span
                      className={`text-[17px] leading-none transition-transform duration-300 ${
                        servicesOpen ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                    {item.label}
                  </NavLink>

                  {/* Mega menu */}
                  <div
                    className={`absolute left-0 top-full w-[700px] max-w-[calc(100vw-36px)] pt-3 transition-all duration-300 ${
                      servicesOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="rounded-[20px] bg-navy-light p-9 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
                      <div className="grid grid-cols-2 gap-x-10">
                        {[
                          { label: "Build & Design", list: services.slice(0, 4) },
                          { label: "Grow & Convert", list: services.slice(4) },
                        ].map((col) => (
                          <div key={col.label}>
                            <p className="mb-5 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-white/40">
                              {col.label}
                            </p>
                            <ul>
                              {col.list.map((s) => (
                                <li key={s.slug}>
                                  <Link
                                    to={`/services/${s.slug}`}
                                    className="block py-3 font-heading text-[18px] font-semibold transition-colors hover:text-yellow"
                                  >
                                    {s.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `${ITEM} px-5 transition-colors ${
                      isActive ? "text-yellow" : "text-white hover:text-yellow"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Burger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="grid size-[54px] place-items-center lg:hidden"
          >
            <span className="relative block h-3 w-5" aria-hidden="true">
              <span className="absolute left-0 top-0 h-0.5 w-5 rounded bg-white" />
              <span className="absolute left-0 top-[5px] h-0.5 w-5 rounded bg-white" />
              <span className="absolute left-0 top-[10px] h-0.5 w-5 rounded bg-white" />
            </span>
          </button>
        </div>

        {/* ── Right group: CTA ───────────────────────────────────── */}
        <div className={`pointer-events-auto shrink-0 ${GROUP}`}>
          <Link
            to="/contact"
            className={`${ITEM} bg-yellow px-7 text-navy transition-all duration-300 hover:brightness-95`}
          >
            Get in Touch
          </Link>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────── */}
      <div
        id="mobile-menu"
        className={`pointer-events-auto fixed inset-0 z-50 overflow-y-auto bg-navy transition-all duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Drawer header: logo + explicit close */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-navy/95 px-[18px] py-[18px] backdrop-blur-xl">
          <span className="grid size-[54px] place-items-center rounded-full bg-white">
            <img src={brand.icon} alt="" className="size-8 object-contain" />
          </span>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-[54px] items-center gap-2.5 rounded-full bg-[rgba(130,130,130,0.12)] px-6 font-heading text-[15px] font-bold transition-colors hover:bg-[rgba(130,130,130,0.2)]"
          >
            Close
            <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col px-[18px] pb-16 pt-4">
          {nav.map((item, i) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/"}
              style={{ transitionDelay: `${open ? i * 40 + 60 : 0}ms` }}
              className={({ isActive }) =>
                `border-b border-white/10 py-4 font-heading text-[28px] font-bold transition-all duration-500 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                } ${isActive ? "text-yellow" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <p className="mt-8 font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-white/35">
            Services
          </p>
          <div className="mt-3 grid gap-1">
            {services.map((s) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="py-2 text-[16px] text-white/65 transition-colors hover:text-yellow"
              >
                {s.name}
              </Link>
            ))}
          </div>

          <Link
            to="/contact"
            className="mt-9 inline-flex items-center justify-center rounded-full bg-yellow px-7 py-4 font-heading text-[16px] font-bold text-navy"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </header>
  );
}
