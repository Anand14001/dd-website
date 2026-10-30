import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  /** Absolute canonical URL for this route. */
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  /** JSON-LD object, injected as a single structured-data block. */
  jsonLd?: Record<string, unknown>;
}

/** Creates the tag on first use, then reuses it, so repeat navigations don't stack tags. */
const upsert = (selector: string, create: () => HTMLElement): HTMLElement => {
  const existing = document.head.querySelector<HTMLElement>(selector);
  if (existing) return existing;
  const el = create();
  document.head.appendChild(el);
  return el;
};

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  const el = upsert(`meta[${attr}="${key}"]`, () => {
    const meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    return meta;
  });
  el.setAttribute('content', content);
};

/**
 * Per-route document metadata for this single-page app.
 *
 * index.html only carries the site-wide tags, so a deep-linked or shared route
 * would otherwise advertise the home page's title and description. On unmount the
 * previous title is restored; the meta tags are overwritten by the next route that
 * calls this hook.
 */
export const usePageMeta = ({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  jsonLd,
}: PageMeta): void => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', ogTitle ?? title);
    setMeta('property', 'og:description', ogDescription ?? description);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', ogTitle ?? title);
    setMeta('name', 'twitter:description', ogDescription ?? description);

    if (ogImage) {
      setMeta('property', 'og:image', ogImage);
      setMeta('name', 'twitter:image', ogImage);
    }

    if (canonical) {
      const link = upsert('link[rel="canonical"]', () => {
        const el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        return el;
      });
      link.setAttribute('href', canonical);
      setMeta('property', 'og:url', canonical);
    }

    // Keyed by id so each route replaces its own block rather than appending.
    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.head.querySelector<HTMLScriptElement>('script[data-page-jsonld]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-page-jsonld', '');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      document.title = previousTitle;
      script?.remove();
    };
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, jsonLd]);
};
