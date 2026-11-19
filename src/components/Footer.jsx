import { Link } from "react-router-dom";
import { Container } from "./ui";
import { brand, footer } from "../data/site";
import { services } from "../data/services";
import Social from "./Social";

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      {/* Main footer */}
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.2fr]">
          <div>
            <Link to="/" className="inline-block">
              <img
                src={brand.logo}
                alt={brand.name}
                width={350}
                height={95}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-6 max-w-[40ch] text-[15px] leading-relaxed text-white/55">
              <span className="font-bold text-white/80">Your Trusted Digital Partner.</span>{" "}
              {brand.blurb}
            </p>
            <Social className="mt-7" />
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <p className="mb-5 font-heading text-[13px] font-bold uppercase tracking-[0.14em] text-white/40">
                Quick Links
              </p>
              <ul className="flex flex-col gap-3">
                {footer.quickLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-[15px] text-white/70 transition-colors hover:text-yellow"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-5 font-heading text-[13px] font-bold uppercase tracking-[0.14em] text-white/40">
                Services
              </p>
              <ul className="flex flex-col gap-3">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`/services/${s.slug}`}
                      className="text-[15px] text-white/70 transition-colors hover:text-yellow"
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-5 font-heading text-[13px] font-bold uppercase tracking-[0.14em] text-white/40">
                Contact Us
              </p>
              <ul className="flex flex-col gap-3 text-[15px] text-white/70">
                {brand.phones.map((p) => (
                  <li key={p}>
                    <a
                      href={`tel:${p.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-yellow"
                    >
                      {p}
                    </a>
                  </li>
                ))}
                {brand.emails.map((e) => (
                  <li key={e}>
                    <a href={`mailto:${e}`} className="break-all transition-colors hover:text-yellow">
                      {e}
                    </a>
                  </li>
                ))}
                <li className="leading-relaxed text-white/55">{brand.address}</li>
                <li className="leading-relaxed text-white/55">{brand.hours}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-[14px] text-white/40">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.policies.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-[14px] text-white/40 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
