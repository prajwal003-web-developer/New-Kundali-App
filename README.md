# 🪐 ज्योतिष कुण्डली — AI-Powered Vedic Astrology App

A production-ready full-stack Vedic Kundali web application built with **Next.js 14**, **MongoDB**, **JWT Auth**, and **AI interpretation** — entirely in **Nepali language**.

---

## 📁 Project Structure

```
kundali-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts     # POST /api/auth/register
│   │   │   ├── login/route.ts        # POST /api/auth/login
│   │   │   ├── logout/route.ts       # POST /api/auth/logout
│   │   │   └── me/route.ts           # GET  /api/auth/me
│   │   └── kundali/
│   │       ├── generate/route.ts     # POST /api/kundali/generate
│   │       ├── list/route.ts         # GET  /api/kundali/list
│   │       └── [id]/route.ts         # GET|DELETE /api/kundali/:id
│   ├── create/page.tsx               # Kundali creation page
│   ├── dashboard/page.tsx            # Saved kundalis dashboard
│   ├── login/page.tsx                # Login page
│   ├── register/page.tsx             # Registration page
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Root redirect
│   └── globals.css                   # Global styles + CSS variables
├── components/
│   ├── charts/
│   │   ├── KundaliChartDisplay.tsx   # North Indian style chart
│   │   └── KundaliResult.tsx         # Full result with all sections
│   ├── forms/
│   │   └── KundaliForm.tsx           # Birth detail input form
│   ├── layout/
│   │   └── AppLayout.tsx             # Sidebar layout
│   └── ui/
│       ├── AuthProvider.tsx          # Auth context
│       ├── ThemeProvider.tsx         # Dark/light theme
│       ├── ToastProvider.tsx         # Toast notifications
│       └── LoadingSteps.tsx          # Step-by-step loading
├── lib/
│   ├── astrology.ts                  # Vedic astrology calculations
│   ├── aiInterpretation.ts           # AI interpretation function
│   ├── auth.ts                       # JWT utilities
│   ├── bsConverter.ts               # BS ↔ AD date conversion
│   ├── locationData.ts              # Nepal provinces/districts, India states
│   └── mongodb.ts                    # MongoDB connection
├── models/
│   ├── User.ts                       # User schema (bcrypt hashed pw)
│   └── Kundali.ts                    # Kundali schema
├── .env.example                      # Environment variables template
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

---

## ⚙️ Setup Instructions

### 1. Clone & Install

```bash
git clone <repo>
cd kundali-app
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
MONGODB_URI=mongodb://localhost:27017/kundali_app
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
AI_API_URL=https://api.anthropic.com/v1/messages
AI_API_KEY=your_anthropic_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. MongoDB

Make sure MongoDB is running locally:
```bash
mongod --dbpath /data/db
```
Or use MongoDB Atlas and put the connection string in `MONGODB_URI`.

### 4. Run Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌟 Features

| Feature | Details |
|---|---|
| **Auth** | Register/Login with bcrypt-hashed passwords, JWT in httpOnly cookies |
| **Kundali Form** | Full name, gender, AD/BS date, birth time, Nepal (province→district) / India (state) |
| **Auto Location** | Latitude, longitude, altitude auto-filled from district/state |
| **BS↔AD Conversion** | Full Bikram Sambat calendar data from 2000–2083 BS |
| **Astrology Engine** | Lagna, Rashi, Nakshatra, Yoga, Karana, D1/D9/D10/D12 charts, Vimshottari Dasha |
| **North Indian Chart** | Grid-based visual chart with all planetary positions, retrograde markers |
| **Panchangam** | Tithi, Vara, Nakshatra, Yoga, Karana for birth day |
| **AI Interpretation** | Claude AI generates Nepali-language kundali reading |
| **Dashboard** | View, search, and delete saved kundalis |
| **Dark/Light Mode** | Persistent theme toggle |
| **Toast Notifications** | Success/error/info notifications |
| **Loading Steps** | Step-by-step generation animation |
| **Responsive** | Mobile-friendly with hamburger sidebar |
| **Nepali UI** | All labels, messages, buttons in Nepali |

---

## 🔭 Astrology Calculations

The `lib/astrology.ts` engine implements:

- **Julian Day** conversion from Gregorian date/time/timezone
- **Lahiri Ayanamsa** (standard for Vedic astrology)
- **Tropical → Sidereal** longitude conversion
- **Planet longitudes**: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
- **Ascendant (Lagna)** from Local Sidereal Time
- **Nakshatra & Pada** from Moon longitude
- **Divisional charts**: D9 (Navamsa), D10 (Dashamsa), D12 (Dwadasamsa)
- **Vimshottari Dasha** with Antardasha periods
- **Panchangam**: Tithi, Vara, Yoga, Karana

---

## 🤖 AI Interpretation

The `generateAIInterpretation()` function in `lib/aiInterpretation.ts`:

- Sends structured chart JSON to Anthropic Claude API
- Prompts for Nepali-language analysis of personality, career, health, love, wealth, dasha
- Falls back to template-based interpretation if API key not set

---

## 🎨 Design

- **Colors**: Saffron/gold cosmic dark theme + clean light mode
- **Fonts**: Yatra One (display), Mukta (body — Devanagari optimized)
- **CSS Variables**: Full theming via `--bg-primary`, `--accent`, `--accent-gold`, etc.
- **Animations**: Float, shimmer skeleton, pulse glow, toast slide-in

---

## 📦 Production Build

```bash
npm run build
npm start
```

For deployment, use **Vercel** (recommended for Next.js) with environment variables set in the dashboard.
