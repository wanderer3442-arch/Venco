# Gym at Home

A full-stack health & fitness web application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Food Database**: 2000+ items across 44+ categories (Indian, Chinese, Mediterranean, etc.)
- **Exercise Plans**: 80+ exercises with auto-generated workout plans
- **AI Chatbot**: Gemini Flash via a server-side proxy, free for everyone (30 msgs/day limit)
- **Dashboard**: Calorie tracking, macro breakdown, water intake, weekly progress
- **Meal Planning**: 7-day food intake tracker with allergy filtering
- **Health Tracking**: Body metrics, BMI/BMR/TDEE calculations
- **Export Reports**: PDF and CSV generation with clinical-grade formatting
- **Dark Mode**: Full dark theme support
- **Per-user Data**: All data persisted in localStorage per user account

## Tech Stack

- **Framework**: Next.js 16 + TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF**: jsPDF
- **AI**: Google Gemini API (key stays server-side, never in the app)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment

Create `.env.local` (gitignored) before building:

```
NEXT_PUBLIC_AI_PROXY_URL=https://<your-worker>.workers.dev
NEXT_PUBLIC_APP_CLIENT_SECRET=<shared-client-secret>
```

The proxy (in `worker/`) holds the Gemini API key and validates the `X-App-Client` header plus origin. Deploy it with Wrangler: `npx wrangler deploy`.

### Android

```bash
npx next build
npx cap sync android
cd android && ./gradlew assembleDebug
```

Release builds sign with `android/upload-keystore.jks` via `android/keystore.properties` (both gitignored — keep an off-device backup of the keystore; losing it means you can't update the Play Store listing).
