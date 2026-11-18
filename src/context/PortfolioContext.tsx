'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  ProfileInfo,
  ServiceItem,
  ToolCategory,
  Project,
  ContactMessage,
  ExperienceItem,
  EducationItem,
  CertificateItem,
} from '../types/portfolio';
import {
  initialProfile,
  initialServices,
  initialToolCategories,
  initialProjects,
  initialMessages,
  initialExperiences,
  initialEducations,
  initialCertificates,
} from '../data/mockData';

interface PortfolioContextType {
  profile: ProfileInfo;
  updateProfile: (updated: Partial<ProfileInfo>) => void;
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  tools: ToolCategory[];
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  experiences: ExperienceItem[];
  addExperience: (exp: Omit<ExperienceItem, 'id'>) => void;
  updateExperience: (id: string, updated: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;
  educations: EducationItem[];
  addEducation: (edu: Omit<EducationItem, 'id'>) => void;
  updateEducation: (id: string, updated: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;
  certificates: CertificateItem[];
  addCertificate: (cert: Omit<CertificateItem, 'id'>) => void;
  updateCertificate: (id: string, updated: Partial<CertificateItem>) => void;
  deleteCertificate: (id: string) => void;
  messages: ContactMessage[];
  readMessageIds: string[];
  sendMessage: (msg: { name: string; email: string; message: string }) => void;
  markMessageRead: (id: string, read?: boolean) => void;
  deleteMessage: (id: string) => void;
  resetToDefaults: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'portfolio_profile_data_v2',
  PROJECTS: 'portfolio_projects_data_v2',
  MESSAGES: 'portfolio_messages_data_v2',
  EXPERIENCES: 'portfolio_experiences_data_v2',
  EDUCATIONS: 'portfolio_educations_data_v2',
  CERTIFICATES: 'portfolio_certificates_data_v2',
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileInfo>(initialProfile);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [tools, setTools] = useState<ToolCategory[]>(initialToolCategories);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiences);
  const [educations, setEducations] = useState<EducationItem[]>(initialEducations);
  const [certificates, setCertificates] = useState<CertificateItem[]>(initialCertificates);
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [readMessageIds, setReadMessageIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (
          parsed.name === 'Nadhir' ||
          parsed.location === 'Web Developer' ||
          !parsed.socials?.phone ||
          !parsed.avatarUrl.includes('photo-1535713875002')
        ) {
          setProfile(initialProfile);
          localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(initialProfile));
        } else {
          setProfile({
            ...parsed,
            socials: {
              ...initialProfile.socials,
              ...parsed.socials,
              instagram: parsed.socials?.instagram || initialProfile.socials.instagram,
            },
          });
        }
      }

      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (storedProjects) {
        const parsed = JSON.parse(storedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const enriched: Project[] = parsed.map((item: Project): Project => {
            const match = initialProjects.find((i) => i.id === item.id);
            return {
              ...item,
              overview: item.overview || match?.overview,
              features: item.features && item.features.length > 0 ? item.features : match?.features,
              role: item.role || match?.role,
              client: item.client || match?.client,
              deliverables: item.deliverables && item.deliverables.length > 0 ? item.deliverables : match?.deliverables,
              gallery: item.gallery && item.gallery.length > 0 ? item.gallery : match?.gallery,
            };
          });
          initialProjects.forEach((mItem) => {
            if (!enriched.some((e: Project) => e.id === mItem.id)) {
              enriched.push(mItem);
            }
          });
          setProjects(enriched);
        }
      }

      const storedExperiences = localStorage.getItem(STORAGE_KEYS.EXPERIENCES);
      if (storedExperiences) {
        const parsed = JSON.parse(storedExperiences);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const enriched: ExperienceItem[] = parsed.map((item: ExperienceItem): ExperienceItem => {
            const match = initialExperiences.find((i) => i.id === item.id);
            return {
              ...item,
              logo: item.logo || match?.logo,
              keyPoints: item.keyPoints && item.keyPoints.length > 0 ? item.keyPoints : match?.keyPoints,
            };
          });
          // If stored experiences are older fewer items than mockData, append missing
          initialExperiences.forEach((mItem) => {
            if (!enriched.some((e: ExperienceItem) => e.id === mItem.id)) {
              enriched.push(mItem);
            }
          });
          setExperiences(enriched);
        }
      }

      const storedEducations = localStorage.getItem(STORAGE_KEYS.EDUCATIONS);
      if (storedEducations) {
        const parsed = JSON.parse(storedEducations);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const enriched: EducationItem[] = parsed.map((item: EducationItem): EducationItem => {
            const match = initialEducations.find((i) => i.id === item.id);
            return {
              ...item,
              logo: item.logo || match?.logo,
              keyPoints: item.keyPoints && item.keyPoints.length > 0 ? item.keyPoints : match?.keyPoints,
            };
          });
          // If stored educations are older fewer items than mockData, append missing
          initialEducations.forEach((mItem) => {
            if (!enriched.some((e: EducationItem) => e.id === mItem.id)) {
              enriched.push(mItem);
            }
          });
          setEducations(enriched);
        }
      }

      const storedCertificates = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
      if (storedCertificates) setCertificates(JSON.parse(storedCertificates));

      const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (storedMessages) setMessages(JSON.parse(storedMessages));

      const storedReadIds = localStorage.getItem('portfolio_read_msg_ids');
      if (storedReadIds) setReadMessageIds(JSON.parse(storedReadIds));
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Load entire portfolio data from Supabase (Profile, Services, Tools, Projects, Experience, Education, Certs, Messages)
  useEffect(() => {
    async function loadAllSupabaseData() {
      try {
        // 1. Projects
        const { data: pData } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (pData && pData.length > 0) {
          const mapped: Project[] = pData.map((d: any) => ({
            id: d.id,
            title: d.title,
            description: d.description,
            tags: d.tags || [],
            category: d.category,
            imageUrl: d.image_url || '',
            liveUrl: d.live_url || '',
            githubUrl: d.github_url || '',
            featured: Boolean(d.featured),
            createdAt: d.created_at ? d.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            overview: d.overview,
            role: d.role,
            client: d.client,
            features: d.features || [],
            deliverables: d.deliverables || [],
            gallery: d.gallery || [],
          }));
          setProjects(mapped);
        }

        // 2. Profile
        const { data: profData } = await supabase
          .from('profile')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (profData) {
          const custom = profData.socials?._customization || {};
          if (Array.isArray(custom.readMessageIds)) {
            setReadMessageIds(custom.readMessageIds);
          }
          setProfile({
            name: profData.name || initialProfile.name,
            role: profData.role || initialProfile.role,
            avatarUrl: profData.avatar_url || initialProfile.avatarUrl,
            headline: profData.headline || initialProfile.headline,
            bio: profData.bio || initialProfile.bio,
            location: profData.location || initialProfile.location,
            availableForWork: Boolean(profData.available_for_work),
            socials: profData.socials || initialProfile.socials,
            hero: profData.hero || custom.hero || initialProfile.hero,
            about: profData.about || custom.about || initialProfile.about,
            servicesConfig: profData.services_config || custom.servicesConfig || initialProfile.servicesConfig,
            smtp: profData.smtp || custom.smtp || undefined,
          });
        }

        // 3. Services
        const { data: servData } = await supabase
          .from('services')
          .select('*')
          .order('sort_order', { ascending: true });

        const DEFAULT_THEMES = ['purple', 'rose', 'sky', 'emerald', 'amber'];

        if (servData && servData.length > 0) {
          setServices(
            servData.map((s: any, idx: number) => {
              let iconName = s.icon || 'Laptop';
              let themeName = s.theme;
              if (iconName.includes('::')) {
                const parts = iconName.split('::');
                iconName = parts[0];
                themeName = parts[1];
              }
              return {
                id: s.id,
                title: s.title,
                icon: iconName,
                description: s.description || '',
                bullets: s.bullets || [],
                theme: themeName || DEFAULT_THEMES[idx % DEFAULT_THEMES.length],
              };
            })
          );
        }

        // 4. Tools
        const { data: toolData } = await supabase
          .from('tool_categories')
          .select('*')
          .order('sort_order', { ascending: true });

        if (toolData && toolData.length > 0) {
          setTools(
            toolData.map((t: any) => ({
              category: t.category,
              items: t.items || [],
            }))
          );
        }

        // 5. Experiences
        const { data: expData } = await supabase
          .from('experiences')
          .select('*')
          .order('sort_order', { ascending: true });

        if (expData && expData.length > 0) {
          setExperiences(
            expData.map((e: any) => ({
              id: e.id,
              role: e.role,
              company: e.company,
              period: e.period,
              description: e.description,
              technologies: e.technologies || [],
              keyPoints: e.key_points || [],
            }))
          );
        }

        // 6. Educations
        const { data: eduData } = await supabase
          .from('educations')
          .select('*')
          .order('sort_order', { ascending: true });

        if (eduData && eduData.length > 0) {
          setEducations(
            eduData.map((ed: any) => ({
              id: ed.id,
              degree: ed.degree,
              institution: ed.institution,
              period: ed.period,
              description: ed.description,
              keyPoints: ed.key_points || [],
            }))
          );
        }

        // 7. Certificates
        const { data: certData } = await supabase
          .from('certificates')
          .select('*')
          .order('sort_order', { ascending: true });

        if (certData && certData.length > 0) {
          setCertificates(
            certData.map((c: any) => ({
              id: c.id,
              title: c.title,
              issuer: c.issuer,
              date: c.date,
              imageUrl: c.image_url,
              credentialUrl: c.credential_url,
              skills: c.skills || [],
            }))
          );
        }

        // 8. Messages
        const { data: msgData } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        const custom = profData?.socials?._customization || {};
        const savedReadIds: string[] = Array.isArray(custom.readMessageIds) ? custom.readMessageIds : [];
        const savedDeletedIds: string[] = Array.isArray(custom.deletedMessageIds) ? custom.deletedMessageIds : [];

        if (msgData && msgData.length > 0) {
          const filtered = msgData
            .filter((m: any) => !savedDeletedIds.includes(m.id))
            .map((m: any) => ({
              id: m.id,
              name: m.name,
              email: m.email,
              message: m.message,
              read: Boolean(m.read) || savedReadIds.includes(m.id),
              createdAt: m.created_at,
            }));
          setMessages(filtered);
        } else {
          setMessages((prev) =>
            prev
              .filter((m) => !savedDeletedIds.includes(m.id))
              .map((m) => ({
                ...m,
                read: Boolean(m.read) || savedReadIds.includes(m.id),
              }))
          );
        }
      } catch (err) {
        console.warn('Could not load complete data from Supabase:', err);
      }
    }

    loadAllSupabaseData();
  }, []);

  // Save to localStorage whenever state changes after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error(e);
    }
  }, [projects, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(experiences));
    } catch (e) {
      console.error(e);
    }
  }, [experiences, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.EDUCATIONS, JSON.stringify(educations));
    } catch (e) {
      console.error(e);
    }
  }, [educations, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certificates));
    } catch (e) {
      console.error(e);
    }
  }, [certificates, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages, isHydrated]);

  const updateProfile = (updated: Partial<ProfileInfo>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      const socialsWithCustom = {
        ...(next.socials || {}),
        _customization: {
          hero: next.hero,
          about: next.about,
          servicesConfig: next.servicesConfig,
          smtp: next.smtp,
        },
      };

      supabase
        .from('profile')
        .upsert({
          id: 'main',
          name: next.name,
          role: next.role,
          avatar_url: next.avatarUrl,
          headline: next.headline,
          bio: next.bio,
          location: next.location,
          available_for_work: next.availableForWork,
          socials: socialsWithCustom,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase update profile error:', error.message);
        });
      return next;
    });
  };

  const addService = async (serviceData: Omit<ServiceItem, 'id'>) => {
    const newId = `serv-${Date.now()}`;
    const cleanIcon = (serviceData.icon || 'Laptop').split('::')[0];
    const theme = serviceData.theme || 'purple';
    const iconWithTheme = `${cleanIcon}::${theme}`;

    const newServ: ServiceItem = {
      ...serviceData,
      id: newId,
      icon: cleanIcon,
      theme,
    };
    setServices((prev) => [...prev, newServ]);

    try {
      await supabase.from('services').insert([
        {
          id: newId,
          title: newServ.title,
          icon: iconWithTheme,
          description: newServ.description,
          bullets: newServ.bullets,
          sort_order: services.length + 1,
        },
      ]);
    } catch (e) {
      console.warn('Supabase addService error:', e);
    }
  };

  const updateService = async (id: string, updated: Partial<ServiceItem>) => {
    const cleanIcon = updated.icon ? updated.icon.split('::')[0] : undefined;
    const targetTheme = updated.theme;

    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newTheme = targetTheme || s.theme || 'purple';
          const newIcon = cleanIcon || s.icon || 'Laptop';
          return { ...s, ...updated, icon: newIcon, theme: newTheme };
        }
        return s;
      })
    );

    const currentServ = services.find((s) => s.id === id);
    const resolvedTheme = targetTheme || currentServ?.theme || 'purple';
    const resolvedIcon = cleanIcon || currentServ?.icon || 'Laptop';
    const iconWithTheme = `${resolvedIcon}::${resolvedTheme}`;

    try {
      await supabase
        .from('services')
        .update({
          title: updated.title,
          icon: iconWithTheme,
          description: updated.description,
          bullets: updated.bullets,
        })
        .eq('id', id);
    } catch (e) {
      console.warn('Supabase updateService error:', e);
    }
  };

  const deleteService = async (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));

    try {
      await supabase.from('services').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteService error:', e);
    }
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProj: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) => [newProj, ...prev]);
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, ...updated } : proj))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id));
  };

  const addExperience = (expData: Omit<ExperienceItem, 'id'>) => {
    const newExp: ExperienceItem = {
      ...expData,
      id: `exp-${Date.now()}`,
    };
    setExperiences((prev) => [newExp, ...prev]);
    supabase
      .from('experiences')
      .insert([
        {
          id: newExp.id,
          role: newExp.role,
          company: newExp.company,
          period: newExp.period,
          description: newExp.description,
          technologies: newExp.technologies || [],
          key_points: newExp.keyPoints || [],
        },
      ])
      .then(({ error }) => {
        if (error) console.warn('Supabase insert experience error:', error.message);
      });
  };

  const updateExperience = (id: string, updated: Partial<ExperienceItem>) => {
    setExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...updated } : exp))
    );
    supabase
      .from('experiences')
      .update({
        role: updated.role,
        company: updated.company,
        period: updated.period,
        description: updated.description,
        technologies: updated.technologies,
        key_points: updated.keyPoints,
      })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('Supabase update experience error:', error.message);
      });
  };

  const deleteExperience = (id: string) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    supabase
      .from('experiences')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('Supabase delete experience error:', error.message);
      });
  };

  const addEducation = (eduData: Omit<EducationItem, 'id'>) => {
    const newEdu: EducationItem = {
      ...eduData,
      id: `edu-${Date.now()}`,
    };
    setEducations((prev) => [newEdu, ...prev]);
    supabase
      .from('educations')
      .insert([
        {
          id: newEdu.id,
          degree: newEdu.degree,
          institution: newEdu.institution,
          period: newEdu.period,
          description: newEdu.description,
          key_points: newEdu.keyPoints || [],
        },
      ])
      .then(({ error }) => {
        if (error) console.warn('Supabase insert education error:', error.message);
      });
  };

  const updateEducation = (id: string, updated: Partial<EducationItem>) => {
    setEducations((prev) =>
      prev.map((edu) => (edu.id === id ? { ...edu, ...updated } : edu))
    );
    supabase
      .from('educations')
      .update({
        degree: updated.degree,
        institution: updated.institution,
        period: updated.period,
        description: updated.description,
        key_points: updated.keyPoints,
      })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('Supabase update education error:', error.message);
      });
  };

  const deleteEducation = (id: string) => {
    setEducations((prev) => prev.filter((edu) => edu.id !== id));
    supabase
      .from('educations')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('Supabase delete education error:', error.message);
      });
  };

  const addCertificate = (certData: Omit<CertificateItem, 'id'>) => {
    const newCert: CertificateItem = {
      ...certData,
      id: `cert-${Date.now()}`,
    };
    setCertificates((prev) => [...prev, newCert]);
    supabase
      .from('certificates')
      .insert([
        {
          id: newCert.id,
          title: newCert.title,
          issuer: newCert.issuer,
          date: newCert.date,
          image_url: newCert.imageUrl || '',
          credential_url: newCert.credentialUrl || '',
          skills: newCert.skills || [],
          sort_order: certificates.length + 1,
        },
      ])
      .then(({ error }) => {
        if (error) console.warn('Supabase insert certificate error:', error.message);
      });
  };

  const updateCertificate = (id: string, updated: Partial<CertificateItem>) => {
    setCertificates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    supabase
      .from('certificates')
      .update({
        title: updated.title,
        issuer: updated.issuer,
        date: updated.date,
        image_url: updated.imageUrl,
        credential_url: updated.credentialUrl,
        skills: updated.skills,
      })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('Supabase update certificate error:', error.message);
      });
  };

  const deleteCertificate = (id: string) => {
    setCertificates((prev) => prev.filter((c) => c.id !== id));
    supabase
      .from('certificates')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('Supabase delete certificate error:', error.message);
      });
  };

  const sendMessage = async ({ name, email, message }: { name: string; email: string; message: string }) => {
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [newMsg, ...prev]);

    // Send through API route (handles both Supabase persistence and SMTP email dispatch)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!data.success) {
        console.warn('Contact API response:', data);
      }
    } catch (err) {
      console.warn('Could not post to /api/contact, attempting direct Supabase fallback:', err);
      try {
        await supabase.from('messages').insert([{ name, email, message }]);
      } catch (e) {
        console.warn('Supabase fallback error:', e);
      }
    }
  };

  const markMessageRead = async (id: string, read = true) => {
    // 1. Update in-memory messages state
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read } : msg))
    );

    // 2. Update readMessageIds list and persist to Supabase & localStorage
    setReadMessageIds((prev) => {
      const next = read
        ? Array.from(new Set([...prev, id]))
        : prev.filter((x) => x !== id);

      try {
        localStorage.setItem('portfolio_read_msg_ids', JSON.stringify(next));
      } catch (e) {}

      // Persist into Supabase profile table (_customization.readMessageIds)
      setProfile((curProf) => {
        const curSocials = curProf.socials || {};
        const curCustom = curSocials._customization || {};
        const updatedSocials = {
          ...curSocials,
          _customization: {
            ...curCustom,
            readMessageIds: next,
          },
        };

        supabase
          .from('profile')
          .upsert({
            id: 'main',
            name: curProf.name,
            role: curProf.role,
            avatar_url: curProf.avatarUrl,
            headline: curProf.headline,
            bio: curProf.bio,
            location: curProf.location,
            available_for_work: curProf.availableForWork,
            socials: updatedSocials,
            updated_at: new Date().toISOString(),
          })
          .then(({ error }) => {
            if (error) console.warn('Supabase mark read error:', error.message);
          });

        return {
          ...curProf,
          socials: updatedSocials,
        };
      });

      return next;
    });

    // 3. Also update direct Supabase messages table if UUID
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      try {
        await supabase.from('messages').update({ read }).eq('id', id);
      } catch (e) {
        console.warn('Supabase mark read table error:', e);
      }
    }
  };

  const deleteMessage = async (id: string) => {
    // 1. Remove from in-memory messages
    setMessages((prev) => prev.filter((msg) => msg.id !== id));

    // 2. Persist deleted ID to Supabase profile
    setProfile((curProf) => {
      const curSocials = curProf.socials || {};
      const curCustom = curSocials._customization || {};
      const curDeleted: string[] = Array.isArray(curCustom.deletedMessageIds) ? curCustom.deletedMessageIds : [];
      const nextDeleted = Array.from(new Set([...curDeleted, id]));

      const updatedSocials = {
        ...curSocials,
        _customization: {
          ...curCustom,
          deletedMessageIds: nextDeleted,
        },
      };

      supabase
        .from('profile')
        .upsert({
          id: 'main',
          name: curProf.name,
          role: curProf.role,
          avatar_url: curProf.avatarUrl,
          headline: curProf.headline,
          bio: curProf.bio,
          location: curProf.location,
          available_for_work: curProf.availableForWork,
          socials: updatedSocials,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase delete message error:', error.message);
        });

      return {
        ...curProf,
        socials: updatedSocials,
      };
    });

    // 3. Also delete from direct Supabase messages table if UUID
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      try {
        await supabase.from('messages').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete message error:', e);
      }
    }
  };

  const resetToDefaults = () => {
    setProfile(initialProfile);
    setProjects(initialProjects);
    setExperiences(initialExperiences);
    setEducations(initialEducations);
    setCertificates(initialCertificates);
    setMessages(initialMessages);
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      localStorage.removeItem(STORAGE_KEYS.EXPERIENCES);
      localStorage.removeItem(STORAGE_KEYS.EDUCATIONS);
      localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        updateProfile,
        services,
        addService,
        updateService,
        deleteService,
        tools,
        projects,
        addProject,
        updateProject,
        deleteProject,
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
        messages,
        readMessageIds,
        sendMessage,
        markMessageRead,
        deleteMessage,
        resetToDefaults,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
