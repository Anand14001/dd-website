/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ContactPage } from './pages/ContactPage';

/** Loaded on demand: the dashboard is internal, so visitors never download it. */
const AdminPage = React.lazy(() => import('./pages/admin/AdminPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        {/* Outside Layout: the admin area gets no navbar, footer or chat widget,
            so internal use never adds test conversations to the lead data. */}
        <Route
          path="admin"
          element={
            <React.Suspense
              fallback={<div className="min-h-screen bg-ink" />}
            >
              <AdminPage />
            </React.Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
