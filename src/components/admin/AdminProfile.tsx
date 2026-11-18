'use client';

import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Icons } from '../ui/Icons';

export const AdminProfile: React.FC = () => {
  const { profile, updateProfile, resetToDefaults } = usePortfolio();
  const [formData, setFormData] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Profile & Bio Settings</h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Configure your headline, role title, avatar, and social links.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset all portfolio and profile data to initial demo defaults?')) {
              resetToDefaults();
              setFormData({ ...profile });
            }
          }}
          className="text-xs text-zinc-500 hover:text-zinc-300 underline"
        >
          Reset Demo Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Role Title
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Avatar Image URL
          </label>
          <input
            type="url"
            value={formData.avatarUrl}
            onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-sm text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Bio / Subtitle
          </label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              id="workAvailability"
              type="checkbox"
              checked={formData.availableForWork}
              onChange={(e) =>
                setFormData({ ...formData, availableForWork: e.target.checked })
              }
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-black border-zinc-700"
            />
            <label
              htmlFor="workAvailability"
              className="text-xs font-medium text-zinc-300 cursor-pointer"
            >
              Show Green Available Status Indicator
            </label>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="pt-4 border-t border-zinc-800 space-y-3">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Social Profiles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">GitHub</label>
              <input
                type="url"
                value={formData.socials.github || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, github: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg bg-black border border-zinc-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">LinkedIn</label>
              <input
                type="url"
                value={formData.socials.linkedin || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, linkedin: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg bg-black border border-zinc-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">X (Twitter)</label>
              <input
                type="url"
                value={formData.socials.twitter || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, twitter: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg bg-black border border-zinc-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Dribbble / Website</label>
              <input
                type="url"
                value={formData.socials.dribbble || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, dribbble: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg bg-black border border-zinc-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/20 transition-all"
          >
            Save Profile Settings
          </button>
          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <Icons.Check size={14} /> Saved successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
