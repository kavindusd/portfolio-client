export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  dribbble?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  _customization?: any;
}

export interface HeroSectionContent {
  greeting?: string;      // e.g. "Hey, I'm"
  rolePrefix?: string;    // e.g. "A"
  tagline?: string;       // e.g. "A web developer with solid foundations in design."
  cvUrl?: string;         // URL to uploaded CV PDF or file
}

export interface AboutSectionContent {
  badge?: string;         // e.g. "About Me"
  heading?: string;       // e.g. "Passionate about crafting digital experiences that make an impact."
  intro?: string;         // e.g. "Hi, I'm Kavindu — a dedicated web developer..."
  paragraph1?: string;    // e.g. "With solid expertise across modern frontend architecture..."
  paragraph2?: string;    // e.g. "Whether translating Figma prototypes into responsive, accessible code..."
  stat1Value?: string;    // e.g. "3+"
  stat1Label?: string;    // e.g. "Years Coding Experience"
  stat2Value?: string;    // e.g. "25+"
  stat2Label?: string;    // e.g. "Applications Built"
  stat3Value?: string;    // e.g. "100%"
  stat3Label?: string;    // e.g. "Client & Project Commitment"
  quote?: string;         // e.g. "Great software isn't just about writing code..."
  photoUrl?: string;      // circular image URL
}

export interface ServicesSectionContent {
  badge?: string;         // e.g. "Services"
  heading?: string;       // e.g. "Building Digital Experiences"
  subtitle?: string;      // e.g. "I specialize in engineering fullstack web applications..."
}

export interface SmtpConfig {
  enabled?: boolean;
  host?: string;
  port?: number;
  secure?: boolean; // true for 465, false for 587
  user?: string;
  pass?: string;
  fromName?: string;
  fromEmail?: string;
  receiverEmail?: string;
  sendAutoReply?: boolean;
}

export interface ProfileInfo {
  name: string;
  role: string;
  avatarUrl: string;
  headline: string;
  bio: string;
  location: string;
  availableForWork: boolean;
  socials: SocialLinks;
  hero?: HeroSectionContent;
  about?: AboutSectionContent;
  servicesConfig?: ServicesSectionContent;
  smtp?: SmtpConfig;
}

export interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  bullets: string[];
  theme?: 'purple' | 'rose' | 'sky' | 'emerald' | 'amber' | 'indigo';
}

export interface ToolCategory {
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: 'Fullstack' | 'Frontend' | 'Mobile' | 'Design';
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
  overview?: string;
  role?: string;
  client?: string;
  features?: string[];
  deliverables?: string[];
  gallery?: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  technologies?: string[];
  logo?: string;
  keyPoints?: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description?: string;
  logo?: string;
  keyPoints?: string[];
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
  credentialUrl?: string;
  skills?: string[];
}
