'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
];

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const current = LANGUAGES.find((l) => l.code === currentLocale) ?? LANGUAGES[0];

  const switchLocale = (code: string) => {
    const segments = pathname.split('/');
    const locales = ['en', 'te', 'hi', 'or'];
    if (locales.includes(segments[1])) {
      segments[1] = code;
    } else {
      segments.splice(1, 0, code);
    }
    router.push(segments.join('/'));
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/70 text-sm font-body hover:border-[#D4AF37]/40 transition-colors"
      >
        <span>{current.flag}</span>
        <span>{current.native}</span>
        <span className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-[#1a1a1a] overflow-hidden z-50 shadow-xl"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLocale(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-body hover:bg-white/5 transition-colors ${
                  lang.code === currentLocale ? 'text-[#D4AF37]' : 'text-white/70'
                }`}
              >
                <span>{lang.flag}</span>
                <div>
                  <p className={lang.code === currentLocale ? 'text-[#D4AF37]' : 'text-white/80'}>
                    {lang.native}
                  </p>
                  <p className="text-white/30 text-xs">{lang.label}</p>
                </div>
                {lang.code === currentLocale && <span className="ml-auto text-[#D4AF37] text-xs">✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
