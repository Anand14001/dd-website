import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Portfolio', to: '/portfolio' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-ink/90 backdrop-blur-md border-b border-white/10 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            id="brand-logo-link"
            className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime rounded-lg p-1"
          >
            <img
              src="/logo_white.png"
              alt="Digital Dude"
              width={350}
              height={95}
              className="h-9 w-auto transition-transform group-hover:scale-105 sm:h-10"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-lime' : 'text-white/60 hover:text-white'
                  }`
                }
              >
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Action (Desktop only: lg+) */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              id="nav-consultation-btn"
              to="/contact"
              className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-ink bg-lime hover:bg-lime-dim transition-all active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile menu button (shown on small screens & tablets below lg) */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-white/70 hover:text-white bg-ink-soft border border-white/10 hover:bg-white/5 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-panel"
            className="lg:hidden mt-3 p-4 bg-ink-soft/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl space-y-3"
          >
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'text-lime' : 'text-white/80 hover:text-lime'
                    }`
                  }
                >
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <Link
                id="mobile-nav-consultation-btn"
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-ink bg-lime hover:bg-lime-dim text-center flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center justify-center gap-2 text-xs text-white/50 py-1">
                <ShieldCheck className="w-3.5 h-3.5 text-lime" />
                <span>Response within 4 hours</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
