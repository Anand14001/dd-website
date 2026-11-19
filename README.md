# Digital Dude

The digital-dude.com website rebuilt with **Vite + React + Tailwind v4**, using the
weareyellowball.com visual system (colours, type scale, spacing, layout).

## Running it

```bash
npm run dev      # dev server with hot reload
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## Pages

| Route | Page |
|-------|------|
| `/` | Home |
| `/about` | About Us |
| `/services` | Services hub |
| `/services/:slug` | 8 service detail pages |
| `/portfolio` | Portfolio (websites + logo work) |
| `/events` | Events |
| `/blog` · `/blog/:slug` | Blog index + 3 posts |
| `/contact` | Contact |
| `/privacy-policy` · `/terms-and-conditions` · `/return-and-refund-policy` | Legal |
| `/verify-certificate` | Certificate verification |
| `*` | 404 |

Old WordPress URLs (`/about-us`, `/contact-us`) redirect to the new ones.
`/pricing-plans` redirects to `/contact` — pricing is no longer a public page.

## Where things live

| Path | What it is |
|------|-----------|
| `src/data/site.js` | Brand, contact details, nav, process, testimonials, FAQs |
| `src/data/services.js` | All 8 services and their detail-page content |
| `src/data/events.js` | Events page content |
| `src/data/work.js` | Portfolio projects, logo work and blog posts |
| `src/data/legal.js` | Legal page text (generated from the live site) |
| `src/index.css` | Design tokens — colours, fluid type scale, animations |
| `src/components/ui.jsx` | `Container`, `Button`, `Reveal`, `LayoutLines`, `Tag`, `PageHero` |
| `src/components/blocks.jsx` | Reusable page sections |
| `src/pages/` | One file per route |

**All copy lives in `src/data/`.** Edit there, not in components.

## Design tokens

| Token | Value |
|-------|-------|
| `navy` | `#1c1d2c` (page background) |
| `navy-light` | `#2a2b3a` (cards, header pills) |
| `cream` | `#f7f7f0` (light panels) |
| `yellow` | `#eaff01` (accent / CTAs) |
| `lime` `cyan` `silver` | floating team tags |
| headings | Satoshi |
| body | Reddit Sans |

Headings use `text-fluid-h1` … `text-fluid-h6`, which scale with the viewport via
`clamp()` — the exact clamp values from the reference build.

### A note on spacing

Tailwind v4's numeric spacing scale is `n × 0.25rem`, so `py-50` means **200px**, not
50px. Fixed pixel spacing is therefore written explicitly as `py-[50px]`, `mb-[100px]`.
Keep that convention.

## Before launch

- [ ] Point the contact form at a real endpoint (`onSubmit` in `src/pages/Contact.jsx`)
- [ ] Connect certificate lookup (`src/pages/VerifyCertificate.jsx`)
- [ ] Legal pages carry text copied from the live site — have them reviewed.
      Note the live Terms page contains a typo, "[DIGTAL DUDE]", preserved verbatim.
- [ ] Add an OG share image (currently falls back to the logo)
- [ ] Point the Events Infinite link at the real URL (`src/data/events.js` → `platform.cta.href`)
- [ ] Hosting must rewrite all routes to `index.html` (SPA fallback), or deep links 404
