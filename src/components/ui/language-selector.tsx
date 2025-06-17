
import React, { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { Button } from "./button";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
];

export const LanguageSelector = () => {
  const [currentLang, setCurrentLang] = useState<Language>(languages[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">{currentLang.flag} {currentLang.name}</span>
        <ChevronDown className="w-4 h-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setCurrentLang(lang);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
            >
              <span>{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
