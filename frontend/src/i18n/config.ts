import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEs from './locales/es/common.json';
import commonEn from './locales/en/common.json';

/**
 * i18n configuration
 * Supports Spanish (default) and English
 */

const resources = {
  es: {
    common: commonEs,
  },
  en: {
    common: commonEn,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'es', // Default language
  fallbackLng: 'es',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false, // React already escapes
  },
  react: {
    useSuspense: true,
  },
});

export default i18n;
