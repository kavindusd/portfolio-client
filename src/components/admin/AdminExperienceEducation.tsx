'use client';

import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ExperienceItem, EducationItem, CertificateItem } from '../../types/portfolio';
import { supabase } from '../../lib/supabase';
import { Icons } from '../ui/Icons';

// Storage cleanup helper to prevent orphaned files in Supabase Storage
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

type SubTab = 'experience' | 'education' | 'certificates';

export const AdminExperienceEducation: React.FC = () => {
  const {
    experiences,
    addExperience,
    updateExperience,
    deleteExperience,
    educations,
    addEducation,
    updateEducation,
    deleteEducation,
    certificates,
    addCertificate,
    updateCertificate,
    deleteCertificate,
  } = usePortfolio();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('experience');

  // ── Experience Modal State ──
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expForm, setExpForm] = useState({
    role: '',
    company: '',
    period: '',
    description: '',
    keyPoints: '',
    technologies: '',
  });

  // ── Education Modal State ──
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [eduForm, setEduForm] = useState({
    degree: '',
    institution: '',
    period: '',
    description: '',
    keyPoints: '',
  });

  // ── Certificate Modal State ──
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [uploadingCertImage, setUploadingCertImage] = useState(false);
  const [previewCert, setPreviewCert] = useState<CertificateItem | null>(null);
  const [certForm, setCertForm] = useState({
    title: '',
    issuer: '',
    date: '',
    imageUrl: '',
    skills: '',
  });

  // ── Experience Handlers ──
  const handleOpenAddExp = () => {
    setEditingExpId(null);
    setExpForm({
      role: '',
      company: '',
      period: '',
      description: '',
      keyPoints: '',
      technologies: '',
    });
    setIsExpModalOpen(true);
  };

  const handleOpenEditExp = (exp: ExperienceItem) => {
    setEditingExpId(exp.id);
    setExpForm({
      role: exp.role,
      company: exp.company,
      period: exp.period,
      description: exp.description,
      keyPoints: (exp.keyPoints || []).join('\n'),
      technologies: exp.technologies ? exp.technologies.join(', ') : '',
    });
    setIsExpModalOpen(true);
  };

  const handleSaveExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.role || !expForm.company || !expForm.period) return;

    const techArray = expForm.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const keyPointsArray = expForm.keyPoints
      .split('\n')
      .map((k) => k.trim())
      .filter(Boolean);

    const payload = {
      role: expForm.role,
      company: expForm.company,
      period: expForm.period,
      description: expForm.description,
      keyPoints: keyPointsArray,
      technologies: techArray,
    };

    if (editingExpId) {
      updateExperience(editingExpId, payload);
    } else {
      addExperience(payload);
    }
    setIsExpModalOpen(false);
  };

  // ── Education Handlers ──
  const handleOpenAddEdu = () => {
    setEditingEduId(null);
    setEduForm({
      degree: '',
      institution: '',
      period: '',
      description: '',
      keyPoints: '',
    });
    setIsEduModalOpen(true);
  };

  const handleOpenEditEdu = (edu: EducationItem) => {
    setEditingEduId(edu.id);
    setEduForm({
      degree: edu.degree,
      institution: edu.institution,
      period: edu.period,
      description: edu.description || '',
      keyPoints: (edu.keyPoints || []).join('\n'),
    });
    setIsEduModalOpen(true);
  };

  const handleSaveEdu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduForm.degree || !eduForm.institution || !eduForm.period) return;

    const keyPointsArray = eduForm.keyPoints
      .split('\n')
      .map((k) => k.trim())
      .filter(Boolean);

    const payload = {
      degree: eduForm.degree,
      institution: eduForm.institution,
      period: eduForm.period,
      description: eduForm.description,
      keyPoints: keyPointsArray,
    };

    if (editingEduId) {
      updateEducation(editingEduId, payload);
    } else {
      addEducation(payload);
    }
    setIsEduModalOpen(false);
  };

  // ── Certificate Handlers ──
  const handleOpenAddCert = () => {
    setEditingCertId(null);
    setCertForm({
      title: '',
      issuer: '',
      date: new Date().getFullYear().toString(),
      imageUrl: '',
      skills: '',
    });
    setIsCertModalOpen(true);
  };

  const handleOpenEditCert = (cert: CertificateItem) => {
    setEditingCertId(cert.id);
    setCertForm({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      imageUrl: cert.imageUrl || '',
      skills: (cert.skills || []).join(', '),
    });
    setIsCertModalOpen(true);
  };

  const handleCertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCertImage(true);
    try {
      if (certForm.imageUrl && certForm.imageUrl.includes('/portfolio-assets/')) {
        await deleteStorageFile(certForm.imageUrl);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `certificates/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (uploadError) {
        alert(`Storage upload error: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
      setCertForm((prev) => ({ ...prev, imageUrl: data.publicUrl }));
    } catch (err: any) {
      alert(`Error uploading certificate image: ${err.message}`);
    } finally {
      setUploadingCertImage(false);
    }
  };

  const handleRemoveCertImage = async () => {
    if (certForm.imageUrl && certForm.imageUrl.includes('/portfolio-assets/')) {
      await deleteStorageFile(certForm.imageUrl);
    }
    setCertForm((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title || !certForm.issuer) return;

    const skillsArray = certForm.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: certForm.title,
      issuer: certForm.issuer,
      date: certForm.date || new Date().getFullYear().toString(),
      imageUrl: certForm.imageUrl || '',
      skills: skillsArray,
    };

    if (editingCertId) {
      updateCertificate(editingCertId, payload);
    } else {
      addCertificate(payload);
    }
    setIsCertModalOpen(false);
  };

  const handleDeleteCert = async (cert: CertificateItem) => {
    if (!confirm(`Delete certificate "${cert.title}"?`)) return;

    if (cert.imageUrl && cert.imageUrl.includes('/portfolio-assets/')) {
      await deleteStorageFile(cert.imageUrl);
    }
    deleteCertificate(cert.id);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* ── Sub-navigation Tabs ── */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-zinc-100 dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80">
        <button
          type="button"
          onClick={() => setActiveSubTab('experience')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'experience'
              ? 'bg-white dark:bg-purple-600/20 text-purple-600 dark:text-purple-300 shadow-xs border border-purple-200 dark:border-purple-500/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Icons.Briefcase size={15} />
          <span>Work Experience ({experiences.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('education')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'education'
              ? 'bg-white dark:bg-purple-600/20 text-purple-600 dark:text-purple-300 shadow-xs border border-purple-200 dark:border-purple-500/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Icons.GraduationCap size={15} />
          <span>Education ({educations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('certificates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'certificates'
              ? 'bg-white dark:bg-purple-600/20 text-purple-600 dark:text-purple-300 shadow-xs border border-purple-200 dark:border-purple-500/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Icons.Award size={15} />
          <span>Certificates ({certificates.length})</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 1. WORK EXPERIENCE SECTION                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'experience' && (
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Icons.Briefcase size={20} className="text-purple-600 dark:text-purple-400" />
                <span>Work Experience & Roles</span>
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
                Manage your positions, timeline periods, key accomplishments, and tech stack tags.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddExp}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
            >
              <Icons.Plus size={16} />
              <span>Add Experience</span>
            </button>
          </div>

          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div
                key={exp.id || index}
                className="p-5 rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80 shadow-xs flex flex-col md:flex-row items-start md:items-start justify-between gap-4 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-xs text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                        {exp.role}
                      </h3>
                      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        @ {exp.company}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                        {exp.period}
                      </span>
                    </div>

                    {exp.description && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {exp.description}
                      </p>
                    )}

                    {/* Key points with checkmark icon preview */}
                    {exp.keyPoints && exp.keyPoints.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 tracking-wider block">
                          Key Deliverables ({exp.keyPoints.length})
                        </span>
                        {exp.keyPoints.map((point, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                            <span className="text-purple-500 shrink-0 mt-0.5">✓</span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {exp.technologies.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditExp(exp)}
                    className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-zinc-600 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
                    title="Edit Experience"
                  >
                    <Icons.Edit size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete experience "${exp.role}"?`)) {
                        deleteExperience(exp.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-colors cursor-pointer"
                    title="Delete Experience"
                  >
                    <Icons.Trash size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 2. EDUCATION SECTION                                               */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'education' && (
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Icons.GraduationCap size={20} className="text-indigo-600 dark:text-indigo-400" />
                <span>Education & Academic Programs</span>
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
                Manage your academic degrees, colleges, timeline periods, and academic milestones.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddEdu}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Icons.Plus size={16} />
              <span>Add Education</span>
            </button>
          </div>

          <div className="space-y-4">
            {educations.map((edu, index) => (
              <div
                key={edu.id || index}
                className="p-5 rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80 shadow-xs flex flex-col md:flex-row items-start md:items-start justify-between gap-4 hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                        {edu.degree}
                      </h3>
                      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        • {edu.institution}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                        {edu.period}
                      </span>
                    </div>

                    {edu.description && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {edu.description}
                      </p>
                    )}

                    {/* Key points / milestones */}
                    {edu.keyPoints && edu.keyPoints.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider block">
                          Academic Milestones ({edu.keyPoints.length})
                        </span>
                        {edu.keyPoints.map((point, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                            <span className="text-indigo-500 shrink-0 mt-0.5">✓</span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditEdu(edu)}
                    className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                    title="Edit Education"
                  >
                    <Icons.Edit size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete education "${edu.degree}"?`)) {
                        deleteEducation(edu.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-colors cursor-pointer"
                    title="Delete Education"
                  >
                    <Icons.Trash size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 3. CERTIFICATES SECTION                                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'certificates' && (
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Icons.Award size={20} className="text-amber-500" />
                <span>Certificates & Credentials</span>
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
                Upload certificates directly from your computer, set the issuing institute or website, and add skills tags.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddCert}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Icons.Plus size={16} />
              <span>Add Certificate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div
                    className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-3 border border-zinc-200 dark:border-zinc-800 cursor-pointer group"
                    onClick={() => setPreviewCert(cert)}
                  >
                    {cert.imageUrl ? (
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600">
                        <Icons.Award size={32} className="mb-1 opacity-70" />
                        <span className="text-[11px]">No image uploaded</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/70 text-white backdrop-blur-xs">
                      {cert.date}
                    </div>
                    {cert.imageUrl && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md text-[10px] font-semibold bg-black/80 text-white backdrop-blur-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icons.Eye size={12} />
                        <span>Click to preview</span>
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                    {cert.issuer}
                  </span>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm line-clamp-2">
                    {cert.title}
                  </h3>

                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {cert.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setPreviewCert(cert)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-amber-500 cursor-pointer"
                  >
                    <Icons.Eye size={13} />
                    <span>Preview</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditCert(cert)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors cursor-pointer"
                      title="Edit Certificate"
                    >
                      <Icons.Edit size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCert(cert)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Delete Certificate"
                    >
                      <Icons.Trash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* EXPERIENCE ADD / EDIT MODAL                                        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {editingExpId ? 'Edit Work Experience' : 'Add Work Experience'}
              </h3>
              <button
                type="button"
                onClick={() => setIsExpModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <Icons.X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Job Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={expForm.role}
                    onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tech Studio / Freelance"
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Time Period *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2024 — Present"
                  value={expForm.period}
                  onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Overview Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short summary of your overall role and responsibilities..."
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Key Points & Accomplishments (One per line)
                </label>
                <textarea
                  rows={4}
                  placeholder={`Spearheaded migration to Next.js App Router, boosting Lighthouse by 35%\nArchitected responsive design system with Tailwind and Figma tokens\nMentored junior developers and ran weekly code review sessions`}
                  value={expForm.keyPoints}
                  onChange={(e) => setExpForm({ ...expForm, keyPoints: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  Each line appears with a checkmark on the public timeline
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Technologies Used (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Next.js, React, Node.js, TypeScript, Tailwind"
                  value={expForm.technologies}
                  onChange={(e) => setExpForm({ ...expForm, technologies: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  {editingExpId ? 'Save Changes' : 'Add Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* EDUCATION ADD / EDIT MODAL                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {isEduModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {editingEduId ? 'Edit Education Program' : 'Add Education Program'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEduModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <Icons.X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdu} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Degree / Certification *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BSc (Hons) in Computing"
                    value={eduForm.degree}
                    onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Institution / University *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. University / SLIIT"
                    value={eduForm.institution}
                    onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Time Period / Years *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2021 — 2024"
                  value={eduForm.period}
                  onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Description & Focus
                </label>
                <textarea
                  rows={2}
                  placeholder="Key specializations, honors, focus areas..."
                  value={eduForm.description}
                  onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Key Milestones & Honors (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder={`Dean's List of Academic Honors\nSpecialization in Software Architecture & Distributed Systems\nGraduated First Class`}
                  value={eduForm.keyPoints}
                  onChange={(e) => setEduForm({ ...eduForm, keyPoints: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  Displayed with checkmark bullets on the public education timeline
                </span>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEduModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  {editingEduId ? 'Save Changes' : 'Add Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* CERTIFICATE ADD / EDIT MODAL                                       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {editingCertId ? 'Edit Certificate' : 'Add New Certificate'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCertModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <Icons.X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meta Certified Front-End Developer"
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Institute / Issuer / Website *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meta / Coursera / IBM"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Year / Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024"
                    value={certForm.date}
                    onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Certificate Image Upload */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Certificate Image (Upload from Computer)
                </label>

                {certForm.imageUrl ? (
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black border border-zinc-300 dark:border-zinc-800">
                    <img
                      src={certForm.imageUrl}
                      alt="Certificate Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveCertImage}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md cursor-pointer"
                      title="Remove image"
                    >
                      <Icons.Trash size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-300 dark:border-zinc-800 hover:border-amber-500/60 rounded-xl cursor-pointer bg-zinc-50 dark:bg-black/40 transition-colors">
                    <Icons.Upload size={24} className="text-amber-500 mb-2" />
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {uploadingCertImage ? 'Uploading Image...' : 'Click to upload certificate image'}
                    </span>
                    <span className="text-[11px] text-zinc-400 mt-1">PNG, JPG, or WEBP from local computer</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCertImageUpload}
                      disabled={uploadingCertImage}
                      className="hidden"
                    />
                  </label>
                )}

                <div>
                  <label className="block text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">
                    Or direct image URL:
                  </label>
                  <input
                    type="text"
                    value={certForm.imageUrl}
                    onChange={(e) => setCertForm({ ...certForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Skills / Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, TypeScript, CSS3, UI Architecture, Git"
                  value={certForm.skills}
                  onChange={(e) => setCertForm({ ...certForm, skills: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  {editingCertId ? 'Save Changes' : 'Add Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* CERTIFICATE LIGHTBOX PREVIEW MODAL                                 */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {previewCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setPreviewCert(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white dark:bg-[#0c0c14] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                  {previewCert.issuer} • {previewCert.date}
                </span>
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                  {previewCert.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <Icons.X size={18} />
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black border border-zinc-200 dark:border-zinc-800">
              {previewCert.imageUrl ? (
                <img
                  src={previewCert.imageUrl}
                  alt={previewCert.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                  <Icons.Award size={48} className="text-amber-500 mb-2 opacity-80" />
                  <span className="text-sm font-semibold">{previewCert.title}</span>
                  <span className="text-xs text-zinc-500 mt-1">No preview image uploaded</span>
                </div>
              )}
            </div>

            {previewCert.skills && previewCert.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {previewCert.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};