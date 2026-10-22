export interface HeroContent {
  eyebrow: string;
  name: string;
  subtitle: string;
  taglinePrimary: string;
  taglineSecondary: string;
  ctaLabel: string;
  ctaLink: string;
  hudLocation: string;
  hudTimezone: string;
}

export interface AboutContent {
  title: string;
  leadParagraph: string;
  bioParagraph: string;
  focusAreas: string[];
  skills: {
    category: string;
    items: string[];
  }[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  technologies: string[];
  metrics: string;
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface CareerItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  summary: string;
  achievements: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  date: string;
  issuer: string;
  description: string;
  metric?: string;
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  projects: ProjectItem[];
  career: CareerItem[];
  achievements: AchievementItem[];
}
