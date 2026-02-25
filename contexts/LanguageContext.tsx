'use client';

import React, { createContext, useContext, useState } from 'react';
import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';

type Language = 'en' | 'ar';
type Translations = typeof enTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  const translations: Record<Language, Translations> = {
    en: enTranslations,
    ar: arTranslations,
  };

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      <div
        dir={language === 'ar' ? 'rtl' : 'ltr'}
        className={language === 'ar' ? 'font-noto-arabic' : ''}
        style={language === 'ar' ? { fontFamily: 'var(--font-noto-sans-arabic)' } : undefined}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
