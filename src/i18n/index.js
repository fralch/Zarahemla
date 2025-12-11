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
  let locale = Localization.getLocales()[0].languageCode;

  // Fallback to Spanish if the device language is not English
  if (locale !== 'en') {
    locale = 'es';
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: locale, // Use device language
      fallbackLng: 'es', // Default to Spanish if language not found
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });
};

initI18n();

export default i18n;
