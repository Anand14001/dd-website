import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { DigitalDudeAssistantWidget } from './chat/DigitalDudeAssistantWidget';

/** Scrolls to top on page change, or to an in-page anchor when the URL carries a hash. */
const ScrollManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }));
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return null;
};

/**
 * Temporarily hides the floating Digital Dude assistant across the site.
 * The widget and its code are intact - flip this back to `true` to bring it back.
 */
const SHOW_ASSISTANT_WIDGET = false;

export const Layout: React.FC = () => {
  const location = useLocation();
  const isDedicatedAssistantPage = location.pathname === '/assistant';

  return (
    <div className="min-h-screen bg-ink text-white flex flex-col font-[var(--font-body)]">
      <ScrollManager />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {SHOW_ASSISTANT_WIDGET && !isDedicatedAssistantPage && <DigitalDudeAssistantWidget />}
    </div>
  );
};
