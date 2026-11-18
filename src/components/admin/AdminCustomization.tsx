'use client';

import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { supabase } from '../../lib/supabase';
import { Icons } from '../ui/Icons';
import { ServiceItem } from '../../types/portfolio';

// Storage cleanup helper to keep free-tier storage clean
function extractStoragePath(publicUrl: string): string | null {
  if (!publicUrl || !publicUrl.includes('/portfolio-assets/')) return null;
  const parts = publicUrl.split('/portfolio-assets/');
  return parts[1] ? decodeURIComponent(parts[1].split('?')[0]) : null;
}

async function deleteStorageFile(publicUrl: string) {
  const path = extractStoragePath(publicUrl);
  if (path) {
    try {
      await supabase.storage.from('portfolio-assets').remove([path]);
    } catch (e) {
      console.warn('Could not delete old storage file:', e);
    }
  }
}

type CustomizationSubTab = 'hero' | 'about' | 'services' | 'socials' | 'smtp';

export const AdminCustomization: React.FC = () => {
  const {
    profile,
    updateProfile,
    services,
    addService,
    updateService,
    deleteService,
    resetToDefaults,
  } = usePortfolio();

  const [activeSubTab, setActiveSubTab] = useState<CustomizationSubTab>('hero');
  const [formData, setFormData] = useState({ ...profile });

  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingAboutPhoto, setUploadingAboutPhoto] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);

  // SMTP Testing State
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Service Modal State for adding/editing services
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    icon: 'Laptop',
    tags: '',
    theme: 'purple' as 'purple' | 'rose' | 'sky' | 'emerald' | 'amber',
  });

  const showSaveSuccess = (msg = 'Customizations saved successfully!') => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(null), 3500);
  };

  // ── Profile / Section Save Handler ──
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    showSaveSuccess();
  };

  // ── Test SMTP Connection ──
  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    setSmtpTestResult(null);
    try {
      const res = await fetch('/api/contact/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.smtp || {}),
      });
      const data = await res.json();
      setSmtpTestResult(data);
    } catch (e: any) {
      setSmtpTestResult({
        success: false,
        message: e.message || 'Failed to connect to SMTP test endpoint.',
      });
    } finally {
      setTestingSmtp(false);
    }
  };

  // ── Upload Hero Avatar from Computer ──
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      // Clean up previous uploaded avatar file from storage
      if (formData.avatarUrl && formData.avatarUrl.includes('/portfolio-assets/')) {
        await deleteStorageFile(formData.avatarUrl);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (uploadError) {
        alert(`Storage upload error: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
      const updated = { ...formData, avatarUrl: data.publicUrl };
      setFormData(updated);
      updateProfile(updated);
      showSaveSuccess('Hero avatar uploaded and saved!');
    } catch (err: any) {
      alert(`Error uploading avatar: ${err.message}`);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ── Upload About Photo from Computer ──
  const handleAboutPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAboutPhoto(true);
    try {
      const currentPhoto = formData.about?.photoUrl;
      if (currentPhoto && currentPhoto.includes('/portfolio-assets/')) {
        await deleteStorageFile(currentPhoto);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `about/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (uploadError) {
        alert(`Storage upload error: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
      const updated = {
        ...formData,
        about: {
          ...(formData.about || {}),
          photoUrl: data.publicUrl,
        },
      };
      setFormData(updated);
      updateProfile(updated);
      showSaveSuccess('About section photo uploaded and saved!');
    } catch (err: any) {
      alert(`Error uploading about photo: ${err.message}`);
    } finally {
      setUploadingAboutPhoto(false);
    }
  };

  // ── Upload CV Document from Computer ──
  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCv(true);
    try {
      const currentCv = formData.hero?.cvUrl;
      if (currentCv && currentCv.includes('/portfolio-assets/')) {
        await deleteStorageFile(currentCv);
      }

      const fileExt = file.name.split('.').pop() || 'pdf';
      const cleanBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `${Date.now()}-${cleanBaseName}.${fileExt}`;
      const filePath = `cv/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file, {
          contentType: file.type || 'application/pdf',
        });

      if (uploadError) {
        alert(`Storage upload error: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
      const updated = {
        ...formData,
        hero: {
          ...(formData.hero || {}),
          cvUrl: data.publicUrl,
        },
      };
      setFormData(updated);
      updateProfile(updated);
      showSaveSuccess('CV document uploaded and saved!');
    } catch (err: any) {
      alert(`Error uploading CV: ${err.message}`);
    } finally {
      setUploadingCv(false);
    }
  };

  // ── Remove Uploaded CV ──
  const handleRemoveCv = async () => {
    if (!confirm('Remove this uploaded CV document?')) return;
    const currentCv = formData.hero?.cvUrl;
    if (currentCv && currentCv.includes('/portfolio-assets/')) {
      await deleteStorageFile(currentCv);
    }
    const updated = {
      ...formData,
      hero: {
        ...(formData.hero || {}),
        cvUrl: '',
      },
    };
    setFormData(updated);
    updateProfile(updated);
    showSaveSuccess('CV document removed.');
  };

  // ── Open Service Modal for Add ──
  const handleOpenAddService = () => {
    setEditingServiceId(null);
    setServiceForm({
      title: '',
      description: '',
      icon: 'Laptop',
      tags: '',
      theme: 'purple',
    });
    setServiceModalOpen(true);
  };

  // ── Open Service Modal for Edit ──
  const handleOpenEditService = (serv: ServiceItem) => {
    let cleanIcon = serv.icon || 'Laptop';
    let cardTheme = serv.theme || 'purple';
    if (cleanIcon.includes('::')) {
      const parts = cleanIcon.split('::');
      cleanIcon = parts[0];
      cardTheme = (parts[1] as any) || cardTheme;
    }

    setEditingServiceId(serv.id);
    setServiceForm({
      title: serv.title,
      description: serv.description,
      icon: cleanIcon,
      tags: (serv.bullets || []).join(', '),
      theme: (cardTheme as any) || 'purple',
    });
    setServiceModalOpen(true);
  };

  // ── Save Service (Add / Update) ──
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title.trim()) return;

    const tagsArray = serviceForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingServiceId) {
      updateService(editingServiceId, {
        title: serviceForm.title,
        description: serviceForm.description,
        icon: serviceForm.icon,
        bullets: tagsArray,
        theme: serviceForm.theme,
      });
      showSaveSuccess(`Service "${serviceForm.title}" updated!`);
    } else {
      addService({
        title: serviceForm.title,
        description: serviceForm.description,
        icon: serviceForm.icon,
        bullets: tagsArray,
        theme: serviceForm.theme,
      });
      showSaveSuccess(`Service "${serviceForm.title}" created!`);
    }

    setServiceModalOpen(false);
  };

  // ── Delete Service ──
  const handleDeleteService = (serv: ServiceItem) => {
    if (!confirm(`Are you sure you want to delete service "${serv.title}"?`)) return;
    deleteService(serv.id);
    showSaveSuccess(`Service "${serv.title}" deleted.`);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Icons.Sliders size={22} className="text-purple-600 dark:text-purple-400" />
            <span>Site Customization</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
            Customize the live content, headings, images, and text for your Hero, About, and Services sections.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm('Reset site customizations back to initial default demo content?')) {
              resetToDefaults();
              setFormData({ ...profile });
              showSaveSuccess('Content reset to default presets.');
            }
          }}
          className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline cursor-pointer self-start sm:self-auto"
        >
          Reset Demo Defaults
        </button>
      </div>

      {/* ── Sub-navigation Tabs ── */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-zinc-100 dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80">
        <button
          type="button"
          onClick={() => setActiveSubTab('hero')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'hero'
              ? 'bg-white dark:bg-purple-600/20 text-purple-600 dark:text-purple-300 shadow-xs border border-purple-200 dark:border-purple-500/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Icons.Sparkles size={15} />
          <span>Hero Section</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('about')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'about'
              ? 'bg-white dark:bg-purple-600/20 text-purple-600 dark:text-purple-300 shadow-xs border border-purple-200 dark:border-purple-500/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Icons.User size={15} />
          <span>About Section</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('services')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'services'
              ? 'bg-white dark:bg-purple-600/20 text-purple-600 dark:text-purple-300 shadow-xs border border-purple-200 dark:border-purple-500/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Icons.Layers size={15} />
          <span>Services Section</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('socials')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'socials'
              ? 'bg-white dark:bg-purple-600/20 text-purple-600 dark:text-purple-300 shadow-xs border border-purple-200 dark:border-purple-500/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Icons.Send size={15} />
          <span>Contact & Socials</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('smtp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'smtp'
              ? 'bg-white dark:bg-purple-600/20 text-purple-600 dark:text-purple-300 shadow-xs border border-purple-200 dark:border-purple-500/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Icons.Mail size={15} />
          <span>SMTP / Email</span>
        </button>
      </div>

      {/* ── Success Toast Alert ── */}
      {savedMessage && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium animate-fadeIn">
          <Icons.Check size={16} />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 1. HERO SECTION CUSTOMIZATION                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'hero' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Icons.Sparkles size={16} className="text-purple-500" />
              <span>Hero Headings & Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Greeting Prefix
                </label>
                <input
                  type="text"
                  value={formData.hero?.greeting ?? "Hey, I'm"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...(formData.hero || {}), greeting: e.target.value },
                    })
                  }
                  placeholder="Hey, I'm"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">Appears before your name</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Full / Display Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Kavindu"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                  required
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">Styled in vivid glowing gradient</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Role Prefix
                </label>
                <input
                  type="text"
                  value={formData.hero?.rolePrefix ?? 'A'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...(formData.hero || {}), rolePrefix: e.target.value },
                    })
                  }
                  placeholder="A"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">e.g. &quot;A&quot; or &quot;Senior&quot;</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Role Title
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Web Developer"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                  required
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">Second line title headline</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Hero Tagline Subheading
              </label>
              <input
                type="text"
                value={formData.hero?.tagline ?? 'A web developer with solid foundations in design.'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...(formData.hero || {}), tagline: e.target.value },
                  })
                }
                placeholder="A web developer with solid foundations in design."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Bio Paragraph
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief intro paragraph under the hero headline..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Hero Avatar Upload Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Icons.User size={16} className="text-purple-500" />
              <span>Hero Cutout Avatar Image</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Upload a transparent PNG or high-res portrait from your computer. When you upload a new photo, the old one is automatically removed from storage to save space.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800">
              {/* Preview */}
              <div className="w-32 h-36 rounded-xl border border-zinc-300 dark:border-zinc-800 overflow-hidden bg-zinc-200/50 dark:bg-zinc-900 flex items-center justify-center shrink-0 relative group">
                <img
                  src={formData.avatarUrl || '/avatar.png'}
                  alt="Avatar Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/avatar.png';
                  }}
                />
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3 w-full">
                <div>
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer shadow-md shadow-purple-600/20 transition-all">
                    <Icons.Upload size={14} />
                    <span>{uploadingAvatar ? 'Uploading Avatar...' : 'Upload Avatar from Computer'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                    Or Image URL directly:
                  </label>
                  <input
                    type="text"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    placeholder="https://... or /avatar.png"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CV / Resume Upload Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Icons.FileText size={16} className="text-purple-500" />
                  <span>Curriculum Vitae (CV / Resume)</span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Upload your CV in PDF or DOCX format. Visitors who click the &quot;Download CV&quot; button in your Hero section will download or view this file.
                </p>
              </div>

              {formData.hero?.cvUrl && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
                  <Icons.Check size={12} />
                  <span>CV Active</span>
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer shadow-md shadow-purple-600/20 transition-all">
                  <Icons.Upload size={14} />
                  <span>{uploadingCv ? 'Uploading CV Document...' : 'Upload CV File (PDF / Word)'}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleCvUpload}
                    disabled={uploadingCv}
                    className="hidden"
                  />
                </label>

                {formData.hero?.cvUrl && (
                  <>
                    <a
                      href={formData.hero.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-purple-500 transition-colors"
                    >
                      <Icons.Download size={13} />
                      <span>View Current CV</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleRemoveCv}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Icons.Trash size={13} />
                      <span>Remove</span>
                    </button>
                  </>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Or Direct CV Link (e.g. Google Drive, Dropbox, or custom URL):
                </label>
                <input
                  type="text"
                  value={formData.hero?.cvUrl || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...(formData.hero || {}), cvUrl: e.target.value },
                    })
                  }
                  placeholder="https://... or uploaded file URL"
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
          >
            Save Hero Customizations
          </button>
        </form>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 2. ABOUT SECTION CUSTOMIZATION                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'about' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Icons.User size={16} className="text-purple-500" />
              <span>About Section Headers & Story</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Mascot Badge Text
                </label>
                <input
                  type="text"
                  value={formData.about?.badge ?? 'About Me'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...(formData.about || {}), badge: e.target.value },
                    })
                  }
                  placeholder="About Me"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={
                    formData.about?.heading ??
                    'Passionate about crafting digital experiences that make an impact.'
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...(formData.about || {}), heading: e.target.value },
                    })
                  }
                  placeholder="Passionate about crafting digital experiences..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Greeting Intro (Large text)
              </label>
              <textarea
                rows={2}
                value={formData.about?.intro ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...(formData.about || {}), intro: e.target.value },
                  })
                }
                placeholder={`Hi, I'm ${formData.name} — a dedicated web developer bridging the gap between creative UI/UX design and engineering performance...`}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Story Paragraph 1
                </label>
                <textarea
                  rows={4}
                  value={formData.about?.paragraph1 ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...(formData.about || {}), paragraph1: e.target.value },
                    })
                  }
                  placeholder="With solid expertise across modern frontend architecture and backend technologies..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Story Paragraph 2
                </label>
                <textarea
                  rows={4}
                  value={formData.about?.paragraph2 ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...(formData.about || {}), paragraph2: e.target.value },
                    })
                  }
                  placeholder="Whether translating Figma prototypes into responsive, accessible code..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Stats Bar Settings */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Icons.Award size={16} className="text-purple-500" />
              <span>Key Experience Stats Strip</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <label className="block text-[11px] font-bold text-zinc-500 uppercase">Stat 1</label>
                <input
                  type="text"
                  value={formData.about?.stat1Value ?? '3+'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...(formData.about || {}), stat1Value: e.target.value },
                    })
                  }
                  placeholder="3+"
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white font-bold"
                />
                <input
                  type="text"
                  value={formData.about?.stat1Label ?? 'Years Coding Experience'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...(formData.about || {}), stat1Label: e.target.value },
                    })
                  }
                  placeholder="Years Coding Experience"
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-300"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <label className="block text-[11px] font-bold text-zinc-500 uppercase">Stat 2</label>
                <input
                  type="text"
                  value={formData.about?.stat2Value ?? '25+'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...(formData.about || {}), stat2Value: e.target.value },
                    })
                  }
                  placeholder="25+"
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white font-bold"
                />
                <input
                  type="text"
                  value={formData.about?.stat2Label ?? 'Applications Built'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...(formData.about || {}), stat2Label: e.target.value },
                    })
                  }
                  placeholder="Applications Built"
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-300"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <label className="block text-[11px] font-bold text-zinc-500 uppercase">Stat 3</label>
                <input
                  type="text"
                  value={formData.about?.stat3Value ?? '100%'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...(formData.about || {}), stat3Value: e.target.value },
                    })
                  }
                  placeholder="100%"
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-purple-600 dark:text-purple-400 font-bold"
                />
                <input
                  type="text"
                  value={formData.about?.stat3Label ?? 'Client & Project Commitment'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...(formData.about || {}), stat3Label: e.target.value },
                    })
                  }
                  placeholder="Client & Project Commitment"
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-300"
                />
              </div>
            </div>
          </div>

          {/* Personal Quote & Circular Photo */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Icons.Sparkles size={16} className="text-purple-500" />
              <span>Personal Philosophy Quote & Photo</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Quote Text
              </label>
              <textarea
                rows={2}
                value={
                  formData.about?.quote ??
                  "Great software isn't just about writing code — it's about creating intuitive, memorable digital experiences that solve real problems with elegance and speed."
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...(formData.about || {}), quote: e.target.value },
                  })
                }
                placeholder="Your personal design philosophy quote..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 italic resize-none leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800">
              <div className="w-16 h-16 rounded-full shrink-0 p-0.5 bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-500 shadow-md">
                <img
                  src={formData.about?.photoUrl || formData.avatarUrl || '/profile.jpg'}
                  alt="About circular thumbnail"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/profile.jpg';
                  }}
                />
              </div>

              <div className="flex-1 space-y-2 w-full">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer shadow-md shadow-purple-600/20 transition-all">
                  <Icons.Upload size={14} />
                  <span>{uploadingAboutPhoto ? 'Uploading Photo...' : 'Upload Circular Photo from Computer'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAboutPhotoUpload}
                    disabled={uploadingAboutPhoto}
                    className="hidden"
                  />
                </label>

                <div>
                  <input
                    type="text"
                    value={formData.about?.photoUrl ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...(formData.about || {}), photoUrl: e.target.value },
                      })
                    }
                    placeholder="https://... or /profile.jpg"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
          >
            Save About Customizations
          </button>
        </form>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 3. SERVICES SECTION CUSTOMIZATION                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'services' && (
        <div className="space-y-6">
          {/* Section Header Settings Form */}
          <form onSubmit={handleSave} className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Icons.Layers size={16} className="text-purple-500" />
              <span>Services Section Headers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Mascot Badge Text
                </label>
                <input
                  type="text"
                  value={formData.servicesConfig?.badge ?? 'Services'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      servicesConfig: {
                        ...(formData.servicesConfig || {}),
                        badge: e.target.value,
                      },
                    })
                  }
                  placeholder="Services"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Section Headline
                </label>
                <input
                  type="text"
                  value={formData.servicesConfig?.heading ?? 'Building Digital Experiences'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      servicesConfig: {
                        ...(formData.servicesConfig || {}),
                        heading: e.target.value,
                      },
                    })
                  }
                  placeholder="Building Digital Experiences"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Section Subtitle
              </label>
              <textarea
                rows={2}
                value={
                  formData.servicesConfig?.subtitle ??
                  'I specialize in engineering fullstack web applications and crafting modern user interfaces that look stunning and perform seamlessly.'
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    servicesConfig: {
                      ...(formData.servicesConfig || {}),
                      subtitle: e.target.value,
                    },
                  })
                }
                placeholder="Description under section heading..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
              >
                Save Services Headers
              </button>
            </div>
          </form>

          {/* Interactive Service Cards Management */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Icons.Laptop size={16} className="text-purple-500" />
                  <span>Service Cards ({services.length})</span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Manage the services shown on your homepage. You can edit their title, description, tags, icon, and colors.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddService}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
              >
                <Icons.Plus size={14} />
                <span>Add Service</span>
              </button>
            </div>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((serv, index) => {
                let cleanIcon = serv.icon || 'Laptop';
                let cardTheme = serv.theme;
                if (cleanIcon.includes('::')) {
                  const parts = cleanIcon.split('::');
                  cleanIcon = parts[0];
                  if (!cardTheme) cardTheme = parts[1] as any;
                }
                const defaultThemes = ['purple', 'rose', 'sky', 'emerald', 'amber'];
                cardTheme = cardTheme || (defaultThemes[index % defaultThemes.length] as any);

                return (
                  <div
                    key={serv.id}
                    className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-black/40 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                            cardTheme === 'rose'
                              ? 'bg-rose-500/15 border-rose-400/30 text-rose-500'
                              : cardTheme === 'sky'
                              ? 'bg-sky-500/15 border-sky-400/30 text-sky-500'
                              : cardTheme === 'emerald'
                              ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-500'
                              : cardTheme === 'amber'
                              ? 'bg-amber-500/15 border-amber-400/30 text-amber-500'
                              : 'bg-purple-500/15 border-purple-400/30 text-purple-600 dark:text-purple-400'
                          }`}
                        >
                          <Icons.Laptop size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                            {serv.title}
                          </h4>
                          <span
                            className={`text-[10px] uppercase font-mono font-bold tracking-wider ${
                              cardTheme === 'rose'
                                ? 'text-rose-500'
                                : cardTheme === 'sky'
                                ? 'text-sky-500'
                                : cardTheme === 'emerald'
                                ? 'text-emerald-500'
                                : cardTheme === 'amber'
                                ? 'text-amber-500'
                                : 'text-purple-600 dark:text-purple-400'
                            }`}
                          >
                            {cardTheme} theme • {cleanIcon}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditService(serv)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors cursor-pointer"
                          title="Edit Service"
                        >
                          <Icons.Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(serv)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors cursor-pointer"
                          title="Delete Service"
                        >
                          <Icons.Trash size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                      {serv.description}
                    </p>

                    {serv.bullets && serv.bullets.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        {serv.bullets.map((b, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal for Add / Edit Service */}
          {serviceModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
              <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                    {editingServiceId ? 'Edit Service' : 'Add New Service'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setServiceModalOpen(false)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  >
                    <Icons.X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveService} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                      placeholder="e.g. Fullstack Web Apps"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={serviceForm.description}
                      onChange={(e) =>
                        setServiceForm({ ...serviceForm, description: e.target.value })
                      }
                      placeholder="Explain what you offer in this service..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Icon
                      </label>
                      <select
                        value={serviceForm.icon}
                        onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                      >
                        <option value="Laptop">Laptop (Web Apps)</option>
                        <option value="Palette">Palette (UI/UX Design)</option>
                        <option value="Layers">Layers (APIs & Architecture)</option>
                        <option value="Code">Code (Fullstack & Logic)</option>
                        <option value="Sparkles">Sparkles (AI & Innovation)</option>
                        <option value="Shield">Shield (Security & Devops)</option>
                        <option value="Award">Award (Consulting & Quality)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Color Theme
                      </label>
                      <select
                        value={serviceForm.theme}
                        onChange={(e) =>
                          setServiceForm({ ...serviceForm, theme: e.target.value as any })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                      >
                        <option value="purple">Purple Theme</option>
                        <option value="rose">Rose / Pink Theme</option>
                        <option value="sky">Sky / Blue Theme</option>
                        <option value="emerald">Emerald / Green Theme</option>
                        <option value="amber">Amber / Gold Theme</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Tags (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={serviceForm.tags}
                      onChange={(e) => setServiceForm({ ...serviceForm, tags: e.target.value })}
                      placeholder="Next.js, React, Node.js, PHP, MySQL, MongoDB"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                    <span className="text-[11px] text-zinc-400 mt-1 block">
                      Shown at bottom of service card
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setServiceModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/20 cursor-pointer"
                    >
                      {editingServiceId ? 'Update Service' : 'Add Service'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 4. CONTACT & SOCIALS CUSTOMIZATION                                 */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'socials' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Icons.Send size={16} className="text-purple-500" />
              <span>Contact Details & Status</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.socials.email || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, email: e.target.value },
                    })
                  }
                  placeholder="hello@example.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.socials.phone || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, phone: e.target.value },
                    })
                  }
                  placeholder="+94 77 123 4567"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Icons.WhatsApp size={14} className="text-emerald-500" />
                  <span>WhatsApp Number (Powers Floating Chat Button)</span>
                </label>
                <input
                  type="text"
                  value={formData.socials.whatsapp || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, whatsapp: e.target.value },
                    })
                  }
                  placeholder="+94 77 123 4567 or 94771234567"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  When set, a floating WhatsApp chat button will automatically appear in the bottom corner for visitors.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Kurunegala, Sri Lanka"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
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
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-black border-zinc-700 cursor-pointer"
                />
                <label
                  htmlFor="workAvailability"
                  className="text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  Show &quot;Available for work&quot; green indicator badge
                </label>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Icons.Github size={16} className="text-purple-500" />
              <span>Social Profiles</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  GitHub URL
                </label>
                <input
                  type="text"
                  value={formData.socials.github || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, github: e.target.value },
                    })
                  }
                  placeholder="https://github.com/yourusername"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  value={formData.socials.linkedin || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, linkedin: e.target.value },
                    })
                  }
                  placeholder="https://linkedin.com/in/yourusername"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Instagram URL
                </label>
                <input
                  type="text"
                  value={formData.socials.instagram || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/yourusername"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  X (Twitter) URL
                </label>
                <input
                  type="text"
                  value={formData.socials.twitter || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, twitter: e.target.value },
                    })
                  }
                  placeholder="https://x.com/yourusername"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
          >
            Save Contact & Socials
          </button>
        </form>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 5. SMTP / EMAIL SETTINGS                                           */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'smtp' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Icons.Mail size={16} className="text-purple-600 dark:text-purple-400" />
                  <span>SMTP Mail Server Configuration</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Configure your SMTP credentials to receive instant email notifications whenever a visitor contacts you.
                </p>
              </div>

              {/* Enabled toggle */}
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={formData.smtp?.enabled !== false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      smtp: {
                        ...(formData.smtp || {}),
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-zinc-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span className="text-zinc-700 dark:text-zinc-300">Enable Email Delivery</span>
              </label>
            </div>

            {/* Test Status Banner */}
            {smtpTestResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
                  smtpTestResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                }`}
              >
                {smtpTestResult.success ? (
                  <Icons.Check size={16} className="shrink-0 mt-0.5" />
                ) : (
                  <Icons.X size={16} className="shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="font-semibold">
                    {smtpTestResult.success ? 'SMTP Connection Succeeded!' : 'SMTP Connection Failed'}
                  </div>
                  <div className="text-[11px] opacity-90">{smtpTestResult.message}</div>
                </div>
              </div>
            )}

            {/* Gmail App Password Guide Notice */}
            <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 text-purple-800 dark:text-purple-300 text-xs space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <Icons.Sparkles size={14} />
                <span>Using Gmail? Use an App Password (not your regular account password)</span>
              </div>
              <p className="text-[11px] text-purple-700 dark:text-purple-300/80 leading-relaxed">
                1. Make sure 2-Step Verification is turned ON in your Google Account.
                <br />
                2. Go to <strong>Google Account → Security → App Passwords</strong> (or search "App passwords").
                <br />
                3. Create one named <em>Portfolio</em> and copy the generated 16-character code into the <strong>SMTP Password</strong> field below.
              </p>
            </div>

            {/* Server Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={formData.smtp?.host || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      smtp: { ...(formData.smtp || {}), host: e.target.value },
                    })
                  }
                  placeholder="smtp.gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Port
                  </label>
                  <input
                    type="number"
                    value={formData.smtp?.port ?? 587}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        smtp: {
                          ...(formData.smtp || {}),
                          port: parseInt(e.target.value) || 587,
                          secure: parseInt(e.target.value) === 465,
                        },
                      })
                    }
                    placeholder="587"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Encryption
                  </label>
                  <select
                    value={formData.smtp?.secure ? 'ssl' : 'tls'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        smtp: {
                          ...(formData.smtp || {}),
                          secure: e.target.value === 'ssl',
                          port: e.target.value === 'ssl' ? 465 : 587,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="tls">STARTTLS (Port 587)</option>
                    <option value="ssl">SSL (Port 465)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Auth Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  SMTP Username / Email
                </label>
                <input
                  type="email"
                  value={formData.smtp?.user || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      smtp: { ...(formData.smtp || {}), user: e.target.value },
                    })
                  }
                  placeholder="your-email@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  SMTP Password / App Password
                </label>
                <input
                  type="password"
                  value={formData.smtp?.pass || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      smtp: { ...(formData.smtp || {}), pass: e.target.value },
                    })
                  }
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>

            {/* Sender / Receiver Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Sender Display Name
                </label>
                <input
                  type="text"
                  value={formData.smtp?.fromName || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      smtp: { ...(formData.smtp || {}), fromName: e.target.value },
                    })
                  }
                  placeholder="Kavin Portfolio"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Sender Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.smtp?.fromEmail || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      smtp: { ...(formData.smtp || {}), fromEmail: e.target.value },
                    })
                  }
                  placeholder="Defaults to SMTP username"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Inquiry Receiver Email
                </label>
                <input
                  type="email"
                  value={formData.smtp?.receiverEmail || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      smtp: { ...(formData.smtp || {}), receiverEmail: e.target.value },
                    })
                  }
                  placeholder="Where notifications get sent"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Auto-responder Toggle */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <label className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.smtp?.sendAutoReply)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      smtp: {
                        ...(formData.smtp || {}),
                        sendAutoReply: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-zinc-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span>
                  <strong>Send visitor auto-responder:</strong> Send an immediate confirmation receipt back to the visitor's email after submission.
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
            >
              Save SMTP Settings
            </button>

            <button
              type="button"
              disabled={testingSmtp}
              onClick={handleTestSmtp}
              className="px-5 py-3 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {testingSmtp ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span>Testing Connection & Sending Mail...</span>
                </>
              ) : (
                <>
                  <Icons.Send size={14} />
                  <span>Test Connection & Send Test Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};