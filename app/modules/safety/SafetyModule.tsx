'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSafetyStore } from '../../store';

export default function SafetyModule() {
  const { pilgrims, registerPilgrim, searchPilgrim, searchResults, searchQuery } = useSafetyStore();
  const [tab, setTab] = useState<'register' | 'search' | 'emergency'>('register');
  const [form, setForm] = useState({ name: '', phone: '', lastLocation: 'Tolipavancham', routeSection: 'Section 1' });
  const [registered, setRegistered] = useState<string | null>(null);

  const handleRegister = () => {
    if (!form.name || !form.phone) return;
    const rfidId = `SIM-${Date.now().toString().slice(-6)}`;
    registerPilgrim({ rfidId, name: form.name, phone: form.phone, lastLocation: form.lastLocation, routeSection: form.routeSection });
    setRegistered(rfidId);
    setForm({ name: '', phone: '', lastLocation: 'Tolipavancham', routeSection: 'Section 1' });
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white px-4 sm:px-6 lg:px-8 py-8 max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full">
      <div className="mb-8 text-center">
        <p className="text-[#D4AF37] text-xs sm:text-sm tracking-[0.3em] uppercase mb-2">Simhachalam Temple</p>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Pilgrim Safety</h1>
        <p className="text-white/40 text-sm sm:text-base mt-1">RFID-based tracking & emergency assistance</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-8 max-w-lg mx-auto">
        {(['register', 'search', 'emergency'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-body rounded-lg capitalize transition-all ${
              tab === t ? 'bg-[#7A1C1C] text-white' : 'text-white/50'
            }`}
          >
            {t === 'register' ? '📋 Register' : t === 'search' ? '🔍 Find' : '🚨 Emergency'}
          </button>
        ))}
      </div>

      {/* Register tab */}
      {tab === 'register' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="space-y-4 max-w-lg mx-auto">
            <div>
              <label className="text-white/60 text-xs font-body uppercase tracking-wider mb-2 block">
                Pilgrim Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter full name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs font-body uppercase tracking-wider mb-2 block">
                Emergency Contact
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <motion.button
              onClick={handleRegister}
              className="w-full py-4 rounded-xl font-display font-semibold text-sm tracking-wide bg-[#7A1C1C] border border-[#D4AF37]/30 text-[#F5E6C8]"
              whileTap={{ scale: 0.97 }}
            >
              Generate RFID Tag
            </motion.button>

            {registered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-[#D4AF37]/40 rounded-xl p-4 bg-[#D4AF37]/5 text-center"
              >
                <p className="text-white/60 text-xs font-body mb-1">RFID ID Assigned</p>
                <p className="text-[#D4AF37] font-display font-bold text-xl">{registered}</p>
                <p className="text-white/40 text-xs font-body mt-1">Show this to temple volunteers</p>
              </motion.div>
            )}

            {/* Registered count */}
            <div className="text-center text-white/30 text-xs font-body">
              {pilgrims.length} pilgrims currently registered
            </div>
          </div>
        </motion.div>
      )}

      {/* Search / Missing person tab */}
      {tab === 'search' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => searchPilgrim(e.target.value)}
            placeholder="Search by RFID ID or name..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50 mb-4"
          />

          {searchQuery && searchResults.length === 0 && (
            <div className="text-center text-white/40 text-sm font-body py-8">
              No pilgrim found with that ID or name.
            </div>
          )}

          <div className="space-y-3">
            {(searchQuery ? searchResults : pilgrims).map((pilgrim) => (
              <div
                key={pilgrim.rfidId}
                className="border border-white/10 rounded-xl p-4 bg-white/3"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-white text-base">{pilgrim.name}</h3>
                    <p className="text-[#D4AF37] text-xs font-body mt-0.5">{pilgrim.rfidId}</p>
                  </div>
                  <span className="text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 text-xs px-2 py-1 rounded-full font-body">
                    Tracked
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Last Location', value: pilgrim.lastLocation },
                    { label: 'Route Section', value: pilgrim.routeSection },
                    { label: 'Emergency Contact', value: pilgrim.phone },
                    { label: 'Last Scan', value: new Date(pilgrim.lastScan).toLocaleTimeString() },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-white/40 text-xs font-body">{item.label}</p>
                      <p className="text-white/80 text-xs font-body mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Emergency tab */}
      {tab === 'emergency' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-lg mx-auto">
          <p className="text-white/50 text-sm sm:text-base font-body text-center mb-6">
            Tap to call emergency services immediately
          </p>
          {[
            { icon: '🏥', label: 'Medical Help', number: '108', color: '#e53e3e', desc: 'Ambulance & first aid' },
            { icon: '👮', label: 'Police Helpline', number: '100', color: '#3182ce', desc: 'Security & assistance' },
            { icon: '🛕', label: 'Temple Helpline', number: '0891-2556789', color: '#D4AF37', desc: 'Temple administration' },
          ].map((item) => (
            <motion.a
              key={item.label}
              href={`tel:${item.number}`}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/3"
              style={{ borderColor: `${item.color}30` }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ borderColor: `${item.color}60` }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${item.color}15` }}
              >
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-white text-base">{item.label}</h3>
                <p className="text-white/50 text-xs font-body">{item.desc}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-lg" style={{ color: item.color }}>
                  {item.number}
                </p>
                <p className="text-white/30 text-xs font-body">Tap to call</p>
              </div>
            </motion.a>
          ))}

          {/* Sticky note */}
          <div className="border border-[#D4AF37]/20 rounded-xl p-4 bg-[#D4AF37]/5 mt-6">
            <p className="text-[#F5E6C8] text-xs font-body leading-relaxed text-center">
              Temple medical teams are stationed at Tolipavancham, Mudasarlova, and the main entrance.
              Look for volunteers in orange vests.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
