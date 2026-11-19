import { socials } from "../data/site";

const paths = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  Facebook: (
    <path d="M14.5 8.5h2.2V5.6h-2.6c-2.2 0-3.6 1.4-3.6 3.6v1.6H8.3v2.9h2.2V21h3v-7.3h2.3l.4-2.9h-2.7V9.6c0-.7.3-1.1 1-1.1z" />
  ),
  LinkedIn: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10.5V17" />
      <circle cx="7.5" cy="7.3" r="1.1" fill="currentColor" stroke="none" />
      <path d="M11.3 17v-3.6a2.2 2.2 0 0 1 4.4 0V17" />
    </>
  ),
};

/** Social icon row. `tone` adapts it to dark or cream backgrounds. */
export default function Social({ tone = "dark", className = "" }) {
  const styles =
    tone === "light"
      ? "border-navy/20 text-navy/70 hover:border-navy hover:bg-navy hover:text-yellow"
      : "border-white/20 text-white/70 hover:border-yellow hover:bg-yellow hover:text-navy";

  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {socials.map((s) => (
        <li key={s.name}>
          <a
            href={s.url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={s.name}
            title={s.name}
            className={`grid size-11 place-items-center rounded-full border transition-all duration-300 ${styles}`}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {paths[s.name]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
