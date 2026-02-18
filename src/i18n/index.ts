import en from './translations/en.json';
import es from './translations/es.json';

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
