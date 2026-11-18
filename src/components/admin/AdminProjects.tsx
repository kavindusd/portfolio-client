'use client';

import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types/portfolio';
import { supabase } from '../../lib/supabase';
import { Icons } from '../ui/Icons';

// Helper to extract bucket path and delete obsolete files to keep storage clean
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

export const AdminProjects: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormState = {
    title: '',
    description: '',
    category: 'Fullstack' as Project['category'],
    tags: '',
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    overview: '',
    role: '',
    client: '',
    features: '',
    deliverables: '',
    gallery: [] as string[],
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setEditingId(proj.id);
    setFormData({
      title: proj.title,
      description: proj.description,
      category: proj.category,
      tags: proj.tags.join(', '),
      imageUrl: proj.imageUrl || '',
      liveUrl: proj.liveUrl || '',
      githubUrl: proj.githubUrl || '',
      featured: proj.featured,
      overview: proj.overview || '',
      role: proj.role || '',
      client: proj.client || '',
      features: (proj.features || []).join('\n'),
      deliverables: (proj.deliverables || []).join('\n'),
      gallery: proj.gallery || [],
    });
    setIsModalOpen(true);
  };

  // Upload Cover Image directly from local computer to Supabase Storage
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // Clean up previous image file from storage to save space
      if (formData.imageUrl) {
        await deleteStorageFile(formData.imageUrl);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (uploadError) {
        alert(`Storage upload error: ${uploadError.message}. Make sure 'portfolio-assets' bucket is public.`);
        return;
      }

      const { data } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, imageUrl: data.publicUrl }));
    } catch (err: any) {
      alert(`Error uploading file: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveCover = async () => {
    if (formData.imageUrl) {
      await deleteStorageFile(formData.imageUrl);
    }
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  // Upload multiple Gallery Images directly from local computer
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-assets')
          .upload(filePath, file);

        if (!uploadError) {
          const { data } = supabase.storage
            .from('portfolio-assets')
            .getPublicUrl(filePath);
          uploadedUrls.push(data.publicUrl);
        }
      }

      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...uploadedUrls],
      }));
    } catch (err: any) {
      alert(`Error uploading gallery images: ${err.message}`);
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = async (indexToRemove: number) => {
    const urlToRemove = formData.gallery[indexToRemove];
    if (urlToRemove) {
      await deleteStorageFile(urlToRemove);
    }
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    setIsSubmitting(true);
    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const featuresArray = formData.features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const deliverablesArray = formData.deliverables
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    const projectPayload: Omit<Project, 'id' | 'createdAt'> = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: tagsArray.length > 0 ? tagsArray : ['Web'],
      imageUrl: formData.imageUrl || '',
      liveUrl: formData.liveUrl || undefined,
      githubUrl: formData.githubUrl || undefined,
      featured: formData.featured,
      overview: formData.overview || undefined,
      role: formData.role || undefined,
      client: formData.client || undefined,
      features: featuresArray.length > 0 ? featuresArray : undefined,
      deliverables: deliverablesArray.length > 0 ? deliverablesArray : undefined,
      gallery: formData.gallery.length > 0 ? formData.gallery : undefined,
    };

    if (editingId) {
      updateProject(editingId, projectPayload);

      try {
        await supabase
          .from('projects')
          .update({
            title: projectPayload.title,
            description: projectPayload.description,
            category: projectPayload.category,
            tags: projectPayload.tags,
            image_url: projectPayload.imageUrl,
            live_url: projectPayload.liveUrl || null,
            github_url: projectPayload.githubUrl || null,
            featured: projectPayload.featured,
            overview: projectPayload.overview || null,
            role: projectPayload.role || null,
            client: projectPayload.client || null,
            features: projectPayload.features || [],
            deliverables: projectPayload.deliverables || [],
            gallery: projectPayload.gallery || [],
          })
          .eq('id', editingId);
      } catch (err) {
        console.warn('Could not update project in Supabase', err);
      }
    } else {
      addProject(projectPayload);

      try {
        await supabase.from('projects').insert([
          {
            title: projectPayload.title,
            description: projectPayload.description,
            category: projectPayload.category,
            tags: projectPayload.tags,
            image_url: projectPayload.imageUrl,
            live_url: projectPayload.liveUrl || null,
            github_url: projectPayload.githubUrl || null,
            featured: projectPayload.featured,
            overview: projectPayload.overview || null,
            role: projectPayload.role || null,
            client: projectPayload.client || null,
            features: projectPayload.features || [],
            deliverables: projectPayload.deliverables || [],
            gallery: projectPayload.gallery || [],
          },
        ]);
      } catch (err) {
        console.warn('Could not insert project into Supabase', err);
      }
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleDelete = async (proj: Project) => {
    if (!confirm(`Delete project "${proj.title}"?`)) return;

    deleteProject(proj.id);

    // Clean up associated files from storage to save space
    if (proj.imageUrl) {
      deleteStorageFile(proj.imageUrl);
    }
    if (proj.gallery && proj.gallery.length > 0) {
      proj.gallery.forEach((url) => deleteStorageFile(url));
    }

    try {
      await supabase.from('projects').delete().eq('id', proj.id);
    } catch (err) {
      console.warn('Could not delete project from Supabase', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Project Catalog</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Supabase Storage Enabled
            </span>
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Create, update or remove items. Upload images and gallery screenshots directly from your computer.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
        >
          <Icons.Plus size={14} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-3.5">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                {proj.imageUrl && proj.imageUrl !== '/avatar.png' ? (
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icons.Folder size={20} className="text-zinc-600" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{proj.title}</h4>
                  <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {proj.category}
                  </span>
                  {proj.featured && (
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Featured
                    </span>
                  )}
                  {proj.gallery && proj.gallery.length > 0 && (
                    <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {proj.gallery.length} Photos
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 line-clamp-1 max-w-xl">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {proj.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => handleOpenEdit(proj)}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Edit Project"
              >
                <Icons.Edit size={15} />
              </button>
              <button
                onClick={() => handleDelete(proj)}
                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                title="Delete Project"
              >
                <Icons.Trash size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#0c0c14] border border-zinc-700 shadow-2xl p-6 max-h-[92vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Workflow Platform"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as Project['category'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Fullstack">Fullstack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Design">Design</option>
                </select>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Short Description * (Shown on Homepage Card)
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Brief summary of the project..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Next.js, TypeScript, Tailwind CSS, PostgreSQL"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* ── COVER IMAGE UPLOAD FROM COMPUTER ── */}
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Main Cover Image</span>
                    <span className="text-[10px] font-normal text-purple-400">
                      (Upload from your computer)
                    </span>
                  </label>
                  {formData.imageUrl && formData.imageUrl !== '/avatar.png' && (
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                    >
                      Remove Cover
                    </button>
                  )}
                </div>

                {/* Upload Button */}
                <div>
                  <label
                    htmlFor="cover-image-file"
                    className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-zinc-700 hover:border-purple-500 bg-zinc-950/50 hover:bg-zinc-950 transition-all cursor-pointer text-center"
                  >
                    <Icons.Upload size={18} className="text-purple-400 mb-1" />
                    <span className="text-xs font-medium text-zinc-300">
                      {uploadingImage ? 'Uploading to Supabase...' : 'Click to Choose Image File from Computer'}
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">
                      JPG, PNG, WebP (Uploads to portfolio-assets)
                    </span>
                  </label>
                  <input
                    id="cover-image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </div>

                {/* Thumbnail Preview */}
                {formData.imageUrl && formData.imageUrl !== '/avatar.png' && (
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={formData.imageUrl}
                      alt="Cover Preview"
                      className="w-20 h-14 rounded-lg object-cover border border-zinc-700"
                    />
                    <span className="text-[11px] text-emerald-400 font-mono truncate max-w-xs">
                      ✓ Uploaded to Supabase Storage
                    </span>
                  </div>
                )}
              </div>

              {/* ── PROJECT GALLERY UPLOAD (MULTIPLE) ── */}
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Project Gallery Screenshots</span>
                    <span className="text-[10px] font-normal text-purple-400">
                      (Detail page showcase)
                    </span>
                  </label>
                  {formData.gallery.length > 0 && (
                    <span className="text-[10px] text-zinc-400">
                      {formData.gallery.length} image{formData.gallery.length > 1 ? 's' : ''} uploaded
                    </span>
                  )}
                </div>

                {/* Multiple Gallery File Picker */}
                <div>
                  <label
                    htmlFor="gallery-image-files"
                    className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-zinc-700 hover:border-purple-500 bg-zinc-950/50 hover:bg-zinc-950 transition-all cursor-pointer text-center"
                  >
                    <Icons.Plus size={18} className="text-purple-400 mb-1" />
                    <span className="text-xs font-medium text-zinc-300">
                      {uploadingGallery ? 'Uploading Screenshots...' : 'Click to Upload Screenshots from Computer'}
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">
                      You can select multiple files at once
                    </span>
                  </label>
                  <input
                    id="gallery-image-files"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    disabled={uploadingGallery}
                    className="hidden"
                  />
                </div>

                {/* Gallery Thumbnails List */}
                {formData.gallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {formData.gallery.map((url, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-zinc-700 aspect-video bg-zinc-950">
                        <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-black/80 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove image"
                        >
                          <Icons.Trash size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://myproject.com"
                    value={formData.liveUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, liveUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    GitHub URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formData.githubUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, githubUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Detail Page Fields (Overview, Role, Client) */}
              <div className="space-y-3 pt-2 border-t border-zinc-800">
                <span className="block text-xs font-bold text-purple-400">
                  Project Detail Page Content (Optional)
                </span>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                    Full Project Overview
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Detailed explanation for the project detail page..."
                    value={formData.overview}
                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                      Your Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Fullstack Engineer"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                      Client / Company
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                    Key Features (One per line)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-purple-500 resize-none font-mono"
                  />
                </div>
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="featuredCheckbox"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-black border-zinc-700"
                />
                <label
                  htmlFor="featuredCheckbox"
                  className="text-xs font-medium text-zinc-300 cursor-pointer"
                >
                  Highlight as Featured Project
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingImage || uploadingGallery}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer disabled:opacity-50 shadow-lg shadow-purple-600/30"
                >
                  {isSubmitting ? 'Saving to Database...' : editingId ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
