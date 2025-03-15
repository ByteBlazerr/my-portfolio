
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define supported languages
export type Language = 'ru' | 'en' | 'uz';

// Define content type for multi-language support
export type MultiLangContent = {
  [key in Language]: string;
};

// Context state
interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (content: MultiLangContent) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ru');

  // Translation helper
  const t = (content: MultiLangContent): string => {
    return content[language] || content.en; // Fallback to English
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for easy context access
export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};
