import en from './translations/en.json';
import es from './translations/es.json';

const translations = { en, es } as const;

export type Lang = keyof typeof translations;
export type TranslationKeys = typeof en;

export const languages: Record<Lang, string> = {
  en: 'English',
  es: 'Español',
};

export const defaultLang: Lang = 'en';

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
