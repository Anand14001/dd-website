import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import { SmoothScroll, ScrollProgress, useLenis } from "./lib/smooth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingCta from "./components/FloatingCta";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Portfolio from "./pages/Portfolio";
import Events from "./pages/Events";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import VerifyCertificate from "./pages/VerifyCertificate";
import NotFound from "./pages/NotFound";

/** Jump to the top on every route change — through Lenis when it is driving. */
function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      // Lenis caches page height; a new route is a new document length.
      requestAnimationFrame(() => lenis.resize());
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, lenis]);

  return null;
}

export default function App() {
  return (
    <SmoothScroll>
      <ScrollProgress />
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/events" element={<Events />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/privacy-policy" element={<Legal />} />
          <Route path="/terms-and-conditions" element={<Legal />} />
          <Route path="/return-and-refund-policy" element={<Legal />} />
          <Route path="/verify-certificate" element={<VerifyCertificate />} />

          {/* Redirects from the old WordPress URLs */}
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
          <Route path="/pricing-plans" element={<Navigate to="/contact" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <FloatingCta />
    </SmoothScroll>
  );
}
