// https://dev.to/adrai/how-to-properly-internationalize-a-react-application-using-i18next-3hdb
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from 'locales/en.json';
import ru from 'locales/ru.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    ns: ['common', 'home'],
    defaultNS: 'common',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: { en, ru },
  });

export default i18n;
