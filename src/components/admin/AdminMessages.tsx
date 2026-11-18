'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { supabase } from '../../lib/supabase';
import { Icons } from '../ui/Icons';

interface SupabaseMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export const AdminMessages: React.FC = () => {
  const {
    messages: localMessages,
    markMessageRead: markLocalRead,
    deleteMessage: deleteLocalMessage,
    readMessageIds,
  } = usePortfolio();
  const [supabaseMessages, setSupabaseMessages] = useState<SupabaseMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch messages error:', error.message);
      } else if (data) {
        setSupabaseMessages(data as SupabaseMessage[]);
      }
    } catch (err) {
      console.warn('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMessages();
  };

  const handleMarkRead = (id: string, readState = true) => {
    // 1. Optimistic UI update in Supabase local cache
    setSupabaseMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: readState } : m))
    );
    // 2. Persist to context, Supabase profile customization & localStorage
    markLocalRead(id, readState);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    // 1. Optimistic UI update in Supabase local cache
    setSupabaseMessages((prev) => prev.filter((m) => m.id !== id));
    // 2. Persist delete to context, Supabase profile customization & localStorage
    deleteLocalMessage(id);
  };

  // Combine Supabase messages with context read-status persistence
  const sourceList = supabaseMessages.length > 0 ? supabaseMessages : localMessages;
  const displayList = sourceList.map((m: any) => {
    const isRead = Boolean(m.read) || (Array.isArray(readMessageIds) && readMessageIds.includes(m.id));
    return {
      id: m.id,
      name: m.name,
      email: m.email,
      message: m.message,
      read: isRead,
      createdAt: m.created_at || m.createdAt || new Date().toISOString(),
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Client Inquiries</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Supabase Live
            </span>
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Real-time messages submitted from your public portfolio contact form.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 transition-all cursor-pointer disabled:opacity-50"
          title="Refresh messages from Supabase"
        >
          <div className={refreshing ? 'animate-spin' : ''}>
            <Icons.Sparkles size={13} />
          </div>
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="text-center py-16 rounded-2xl bg-zinc-900/40 border border-zinc-800 animate-pulse">
          <Icons.Mail size={32} className="mx-auto text-zinc-600 mb-3" />
          <p className="text-sm text-zinc-400">Loading inquiries from Supabase...</p>
        </div>
      ) : displayList.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-zinc-900/40 border border-zinc-800">
          <Icons.Mail size={32} className="mx-auto text-zinc-600 mb-3" />
          <p className="text-sm text-zinc-400">No incoming messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayList.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-2xl border transition-all ${
                !msg.read
                  ? 'bg-purple-950/20 border-purple-500/40 shadow-lg shadow-purple-950/10'
                  : 'bg-zinc-900/60 border-zinc-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {!msg.read && (
                    <span
                      title="Unread message"
                      className="w-2 h-2 rounded-full bg-purple-400"
                    />
                  )}
                  <h3 className="font-bold text-white text-sm">{msg.name}</h3>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs text-purple-400 hover:underline font-mono"
                  >
                    &lt;{msg.email}&gt;
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {msg.createdAt.replace('T', ' ').slice(0, 16)}
                  </span>

                  <button
                    onClick={() => handleMarkRead(msg.id, !msg.read)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      !msg.read
                        ? 'text-purple-300 hover:text-white bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/30'
                        : 'text-zinc-400 hover:text-zinc-200 bg-zinc-800/60 hover:bg-zinc-700/60 border-zinc-700/50'
                    }`}
                  >
                    {!msg.read ? 'Mark Read' : 'Mark Unread'}
                  </button>

                  <a
                    href={`mailto:${msg.email}?subject=Regarding your portfolio inquiry`}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="Reply by email"
                  >
                    <Icons.Send size={13} />
                  </a>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                    title="Delete inquiry"
                  >
                    <Icons.Trash size={13} />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80 text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
