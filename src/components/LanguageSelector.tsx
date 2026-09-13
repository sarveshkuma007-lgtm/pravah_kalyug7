import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { SUPPORTED_LANGUAGES } from '../utils/constants';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full';
  id?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'compact', id = 'language-selector' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div id={id} ref={dropdownRef} className="relative inline-block text-left">
      <button
        id={`${id}-btn`}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-950/50 hover:bg-sky-900/50 border border-sky-500/20 text-sky-200 text-xs font-medium transition-all hover:border-sky-400/40 cursor-pointer shadow-sm"
        title="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-semibold tracking-wide">{currentLang.nativeName}</span>
        {variant === 'full' && <span className="text-slate-400">({currentLang.name})</span>}
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          id={`${id}-dropdown`}
          className="absolute right-0 mt-2 w-56 max-h-72 overflow-y-auto rounded-xl bg-[#0a1628] border border-cyan-500/30 shadow-2xl py-1 z-50 backdrop-blur-xl"
        >
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-cyan-400 border-b border-sky-900/40">
            Select Indian Language / भाषा
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                id={`${id}-option-${lang.code}`}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-300 hover:bg-sky-950/60 hover:text-white'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{lang.nativeName}</span>
                  <span className="text-[10px] text-slate-400">{lang.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
