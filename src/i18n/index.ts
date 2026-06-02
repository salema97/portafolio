import aboutEn from './locales/en/about.json';
import certificationsEn from './locales/en/certifications.json';
import contactEn from './locales/en/contact.json';
import experienceEn from './locales/en/experience.json';
import footerEn from './locales/en/footer.json';
import heroEn from './locales/en/hero.json';
import navEn from './locales/en/nav.json';
import projectsEn from './locales/en/projects.json';
import siteEn from './locales/en/site.json';
import skillsEn from './locales/en/skills.json';
import statsEn from './locales/en/stats.json';
import sectionsEn from './locales/en/sections.json';

import aboutEs from './locales/es/about.json';
import certificationsEs from './locales/es/certifications.json';
import contactEs from './locales/es/contact.json';
import experienceEs from './locales/es/experience.json';
import footerEs from './locales/es/footer.json';
import heroEs from './locales/es/hero.json';
import navEs from './locales/es/nav.json';
import projectsEs from './locales/es/projects.json';
import siteEs from './locales/es/site.json';
import skillsEs from './locales/es/skills.json';
import statsEs from './locales/es/stats.json';
import sectionsEs from './locales/es/sections.json';

const en = {
  site: siteEn,
  sections: sectionsEn,
  nav: navEn,
  hero: heroEn,
  about: aboutEn,
  stats: statsEn,
  experience: experienceEn,
  projects: projectsEn,
  skills: skillsEn,
  certifications: certificationsEn,
  contact: contactEn,
  footer: footerEn,
};

const es = {
  site: siteEs,
  sections: sectionsEs,
  nav: navEs,
  hero: heroEs,
  about: aboutEs,
  stats: statsEs,
  experience: experienceEs,
  projects: projectsEs,
  skills: skillsEs,
  certifications: certificationsEs,
  contact: contactEs,
  footer: footerEs,
};

export type Lang = 'en' | 'es';
export type TranslationKeys = typeof en;

const translations: Record<Lang, TranslationKeys> = { en, es };
const defaultLang: Lang = 'en';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang as Lang;
  return defaultLang;
}

export function getTranslations(lang: Lang): TranslationKeys {
  return translations[lang] ?? translations[defaultLang];
}

export function getAlternateLocaleUrl(url: URL, targetLang: Lang): string {
  const [, currentLang, ...rest] = url.pathname.split('/');
  if (currentLang in translations) {
    return `/${targetLang}/${rest.join('/')}`;
  }
  return `/${targetLang}/`;
}
