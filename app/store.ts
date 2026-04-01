import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Checkpoint = {
  id: string;
  name: string;
  km: number;
  status: 'upcoming' | 'current' | 'completed';
  latitude: number;
  longitude: number;
};

export type CrowdLevel = 'low' | 'moderate' | 'high';

export type Pilgrim = {
  rfidId: string;
  name: string;
  phone: string;
  registeredAt: string;
  lastLocation: string;
  lastScan: string;
  routeSection: string;
};

// ─── Pradakshina Store ───────────────────────────────────────────────────────

interface PradakshinaState {
  activeCheckpoint: number;
  completedKm: number;
  checkpoints: Checkpoint[];
  crowdLevels: Record<string, CrowdLevel>;
  isOffline: boolean;
  pradakshinaStarted: boolean;
  startTime: string | null;
  setActiveCheckpoint: (index: number) => void;
  updateCompletedKm: (km: number) => void;
  setCrowdLevel: (checkpointId: string, level: CrowdLevel) => void;
  startPradakshina: () => void;
  setOffline: (offline: boolean) => void;
}

export const usePradakshinaStore = create<PradakshinaState>()(
  persist(
    (set) => ({
      activeCheckpoint: 0,
      completedKm: 0,
      pradakshinaStarted: false,
      startTime: null,
      isOffline: false,
      checkpoints: [
        {
          id: 'tolipavancham',
          name: 'Tolipavancham',
          km: 0,
          status: 'current',
          latitude: 17.7384,
          longitude: 83.2691,
        },
        {
          id: 'hanuman',
          name: 'Hanuman Temple',
          km: 8,
          status: 'upcoming',
          latitude: 17.7350,
          longitude: 83.2650,
        },
        {
          id: 'mudasarlova',
          name: 'Mudasarlova',
          km: 16,
          status: 'upcoming',
          latitude: 17.7300,
          longitude: 83.2600,
        },
        {
          id: 'adavivaram',
          name: 'Adavivaram',
          km: 24,
          status: 'upcoming',
          latitude: 17.7320,
          longitude: 83.2620,
        },
        {
          id: 'final_steps',
          name: '1000 Sacred Steps',
          km: 32,
          status: 'upcoming',
          latitude: 17.7381,
          longitude: 83.2687,
        },
      ],
      crowdLevels: {
        tolipavancham: 'moderate',
        hanuman: 'low',
        mudasarlova: 'low',
        adavivaram: 'low',
        final_steps: 'high',
      },
      setActiveCheckpoint: (index) =>
        set((state) => ({
          activeCheckpoint: index,
          checkpoints: state.checkpoints.map((cp, i) => ({
            ...cp,
            status:
              i < index ? 'completed' : i === index ? 'current' : 'upcoming',
          })),
        })),
      updateCompletedKm: (km) => set({ completedKm: km }),
      setCrowdLevel: (checkpointId, level) =>
        set((state) => ({
          crowdLevels: { ...state.crowdLevels, [checkpointId]: level },
        })),
      startPradakshina: () =>
        set({ pradakshinaStarted: true, startTime: new Date().toISOString() }),
      setOffline: (offline) => set({ isOffline: offline }),
    }),
    { name: 'pradakshina-state' }
  )
);

// ─── Safety Store ─────────────────────────────────────────────────────────────

interface SafetyState {
  pilgrims: Pilgrim[];
  searchQuery: string;
  searchResults: Pilgrim[];
  registerPilgrim: (pilgrim: Omit<Pilgrim, 'registeredAt' | 'lastScan'>) => void;
  searchPilgrim: (query: string) => void;
  updatePilgrimLocation: (rfidId: string, location: string, section: string) => void;
}

export const useSafetyStore = create<SafetyState>()(
  persist(
    (set, get) => ({
      pilgrims: [
        // Demo data
        {
          rfidId: 'SIM-2024-001',
          name: 'Ravi Kumar',
          phone: '+91 98765 43210',
          registeredAt: '2024-01-01T04:00:00Z',
          lastLocation: 'Mudasarlova Checkpoint',
          lastScan: '2024-01-01T09:32:00Z',
          routeSection: 'Section 3 — Mudasarlova',
        },
      ],
      searchQuery: '',
      searchResults: [],
      registerPilgrim: (data) =>
        set((state) => ({
          pilgrims: [
            ...state.pilgrims,
            {
              ...data,
              registeredAt: new Date().toISOString(),
              lastScan: new Date().toISOString(),
            },
          ],
        })),
      searchPilgrim: (query) => {
        const { pilgrims } = get();
        const results = pilgrims.filter(
          (p) =>
            p.rfidId.toLowerCase().includes(query.toLowerCase()) ||
            p.name.toLowerCase().includes(query.toLowerCase())
        );
        set({ searchQuery: query, searchResults: results });
      },
      updatePilgrimLocation: (rfidId, location, section) =>
        set((state) => ({
          pilgrims: state.pilgrims.map((p) =>
            p.rfidId === rfidId
              ? {
                  ...p,
                  lastLocation: location,
                  routeSection: section,
                  lastScan: new Date().toISOString(),
                }
              : p
          ),
        })),
    }),
    { name: 'safety-state' }
  )
);

// ─── App Store ────────────────────────────────────────────────────────────────

interface AppState {
  locale: string;
  isDark: boolean;
  setLocale: (locale: string) => void;
  toggleDark: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: 'en',
      isDark: true,
      setLocale: (locale) => set({ locale }),
      toggleDark: () => set((state) => ({ isDark: !state.isDark })),
    }),
    { name: 'app-state' }
  )
);
