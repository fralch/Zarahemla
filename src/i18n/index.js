import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './en.json';
import es from './es.json';

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};

const initI18n = async () => {
  // Default to Spanish as requested
  let locale = 'es';

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: locale, // Start in Spanish
      fallbackLng: 'es',
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();

export default i18n;
