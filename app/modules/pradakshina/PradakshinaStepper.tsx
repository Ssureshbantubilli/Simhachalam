'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePradakshinaStore } from '../../store';

// ─── Types ────────────────────────────────────────────────────────────────────

type Checkpoint = {
  id: string;
  name: string;
  subtitle: string;
  km: number;
  ritual?: string;
  description: string;
  icon: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const CHECKPOINTS: Checkpoint[] = [
  {
    id: 'foothill_start',
    name: 'Simhachalam Foot Hill',
    subtitle: 'Sacred Start & Sankalpam',
    km: 0,
    description: 'Begin the Giri Pradakshina with Sankalpam at the Simhachalam foot hill.',
    ritual: 'Sankalpam, coconut breaking, prayer',
    icon: '🪔',
  },
  {
    id: 'bangaramma',
    name: 'Bangaramma Thalli Temple',
    subtitle: 'First Blessings',
    km: 2,
    description: 'Seek blessings at Bangaramma Thalli Temple, an auspicious stop early in the pradakshina.',
    icon: '🌸',
  },
  {
    id: 'central_jail',
    name: 'Central Jail Road',
    subtitle: 'Pilgrim Route',
    km: 5,
    description: 'Proceed along Central Jail Road, a key stretch of the sacred path.',
    icon: '🛣️',
  },
  {
    id: 'hanumanthawaka',
    name: 'Hanumanthawaka',
    subtitle: 'Major Junction',
    km: 7,
    description: 'Cross the Hanumanthawaka junction, a major city landmark.',
    icon: '🚦',
  },
  {
    id: 'tenneti_park',
    name: 'Tenneti Park (Samudra Snanam)',
    subtitle: 'Sea Bathing Ritual',
    km: 10,
    description: 'Perform Samudra Snanam (ritual sea bath) at Tenneti Park on the Bay of Bengal coast.',
    icon: '🌊',
  },
  {
    id: 'marripalem',
    name: 'Marripalem',
    subtitle: 'Pilgrim Progress',
    km: 14,
    description: 'Continue through Marripalem, a key point on the 32 KM route.',
    icon: '🛤️',
  },
  {
    id: 'seethammadhara',
    name: 'Seethamma Dhara',
    subtitle: 'Blessings of Seetha Devi',
    km: 17,
    description: 'Pause at Seethamma Dhara for prayers and blessings.',
    icon: '🙏',
  },
  {
    id: 'madhavadhara',
    name: 'Madhava Dhara (Sprinkling of Water)',
    subtitle: 'Holy Water Ritual',
    km: 20,
    description: 'Sprinkling of sacred water at Madhava Dhara, a spiritually significant act.',
    icon: '💧',
  },
  {
    id: 'nad_junction',
    name: 'NAD Junction',
    subtitle: 'Key Crossing',
    km: 23,
    description: 'Cross the busy NAD Junction, a major milestone on the route.',
    icon: '🚏',
  },
  {
    id: 'gopalapatnam',
    name: 'Gopalapatnam',
    subtitle: 'Pilgrim Gathering',
    km: 26,
    description: 'Join other devotees at Gopalapatnam, a traditional gathering point.',
    icon: '🧑‍🤝‍🧑',
  },
  {
    id: 'gangadhara',
    name: 'Ganga Dhara (Final Sprinkling)',
    subtitle: 'Final Holy Water',
    km: 29,
    description: 'Perform the final sprinkling of holy water at Ganga Dhara.',
    icon: '🚿',
  },
  {
    id: 'foothill_end',
    name: 'Simhachalam Foot Hill',
    subtitle: 'Completion & Darshan',
    km: 32,
    description: 'Complete the 32 KM Giri Pradakshina at the Simhachalam foot hill and proceed for darshan.',
    icon: '🏁',
  },
];

const CROWD_COLORS = {
  low: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  moderate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  high: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const CROWD_LABELS = {
  low: 'Low crowd',
  moderate: 'Moderate',
  high: 'High density',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PradakshinaStepper() {
  const { activeCheckpoint, setActiveCheckpoint, crowdLevels, pradakshinaStarted, startPradakshina } =
    usePradakshinaStore();
  const [expandedId, setExpandedId] = useState<string | null>('tolipavancham');

  const progressPercent = (activeCheckpoint / (CHECKPOINTS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white px-4 py-8 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto w-full md:px-8 lg:px-16">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mb-2 font-body">
          Sri Varaha Lakshmi Narasimha Swamy Temple
        </p>
        <h1 className="font-display text-3xl font-bold text-white mb-1">
          Giri Pradakshina
        </h1>
        <p className="text-white/40 text-sm font-body">32 KM Sacred Circumambulation</p>
      </div>

      {/* Progress Overview Card */}
      <div
        className="relative rounded-2xl p-5 mb-8 border border-[#D4AF37]/20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1208 0%, #0F0F0F 100%)' }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-2xl" />

        <div className="relative">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white/60 text-xs font-body uppercase tracking-wider">Progress</span>
            <span className="text-[#D4AF37] font-display font-bold">
              {CHECKPOINTS[activeCheckpoint].km} / 32 KM
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-white/10 rounded-full mb-4">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7A1C1C, #D4AF37)' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Checkpoint', value: `${activeCheckpoint + 1}/5` },
              { label: 'Remaining', value: `${32 - CHECKPOINTS[activeCheckpoint].km} KM` },
              { label: 'Status', value: pradakshinaStarted ? 'Active' : 'Ready' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-white font-display font-semibold text-base">{stat.value}</p>
                <p className="text-white/40 text-xs font-body mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button (if not started) */}
      {!pradakshinaStarted && (
        <motion.button
          onClick={startPradakshina}
          className="w-full mb-8 py-4 rounded-xl font-display text-base font-semibold tracking-wide border border-[#D4AF37]/50"
          style={{ background: 'linear-gradient(135deg, #7A1C1C, #9b2226)' }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ borderColor: 'rgba(212,175,55,0.8)' }}
        >
          🪔 Begin Giri Pradakshina at Tolipavancham
        </motion.button>
      )}

      {/* Stepper */}
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-white/10" />
        <motion.div
          className="absolute left-6 top-6 w-0.5 bg-gradient-to-b from-[#D4AF37] to-[#7A1C1C]"
          animate={{ height: `${progressPercent}%` }}
          transition={{ duration: 0.6 }}
        />

        <div className="space-y-2">
          {CHECKPOINTS.map((checkpoint, index) => {
            const isCompleted = index < activeCheckpoint;
            const isCurrent = index === activeCheckpoint;
            const isExpanded = expandedId === checkpoint.id;
            const crowd = crowdLevels[checkpoint.id] as 'low' | 'moderate' | 'high';

            return (
              <motion.div
                key={checkpoint.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                {/* Checkpoint row */}
                <button
                  onClick={() => {
                    setExpandedId(isExpanded ? null : checkpoint.id);
                  }}
                  className="w-full text-left flex items-start gap-4 py-3"
                >
                  {/* Step indicator */}
                  <div className="relative flex-shrink-0 z-10">
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg border-2 transition-colors ${
                        isCompleted
                          ? 'border-[#D4AF37] bg-[#D4AF37]/20'
                          : isCurrent
                          ? 'border-[#D4AF37] bg-[#7A1C1C]'
                          : 'border-white/20 bg-white/5'
                      }`}
                      animate={isCurrent ? { boxShadow: ['0 0 0px #D4AF37', '0 0 20px #D4AF3760', '0 0 0px #D4AF37'] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      {isCompleted ? '✓' : checkpoint.icon}
                    </motion.div>
                    {/* KM badge */}
                    <div className="absolute -bottom-1 -right-1 bg-[#0F0F0F] border border-white/20 rounded-full px-1.5 py-0.5 text-[9px] text-white/50 font-body">
                      {checkpoint.km}k
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`font-display font-semibold text-base truncate ${
                          isCurrent ? 'text-[#D4AF37]' : isCompleted ? 'text-white/70' : 'text-white/50'
                        }`}
                      >
                        {checkpoint.name}
                      </h3>
                      {/* Crowd badge */}
                      <span
                        className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full border font-body ${CROWD_COLORS[crowd]}`}
                      >
                        {CROWD_LABELS[crowd]}
                      </span>
                    </div>
                    <p className="text-white/40 text-xs font-body mt-0.5">{checkpoint.subtitle}</p>
                  </div>
                </button>

                {/* Expanded detail panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden ml-16"
                    >
                      <div className="border border-white/10 rounded-xl p-4 mb-3 bg-white/3">
                        <p className="text-white/70 text-sm font-body leading-relaxed mb-3">
                          {checkpoint.description}
                        </p>

                        {/* Ritual instruction */}
                        {checkpoint.ritual && (
                          <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg p-3 mb-3">
                            <p className="text-[#D4AF37] text-xs font-body">
                              🪔 {checkpoint.ritual}
                            </p>
                          </div>
                        )}

                        {/* Special panel for Tolipavancham */}
                        {checkpoint.id === 'tolipavancham' && (
                          <div className="border border-[#7A1C1C]/50 rounded-lg p-3 bg-[#7A1C1C]/10">
                            <p className="text-[#F5E6C8] text-xs font-body leading-relaxed">
                              <span className="text-[#D4AF37] font-semibold">Tolipavancham</span> is the
                              sacred starting point of the Giri Pradakshina — the moment of divine
                              resolve before the 32 KM circumambulation begins.
                            </p>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-2 mt-3">
                          {isCurrent && index < CHECKPOINTS.length - 1 && (
                            <motion.button
                              onClick={() => setActiveCheckpoint(index + 1)}
                              className="flex-1 py-2 text-sm font-body rounded-lg bg-[#D4AF37] text-[#0F0F0F] font-semibold"
                              whileTap={{ scale: 0.95 }}
                            >
                              Mark Reached →
                            </motion.button>
                          )}
                          <button className="flex-1 py-2 text-sm font-body rounded-lg border border-white/20 text-white/60">
                            View on Map
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Completion card */}
      {activeCheckpoint === CHECKPOINTS.length - 1 && pradakshinaStarted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl p-6 border border-[#D4AF37]/40 text-center"
          style={{ background: 'linear-gradient(135deg, #1a1208, #120a02)' }}
        >
          <div className="text-4xl mb-3">🙏</div>
          <h2 className="font-display text-xl font-bold text-[#D4AF37] mb-2">
            Giri Pradakshina Complete
          </h2>
          <p className="text-white/60 text-sm font-body">
            Sri Varaha Lakshmi Narasimha Swamy bless you with grace, peace, and prosperity.
          </p>
          <p className="text-[#D4AF37]/60 text-xs font-body mt-3 italic">
            ॐ नमो भगवते नरसिंहाय
          </p>
        </motion.div>
      )}
    </div>
  );
}
