/**
 * /admin — the dashboard shell.
 *
 * Mounted outside the marketing Layout on purpose: no navbar, no footer, and no
 * chat widget, so working here never pollutes the lead data with your own test
 * conversations.
 *
 * The route guard below is convenience, not security. The real boundary is the
 * session check on every /api/admin request — this component simply cannot show
 * data the server declines to send.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  BarChart3,
  Bot,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  RefreshCw,
  Settings,
  Users,
} from 'lucide-react';
import { adminApi } from './adminApi';
import { AdminLogin } from './AdminLogin';
import { OverviewTab } from './OverviewTab';
import { LeadsTab } from './LeadsTab';
import { LeadDrawer } from './LeadDrawer';
import { ConversationsTab } from './ConversationsTab';
import { BotHealthTab } from './BotHealthTab';
import { SettingsTab } from './SettingsTab';
import type { DashboardStats, FilterOptions, LeadQuery } from './types';
import { Notice, Spinner } from './ui';

type TabKey = 'overview' | 'leads' | 'conversations' | 'bot' | 'settings';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={15} /> },
  { key: 'leads', label: 'Leads', icon: <Users size={15} /> },
  { key: 'conversations', label: 'Conversations', icon: <MessagesSquare size={15} /> },
  { key: 'bot', label: 'Bot health', icon: <Bot size={15} /> },
  { key: 'settings', label: 'Settings', icon: <Settings size={15} /> },
];

export const AdminPage: React.FC = () => {
  const [authState, setAuthState] = useState<'checking' | 'out' | 'in'>('checking');
  const [tab, setTab] = useState<TabKey>('overview');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [options, setOptions] = useState<FilterOptions | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [leadQuery, setLeadQuery] = useState<LeadQuery>({ page: 1, pageSize: 25 });
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  // Keep the admin area out of search results even if the URL leaks.
  useEffect(() => {
    document.title = 'Digital Dude · Admin';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const result = await adminApi.session();
      setAuthState(result.authenticated ? 'in' : 'out');
    } catch {
      setAuthState('out');
    }
  }, []);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  const loadDashboard = useCallback(async () => {
    setStatsError(null);
    try {
      const [nextStats, nextOptions] = await Promise.all([
        adminApi.stats(),
        adminApi.options().catch(() => null),
      ]);
      setStats(nextStats);
      if (nextOptions) setOptions(nextOptions);
    } catch (err) {
      setStatsError(err instanceof Error ? err.message : 'Could not load dashboard data.');
    }
  }, []);

  useEffect(() => {
    if (authState === 'in') void loadDashboard();
  }, [authState, loadDashboard, refreshToken]);

  const refreshAll = () => setRefreshToken((value) => value + 1);

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } finally {
      setAuthState('out');
      setStats(null);
    }
  };

  if (authState === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <Spinner label="Checking session…" />
      </div>
    );
  }

  if (authState === 'out') {
    return <AdminLogin onSignedIn={() => setAuthState('in')} />;
  }

  const jumpToLeads = (patch: { needsAttention?: boolean; temperature?: string }) => {
    setLeadQuery({ page: 1, pageSize: 25, ...patch });
    setTab('leads');
  };

  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-lime" />
            <span className="text-sm font-semibold">Digital Dude · Leads</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshAll}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-[#c3c2b7] transition hover:border-white/25 hover:text-white"
            >
              <RefreshCw size={12} /> Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-[#c3c2b7] transition hover:border-white/25 hover:text-white"
            >
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-xs transition ${
                tab === item.key
                  ? 'border-lime text-white'
                  : 'border-transparent text-[#898781] hover:text-[#c3c2b7]'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5">
        {statsError && (
          <div className="mb-5">
            <Notice tone="error">
              {statsError} — if this is the first run, open Settings and run the database migration.
            </Notice>
          </div>
        )}

        {tab === 'overview' &&
          (stats ? (
            <OverviewTab stats={stats} options={options} onJumpToLeads={jumpToLeads} />
          ) : statsError ? null : (
            <Spinner label="Loading dashboard…" />
          ))}

        {tab === 'leads' && (
          <LeadsTab
            options={options}
            query={leadQuery}
            onQueryChange={setLeadQuery}
            onOpenLead={setOpenLeadId}
            refreshToken={refreshToken}
          />
        )}

        {tab === 'conversations' && <ConversationsTab onOpenLead={setOpenLeadId} />}
        {tab === 'bot' && <BotHealthTab />}
        {tab === 'settings' && <SettingsTab />}
      </main>

      {openLeadId && (
        <LeadDrawer
          leadId={openLeadId}
          options={options}
          onClose={() => setOpenLeadId(null)}
          onChanged={refreshAll}
        />
      )}
    </div>
  );
};

export default AdminPage;
