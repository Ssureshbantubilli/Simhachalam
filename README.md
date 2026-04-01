# 🛕 Simhachalam — Neo-Vedic Digital Companion Platform

**Sri Varaha Lakshmi Narasimha Swamy Temple, Visakhapatnam**

> A real-time spiritual + safety companion for devotees performing the 32 KM Giri Pradakshina.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in your Google Maps API key and Firebase credentials

# 3. Run development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

---

## 📁 Project Structure

```
simhachalam/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx         ← Root layout with i18n + fonts
│   │   └── page.tsx           ← Entry page (locale-aware)
│   ├── components/
│   │   ├── HomePage.tsx       ← Main home + temple module + bottom nav
│   │   └── LanguageSwitcher.tsx ← 4-language instant switcher
│   ├── modules/
│   │   ├── pradakshina/
│   │   │   └── PradakshinaStepper.tsx  ← PRIMARY: 32 KM stepper
│   │   ├── safety/
│   │   │   └── SafetyModule.tsx        ← RFID registration + search + emergency
│   │   └── temple/
│   │       └── (TempleModule inline in HomePage)
│   ├── globals.css            ← Tailwind + custom CSS (shloka, glass-card, shimmer)
│   └── store.ts               ← Zustand: pradakshina + safety + app state
│
├── messages/
│   ├── en.json                ← English (complete)
│   ├── te.json                ← Telugu (complete)
│   ├── hi.json                ← Hindi (complete)
│   └── or.json                ← Odia (complete)
│
├── public/
│   ├── manifest.json          ← PWA manifest
│   ├── sw.js                  ← Service Worker (offline-first)
│   └── assets/
│       ├── images/devsthanam/ ← Place AI-generated temple images here
│       └── icons/             ← PWA icons (192px, 512px)
│
├── middleware.ts              ← next-intl locale routing
├── i18n.ts                    ← next-intl server config
├── next.config.js             ← Next.js + next-intl + image config
└── tailwind.config.js         ← Divine Modernism 2.0 palette
```

---

## 🌍 Multilingual System

| Language | File | Status |
|----------|------|--------|
| English | `messages/en.json` | ✅ Complete |
| Telugu (తెలుగు) | `messages/te.json` | ✅ Complete |
| Hindi (हिन्दी) | `messages/hi.json` | ✅ Complete |
| Odia (ଓଡ଼ିଆ) | `messages/or.json` | ✅ Complete |

**Rule:** Sanskrit shlokas are **never translated** — always rendered in Devanagari.

---

## 🎨 Design System — "Divine Modernism 2.0"

| Token | Value | Usage |
|-------|-------|-------|
| Kumkum Red | `#7A1C1C` | Primary actions, active states |
| Temple Gold | `#D4AF37` | Accents, headings, highlights |
| Sandalwood | `#F5E6C8` | Body text on dark bg |
| Night | `#0F0F0F` | Background |

**Fonts:**
- Headings: `Playfair Display` (`.font-display`)
- Body: `Inter` (`.font-body`)
- Sanskrit/Devanagari: `Noto Serif Devanagari` (`.shloka`)

---

## 🚶 Giri Pradakshina Module

The **primary module** — a 5-checkpoint interactive stepper for the 32 KM sacred circumambulation:

1. **Tolipavancham** (0 KM) — Sacred Start & Sankalpam Point
2. **Hanuman Temple** (8 KM) — Divine Protector
3. **Mudasarlova** (16 KM) — Sacred Water Body
4. **Adavivaram** (24 KM) — Forest Passage
5. **1000 Sacred Steps** (32 KM) — Final Ascent to Lord

**Key rule:** NEVER refer to as "trek" — always **Giri Pradakshina**.
**Key terminology:** ALWAYS use **Tolipavancham** (not Tolipuvvu).

---

## 🆘 Safety Module (RFID)

- **Register Pilgrim** → generates unique `SIM-XXXXXX` RFID tag
- **Search/Track** → find by RFID ID or name, see last location
- **Emergency Contacts** → Medical (108), Police (100), Temple helpline

---

## 📡 PWA Offline Support

The service worker (`public/sw.js`) caches:
- All app pages and routes
- All 4 language JSON files (critical for offline ritual guidance)
- Maps tiles (via Google Maps PWA caching)

Works in **0 signal** areas on the pradakshina route.

---

## 🖼️ AI Image Generation Pipeline

Place generated images in `/public/assets/images/devsthanam/`:

| Filename | AI Prompt |
|----------|-----------|
| `hero-simhachalam.jpg` | Cinematic aerial view of Simhachalam hill temple at sunrise, golden light, lush green hills, divine atmosphere, ultra realistic, 8k |
| `tolipavancham-start.jpg` | Traditional Tolipavancham gateway at Simhachalam, devotees performing Sankalpam, breaking coconuts, marigold garlands, spiritual ambiance |
| `pradakshina-route.jpg` | Illustrated sacred circular path around Simhachalam hill labeled Giri Pradakshina, parchment style, Vedic symbols, spiritual map |
| `narasimha-avatar.jpg` | Lord Narasimha emerging from pillar protecting Prahlada, divine energy, traditional Indian painting style |
| `sandalwood-deity.jpg` | Simhachalam deity covered in sandalwood paste shaped like Shivalingam, gold kavacham, temple lighting, spiritual realism |

---

## ⚙️ Environment Variables

```env
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
```

---

## 🔮 Next Steps (Phase 2)

- [ ] Google Maps integration with live 32 KM route overlay
- [ ] Firebase real-time crowd density updates
- [ ] Push notifications for hydration & milestones
- [ ] Actual RFID scanner API integration
- [ ] Darshan booking with temple official API
- [ ] Telugu / Hindi voice guidance for route narration
- [ ] Accessibility audit (WCAG 2.1 AA)

---

## ❗ Strict Rules

> - NEVER refer to Giri Pradakshina as a **trek**
> - ALWAYS use: **Tolipavancham** (not Tolipuvvu)
> - Sanskrit shlokas in Devanagari — **never translated**
> - Maintain Agama-based spiritual authenticity throughout
