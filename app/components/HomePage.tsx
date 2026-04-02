'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { usePradakshinaStore } from '../store';
import PradakshinaStepper from '../modules/pradakshina/PradakshinaStepper';
import SafetyModule from '../modules/safety/SafetyModule';
import LanguageSwitcher from './LanguageSwitcher';

type Tab = 'home' | 'pradakshina' | 'safety' | 'temple';

// ─── Sanskrit Shloka (never translated) ──────────────────────────────────────
const NARASIMHA_SHLOKA = 'उग्रं वीरं महाविष्णुं ज्वलन्तं सर्वतोमुखम्।\nनृसिंहं भीषणं भद्रं मृत्युमृत्युं नमाम्यहम्॥';

// ─── Pre-computed stable positions for gold particles ───────────────────────
const GOLD_DOT_POSITIONS = [
  { left: '5%',  top: '10%' }, { left: '15%', top: '80%' }, { left: '25%', top: '35%' },
  { left: '35%', top: '65%' }, { left: '45%', top: '20%' }, { left: '55%', top: '90%' },
  { left: '65%', top: '50%' }, { left: '75%', top: '15%' }, { left: '85%', top: '75%' },
  { left: '92%', top: '40%' }, { left: '8%',  top: '55%' }, { left: '20%', top: '5%' },
  { left: '30%', top: '95%' }, { left: '40%', top: '45%' }, { left: '50%', top: '70%' },
  { left: '60%', top: '25%' }, { left: '70%', top: '85%' }, { left: '80%', top: '60%' },
  { left: '88%', top: '30%' }, { left: '12%', top: '70%' },
];
const GOLD_DOT_DURATIONS = [3.2, 4.1, 3.7, 5.0, 3.5, 4.4, 3.9, 4.7, 3.3, 4.0, 3.6, 4.2, 5.1, 3.8, 4.5, 3.4, 4.8, 3.1, 4.3, 3.9];

function GoldDot({ delay, index }: { delay: number; index: number }) {
  const pos = GOLD_DOT_POSITIONS[index % GOLD_DOT_POSITIONS.length];
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-[#D4AF37]"
      style={{ left: pos.left, top: pos.top, opacity: 0.4 }}
      animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
      transition={{ delay, duration: GOLD_DOT_DURATIONS[index % GOLD_DOT_DURATIONS.length], repeat: Infinity }}
    />
  );
}

// ─── Crowd level indicator ────────────────────────────────────────────────────
const CROWD_COLORS = { low: '#22c55e', moderate: '#f59e0b', high: '#ef4444' };

// ─── Festival data (module-level) ───────────────────────────────────────────
const festivals = [
  { key: 'chandanotsavam', icon: '🌿', name: 'Chandanotsavam', date: 'Akshaya Tritiya (April/May)', description: 'Festival of sandalwood paste — the deity is bathed in fragrant chandanam.', details: 'Nijaroopa Darshan, lakhs of devotees, sandalwood abhishekam.' },
  { key: 'kalyanotsavam', icon: '💐', name: 'Kalyanotsavam', date: 'Vaishakha Masam', description: 'Celestial wedding celebration of the Lord.', details: 'Celestial wedding, Vedic rituals, divine blessings.' },
  { key: 'giri_pradakshina', icon: '🚶', name: 'Giri Pradakshina', date: 'Ashadha Purnima (July)', description: 'The grand festival of sacred circumambulation — lakhs of devotees participate.', details: '32 KM sacred circumambulation, 5 checkpoints, spiritual merit.' },
  { key: 'narasimha_jayanti', icon: '🦁', name: 'Narasimha Jayanti', date: 'Vaishakha Shukla Chaturdashi', description: 'Appearance day of Lord Narasimha.', details: 'Special pujas, abhishekam, recitation of Narasimha Stotra.' },
  { key: 'pavitrotsavam', icon: '🪔', name: 'Pavitrotsavam', date: 'August', description: 'Ritual purification festival.', details: 'Homams, renewal of temple sanctity, purification ceremonies.' },
  { key: 'navaratri', icon: '🌸', name: 'Navaratri & Vijayadashami', date: 'September/October', description: 'Devi Alankaram, special rituals.', details: 'Nine nights of worship, Devi processions, Vijayadashami celebrations.' },
  { key: 'kartika_deepotsavam', icon: '🪔', name: 'Kartika Deepotsavam', date: 'November', description: 'Lighting of lamps, Kartika Pournami.', details: 'Deepa alankaram, special pujas, Kartika Pournami.' },
  { key: 'vaikuntha_ekadashi', icon: '🔱', name: 'Vaikuntha Ekadashi', date: 'December/January', description: 'Uttara Dwara Darshan, special prayers.', details: 'Ekadashi fasting, Uttara Dwara Darshan, Vishnu Sahasranama Parayanam.' },
  { key: 'makar_sankranti', icon: '🌾', name: 'Makar Sankranti', date: 'January', description: 'Harvest festival, special offerings.', details: 'Pongal, new harvest offerings, special pujas.' },
  { key: 'ugadi', icon: '🥭', name: 'Ugadi', date: 'March/April', description: 'Telugu New Year, new beginnings.', details: 'Panchanga Sravanam, new year pujas, festive prasadam.' },
  { key: 'dola_purnima', icon: '🎡', name: 'Dola Purnima (Dolotsavam)', date: 'Phalguna Purnima (March)', description: 'The swing festival — the deity is ceremonially swung on a decorated swing.', details: 'Utsava vigraha on swing, floral decorations, devotional singing.' },
  { key: 'kamadahana', icon: '🔥', name: 'Kamadahana', date: 'Phalguna Bahula Chaturdashi', description: 'Burning of Kama — the destruction of desire and ego.', details: 'Holi bonfire rituals, burning of Kamadeva effigy, special pujas.' },
  { key: 'teppotsavam', icon: '⛵', name: 'Teppotsavam', date: 'Kartika Masam (November)', description: 'The floating festival — the deity is placed on a decorated float in the temple tank.', details: 'Illuminated float procession, devotional music, lakhs of lamps lit.' },
  { key: 'makaraveta', icon: '🏹', name: 'Makaraveta', date: 'Makara Sankranti (January)', description: 'The sacred hunt festival marking Makara Sankranti at Simhachalam.', details: 'Symbolic hunt ceremony, special abhishekam, festive celebrations.' },
  { key: 'dhanurmasotsava', icon: '🌅', name: 'Dhanurmasotsava', date: 'Dhanur Masam (Dec–Jan)', description: 'Month-long pre-dawn festival with special sevas and alankaram.', details: 'Early morning pujas, Tirupavai recitation, special naivedyam offerings.' },
  { key: 'nitya_kalyanam', icon: '💍', name: 'Nitya Kalyanam', date: 'Daily', description: 'Daily celestial wedding ceremony of the Lord performed every day.', details: 'Daily Kalyana seva, sponsored by devotees, Vedic wedding rituals.' },
  { key: 'swarnapushpa_archana', icon: '🌼', name: 'Swarnapushpa Archana', date: 'Special occasions', description: 'Worship of the Lord with golden flowers — a rare and auspicious seva.', details: 'Gold leaf flowers, recitation of Sahasranama, special alankaram.' },
  { key: 'sahasra_deepalankarana', icon: '🕯️', name: 'Sahasra Deepalankarana Seva', date: 'Kartika Masam (November)', description: 'Illumination of the deity with a thousand lamps in a magnificent display.', details: 'Thousand oil lamps, deepa alankaram, Kartika special seva.' },
];

export default function HomePage({ locale }: { locale: string }) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { pradakshinaStarted, crowdLevels, isOffline } = usePradakshinaStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  // ─── Tab: Pradakshina ──────────────────────────────────────────────────────
  if (activeTab === 'pradakshina') {
    return (
      <div>
        <TopBar locale={locale} onBack={() => setActiveTab('home')} title={t('pradakshina.title')} />
        <PradakshinaStepper />
        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>
    );
  }

  // ─── Tab: Safety ──────────────────────────────────────────────────────────
  if (activeTab === 'safety') {
    return (
      <div>
        <TopBar locale={locale} onBack={() => setActiveTab('home')} title={t('safety.title')} />
        <SafetyModule />
        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>
    );
  }

  // ─── Tab: Temple ──────────────────────────────────────────────────────────
  if (activeTab === 'temple') {
    return (
      <div>
        <TopBar locale={locale} onBack={() => setActiveTab('home')} title={t('temple.title')} />
        <TempleModule />
        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>
    );
  }

  // ─── Home ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0F0F0F] pb-24 lg:pb-8">
      {/* Offline Banner */}
      {isOffline && (
        <div className="offline-banner py-2 px-4 text-center text-xs sm:text-sm font-body text-[#F5E6C8]">
          ⚡ {t('offline.title')} — {t('offline.description')}
        </div>
      )}

      {/* Top bar */}
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-30 bg-[#0F0F0F]/90 backdrop-blur-md border-b border-white/5 max-w-7xl mx-auto w-full">
        <div>
          <p className="text-[#D4AF37] text-xs sm:text-sm tracking-[0.25em] uppercase font-body">Simhachalam</p>
          <p className="text-white/40 text-xs font-body">Visakhapatnam</p>
        </div>
        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-6">
          {[
            { id: 'home' as Tab, label: 'Home' },
            { id: 'pradakshina' as Tab, label: 'Pradakshina' },
            { id: 'safety' as Tab, label: 'Safety' },
            { id: 'temple' as Tab, label: 'Temple' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm font-body transition-colors ${
                activeTab === tab.id ? 'text-[#D4AF37]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <LanguageSwitcher currentLocale={locale} />
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-10 pb-14 max-w-7xl mx-auto">
        {/* Background particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <GoldDot key={i} index={i} delay={i * 0.3} />
          ))}
        </div>

        {/* Decorative ring */}
        <motion.div
          className="absolute right-[-60px] top-[-60px] w-64 h-64 rounded-full border border-[#D4AF37]/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Om symbol */}
            <p className="text-[#D4AF37] text-4xl md:text-5xl lg:text-6xl mb-4 text-center">ॐ</p>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center leading-tight mb-2">
              {t('hero.title')}
            </h1>
            <p className="text-white/50 text-sm sm:text-base lg:text-lg text-center font-body mb-6 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            {/* Sanskrit shloka */}
            <div className="border border-[#D4AF37]/20 rounded-xl p-4 md:p-6 mb-6 bg-[#D4AF37]/5 max-w-xl mx-auto">
              <p className="shloka text-center whitespace-pre-line text-sm md:text-base">
                {NARASIMHA_SHLOKA}
              </p>
            </div>
          </motion.div>

          {/* Primary CTAs */}
          <motion.div
            className="flex gap-3 sm:gap-4 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setActiveTab('pradakshina')}
              className="flex-1 py-4 sm:py-5 rounded-xl font-display font-semibold text-sm sm:text-base tracking-wide text-[#F5E6C8] border border-[#D4AF37]/40 glow-gold transition-all"
              style={{ background: 'linear-gradient(135deg, #7A1C1C, #9b2226)' }}
            >
              🚶 {t('hero.cta_pradakshina')}
            </button>
            <button
              onClick={() => setActiveTab('temple')}
              className="flex-1 py-4 sm:py-5 rounded-xl font-display font-semibold text-sm sm:text-base tracking-wide text-[#D4AF37] border border-[#D4AF37]/20 bg-[#D4AF37]/5"
            >
              🛕 {t('hero.cta_darshan')}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Live status cards */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6 max-w-7xl mx-auto">
        <p className="text-white/40 text-xs sm:text-sm font-body uppercase tracking-wider mb-3">Live Status</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-card p-4">
            <p className="text-white/50 text-xs font-body mb-1">Pradakshina Status</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${pradakshinaStarted ? 'bg-emerald-400' : 'bg-white/20'}`} />
              <p className="text-white font-display font-semibold text-sm">
                {pradakshinaStarted ? 'In Progress' : 'Not Started'}
              </p>
            </div>
          </div>
          <div className="glass-card p-4">
            <p className="text-white/50 text-xs font-body mb-1">Crowd at Temple</p>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CROWD_COLORS[(crowdLevels.final_steps as 'low' | 'moderate' | 'high') ?? 'moderate'] }}
              />
              <p className="text-white font-display font-semibold text-sm capitalize">
                {crowdLevels.final_steps ?? 'Moderate'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick feature grid */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6 max-w-7xl mx-auto">
        <p className="text-white/40 text-xs sm:text-sm font-body uppercase tracking-wider mb-3">Pilgrim Services</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: '🗺️', title: 'Route Guide', desc: '32 KM step-by-step', tab: 'pradakshina' as Tab },
            { icon: '🆔', title: 'RFID Safety', desc: 'Pilgrim tracking', tab: 'safety' as Tab },
            { icon: '🪔', title: 'Ritual Guide', desc: 'Agama-based guidance', tab: 'pradakshina' as Tab },
            { icon: '🚨', title: 'Emergency', desc: 'Help & contacts', tab: 'safety' as Tab },
          ].map((item) => (
            <motion.button
              key={item.title}
              onClick={() => setActiveTab(item.tab)}
              className="glass-card p-4 sm:p-5 text-left"
              whileTap={{ scale: 0.97 }}
            >
              <p className="text-2xl sm:text-3xl mb-2">{item.icon}</p>
              <p className="text-white font-display font-semibold text-sm sm:text-base">{item.title}</p>
              <p className="text-white/40 text-xs sm:text-sm font-body mt-0.5">{item.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Festivals banner */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div
          className="rounded-2xl p-5 sm:p-6 lg:p-8 border border-[#D4AF37]/20 overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #1a1208 0%, #0F0F0F 100%)' }}
        >
          <p className="text-[#D4AF37] text-xs sm:text-sm uppercase tracking-wider font-body mb-2">Upcoming Festival</p>
          <h3 className="font-display text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">Chandanotsavam</h3>
          <p className="text-white/50 text-sm sm:text-base font-body max-w-2xl">
            The sacred sandalwood festival — darshan of the deity bathed in fragrant chandanam.
          </p>
        </div>
      </div>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

// ─── Top bar for inner pages ──────────────────────────────────────────────────
function TopBar({ locale, onBack, title }: { locale: string; onBack: () => void; title: string }) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-30 bg-[#0F0F0F]/90 backdrop-blur-md border-b border-white/5 max-w-7xl mx-auto w-full">
      <button onClick={onBack} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/60 text-sm">
        ←
      </button>
      <p className="font-display font-semibold text-white text-base sm:text-lg lg:text-xl">{title}</p>
      <LanguageSwitcher currentLocale={locale} />
    </div>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────
function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs = [
    { id: 'home' as Tab, icon: '🏠', label: 'Home' },
    { id: 'pradakshina' as Tab, icon: '🚶', label: 'Pradakshina' },
    { id: 'safety' as Tab, icon: '🆔', label: 'Safety' },
    { id: 'temple' as Tab, icon: '🛕', label: 'Temple' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F0F0F]/95 backdrop-blur-md border-t border-white/5 safe-bottom lg:hidden">
      <div className="flex max-w-md sm:max-w-lg mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
              active === tab.id ? 'text-[#D4AF37]' : 'text-white/30'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-body">{tab.label}</span>
            {active === tab.id && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute bottom-0 w-8 h-0.5 bg-[#D4AF37] rounded-full"
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Temple Module (inline) ───────────────────────────────────────────────────
function TempleModule() {
  const t = useTranslations('temple');
  const [story, setStory] = useState(false);
  const [expandedFestival, setExpandedFestival] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white px-4 sm:px-6 lg:px-8 py-8 max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full">
      {/* Moola Virat */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 sm:p-6 lg:p-8 mb-5"
      >
        <p className="text-[#D4AF37] text-xs sm:text-sm uppercase tracking-wider font-body mb-2">Moola Virat</p>
        <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">{t('moola_virat.title')}</h2>
        <p className="text-white/60 text-sm sm:text-base font-body leading-relaxed mb-3">{t('moola_virat.chandanam')}</p>
        <div className="border border-[#D4AF37]/20 rounded-lg p-3 bg-[#D4AF37]/5">
          <p className="text-[#F5E6C8] text-xs font-body leading-relaxed">
            ✨ <span className="text-[#D4AF37] font-semibold">Nijaroopa Darshan:</span> {t('moola_virat.nijaroopa')}
          </p>
        </div>
      </motion.div>

      {/* Sacred Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-5 mb-5"
      >
        <p className="text-[#D4AF37] text-xs uppercase tracking-wider font-body mb-2">Sacred Story</p>
        <h2 className="font-display text-xl font-bold text-white mb-3">{t('story.prahlada')}</h2>
        <p className="text-white/60 text-sm font-body leading-relaxed mb-4">{t('story.description')}</p>
        <button
          onClick={() => setStory(!story)}
          className="w-full py-3 rounded-xl border border-[#7A1C1C]/50 text-[#F5E6C8] text-sm font-body bg-[#7A1C1C]/20"
        >
          {story ? 'Hide Story' : '📖 Read Full Story'}
        </button>
        {story && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-4 text-white/60 text-sm font-body leading-relaxed space-y-3"
          >
            <p>Prahlada, the son of demon king Hiranyakashipu, was an ardent devotee of Lord Vishnu. Enraged by his son's devotion, Hiranyakashipu attempted to kill Prahlada through various means — all failed due to divine protection.</p>
            <p>In his final challenge, Hiranyakashipu struck a pillar and demanded: "Is your Vishnu in this pillar?" At that moment, Lord Narasimha — half-man, half-lion — emerged from the pillar to vanquish the demon and protect his devotee.</p>
            <p>The Simhachalam Temple enshrines this manifestation — Lord Varaha Lakshmi Narasimha Swamy — in eternal grace.</p>
            <p className="shloka text-center pt-2">ॐ नमो भगवते नरसिंहाय</p>
          </motion.div>
        )}
      </motion.div>

      {/* Festivals (button style) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      >
        <p className="text-white/40 text-xs sm:text-sm uppercase tracking-wider font-body mb-3">{t('festivals.title')}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {festivals.map((festival) => (
            <button
              key={festival.key}
              type="button"
              onClick={() => setExpandedFestival(expandedFestival === festival.key ? null : festival.key)}
              className="glass-card flex flex-col items-start border-2 border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all rounded-2xl shadow-lg bg-[#D4AF37]/5 cursor-pointer p-3 w-full text-left"
            >
              {expandedFestival === festival.key ? (
                <>
                  <span className="text-2xl mb-2">{festival.icon}</span>
                  <h3 className="font-display font-bold text-white text-base mb-1">{festival.name}</h3>
                  <p className="text-[#D4AF37] text-xs font-body mb-1 font-semibold">{festival.date}</p>
                  <p className="text-white/60 text-xs font-body mb-1">{festival.description}</p>
                  <p className="text-white/40 text-xs font-body">{festival.details}</p>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xl">{festival.icon}</span>
                  <h3 className="font-display font-bold text-white text-sm leading-tight">{festival.name}</h3>
                </div>
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
