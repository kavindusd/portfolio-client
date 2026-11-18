'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePortfolio } from '../../context/PortfolioContext';
import { supabase } from '../../lib/supabase';
import { Icons } from '../../components/ui/Icons';
import { AdminOverview } from '../../components/admin/AdminOverview';
import { AdminProjects } from '../../components/admin/AdminProjects';
import { AdminExperienceEducation } from '../../components/admin/AdminExperienceEducation';
import { AdminMessages } from '../../components/admin/AdminMessages';
import { AdminCustomization } from '../../components/admin/AdminCustomization';

type AdminTab = 'overview' | 'projects' | 'experience' | 'messages' | 'customization';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const { messages, profile } = usePortfolio();

  // Supabase Auth State
  const [session, setSession] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // 1. Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });

    // 2. Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
      } else if (data.session) {
        setSession(data.session);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to sign in');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  // ── Loading Screen ──
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#07070b] flex flex-col items-center justify-center text-zinc-300">
        <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 animate-pulse">
          <Icons.Shield size={24} />
        </div>
        <p className="text-sm font-medium text-zinc-400">Verifying Admin Session...</p>
      </div>
    );
  }

  // ── Login Gate (If Not Authenticated) ──
  if (!session) {
    return (
      <div className="min-h-screen bg-[#07070b] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Ambient atmospheric backdrop */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-md rounded-2xl bg-[#0c0c14]/90 border border-zinc-800/80 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          {/* Brand & Title */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-purple-600/30 mb-3">
              <Icons.Shield size={22} />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Studio Admin</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Sign in with your Supabase admin credentials to manage your portfolio.
            </p>
          </div>

          {/* Error Alert */}
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <Icons.Trash size={14} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Icons.Lock size={15} />
                  <span>Sign In to Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Return link */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <Icons.ArrowLeft size={13} />
              <span>Return to Public Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated Admin Dashboard ──
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060609] text-zinc-900 dark:text-zinc-200 flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-[#0a0a10] border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800/80 p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
              <Icons.Shield size={16} />
            </div>
            <div>
              <h1 className="font-bold text-zinc-900 dark:text-white text-sm tracking-tight leading-none">
                Studio Admin
              </h1>
              <span className="text-[11px] text-zinc-500 font-mono">
                {session.user?.email || `${profile.name.toLowerCase()}.dev`}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-purple-600/15 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Icons.Sparkles size={16} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-purple-600/15 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Icons.Folder size={16} />
              <span>Projects</span>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'experience'
                  ? 'bg-purple-600/15 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Icons.Briefcase size={16} />
              <span>Experience & Edu</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-purple-600/15 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icons.Mail size={16} />
                <span>Inquiries</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500 text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('customization')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'customization'
                  ? 'bg-purple-600/15 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Icons.Sliders size={16} />
              <span>Customization</span>
            </button>
          </nav>
        </div>

        {/* Footer Actions: Public Site Link & Sign Out */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800/80 mt-6 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <Icons.ArrowLeft size={14} />
            <span>Back to Public Site</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 text-xs font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors pt-2 cursor-pointer"
          >
            <Icons.LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl">
        {activeTab === 'overview' && (
          <AdminOverview
            onTabChange={(tab) => {
              if (tab === 'projects' || tab === 'messages' || tab === 'customization') {
                setActiveTab(tab);
              }
            }}
          />
        )}
        {activeTab === 'projects' && <AdminProjects />}
        {activeTab === 'experience' && <AdminExperienceEducation />}
        {activeTab === 'messages' && <AdminMessages />}
        {activeTab === 'customization' && <AdminCustomization />}
      </main>
    </div>
  );
}
