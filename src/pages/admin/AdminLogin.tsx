/**
 * Admin sign-in.
 *
 * The password is posted to the server and compared there. Nothing about it
 * exists in this bundle, and the session comes back as an HttpOnly cookie this
 * code cannot read — so a visitor reading the JavaScript learns nothing.
 */
import React, { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { ApiError, adminApi } from './adminApi';
import { Notice } from './ui';

export const AdminLogin: React.FC<{ onSignedIn: () => void }> = ({ onSignedIn }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !password) return;

    setBusy(true);
    setError(null);
    try {
      await adminApi.login(password);
      setPassword('');
      onSignedIn();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not reach the server. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0e0e13]">
            <Lock size={18} className="text-lime" />
          </div>
          <h1 className="text-lg font-semibold text-white">Digital Dude Admin</h1>
          <p className="mt-1 text-xs text-[#898781]">Lead dashboard · authorised access only</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-white/10 bg-[#0e0e13] p-6"
        >
          <label htmlFor="admin-password" className="block text-xs font-medium text-[#c3c2b7]">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm text-white outline-none transition focus:border-lime/60"
            placeholder="Enter admin password"
          />

          {error && (
            <div className="mt-4">
              <Notice tone="error">{error}</Notice>
            </div>
          )}

          <button
            type="submit"
            disabled={busy || !password}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-lime px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-lime-dim disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy && <Loader2 size={14} className="animate-spin" />}
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-[#898781]">
          This dashboard holds customer contact details and chat transcripts.
          Do not share the password or leave it open on a shared device.
        </p>
      </div>
    </div>
  );
};
