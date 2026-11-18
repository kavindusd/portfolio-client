'use client';

import React from 'react';
import Link from 'next/link';
import { usePortfolio } from '../../context/PortfolioContext';
import { Icons } from '../ui/Icons';

export const AdminOverview: React.FC<{
  onTabChange: (tab: 'projects' | 'messages' | 'customization') => void;
}> = ({ onTabChange }) => {
  const { projects, messages, profile } = usePortfolio();

  const unreadMessages = messages.filter((m) => !m.read).length;
  const featuredProjects = projects.filter((p) => p.featured).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Welcome back, {profile.name}
          </h2>
          <p className="text-zinc-400 text-sm">
            Manage your public portfolio projects, incoming client messages, and profile information.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-zinc-900 hover:bg-zinc-200 transition-colors shadow-lg"
        >
          <Icons.Eye size={14} />
          <span>View Public Site</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Projects</span>
            <Icons.Folder size={18} className="text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{projects.length}</div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            {featuredProjects} highlighted on hero
          </span>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Inquiries</span>
            <Icons.Mail size={18} className="text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{messages.length}</div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            From contact form submissions
          </span>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Unread Messages</span>
            <Icons.Sparkles size={18} className="text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{unreadMessages}</div>
          <span className="text-[11px] text-amber-400/80 mt-1 block font-medium">
            Requires your reply
          </span>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Availability</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-lg font-bold text-white mt-1">Open for Work</div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Configured in Profile
          </span>
        </div>
      </div>

      {/* Two Column Layout: Recent Messages & Quick Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Icons.Mail size={16} className="text-purple-400" />
                <span>Recent Inquiries</span>
              </h3>
              <button
                onClick={() => onTabChange('messages')}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium"
              >
                View all ({messages.length}) →
              </button>
            </div>

            <div className="space-y-3">
              {messages.slice(0, 3).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    !msg.read
                      ? 'bg-purple-950/20 border-purple-500/30'
                      : 'bg-zinc-900/80 border-zinc-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {!msg.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      )}
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {msg.createdAt.slice(0, 10)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-1">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Projects Summary */}
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Icons.Folder size={16} className="text-indigo-400" />
                <span>Active Projects</span>
              </h3>
              <button
                onClick={() => onTabChange('projects')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Manage ({projects.length}) →
              </button>
            </div>

            <div className="space-y-3">
              {projects.slice(0, 3).map((proj) => (
                <div
                  key={proj.id}
                  className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3"
                >
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-12 h-12 rounded-lg object-cover bg-zinc-950"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {proj.title}
                    </h4>
                    <span className="text-[11px] text-zinc-400">
                      {proj.category} • {proj.tags.slice(0, 2).join(', ')}
                    </span>
                  </div>
                  {proj.featured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Featured
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
