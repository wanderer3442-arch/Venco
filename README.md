# VencoFit — Health & Fitness OS

Next.js 15 + Stitch + Tailwind 4 • palette **color1** `#3F194D` `#68097E` `#C91C7A` `#E8675C` (dark insane, no yellow) • Manrope + Inter

Stitch project `5846846511258656053` • design system `10369891614704217499` (TONAL_SPOT, ROUND_EIGHT)

## Stack
- Next.js 16.3.2 App Router (webpack build for win32) — `src/app`
- Tailwind 4 `@import "tailwindcss"` + `@theme` tokens in `src/app/globals.css`
- TypeScript, ESLint
- Chat V → `src/app/api/chat` proxies OpenRouter (needs `OPENROUTER_API_KEY`, model `openai/gpt-4o-mini`)
- Formulas → `src/lib/formulas.ts` (BMI, BMR Mifflin-St Jeor, TDEE 1.2-1.9, deficit/surplus, macros, hydration, weekly adjust)
- Food DB 800 (500 Indian+300 global) `data/food.sample.json` → expand to `data/food-db.json` + Prisma
- Health DB WHO+Mayo (local, cited)

## Routes
`/` Dashboard (greeting + HealthTipRotator 5s + Todo + EatNew → /meal + StatRings 4-Ring+Streak) • `/essentials` • `/exercises` • `/meal?other=` • `/logger` • `/health` (Pro gated) • `/download` (Pro PDF) • `/pricing` (₹0/₹500/₹3000) • `/privacy` `/terms` • `/api/chat` `/api/download`

Header: top-left logo placeholder (V) + VencoFit, top-right Menu dropdown (Essentials/Exercises/Meal/Logger/Health/Download) + Profile (Profile/Sign out), bottom-right Chat V (5/day free).

## Getting started
```bash
npm install
npm run dev -- --webpack   # http://localhost:3000
npm run build              # webpack (turbopack needs native swc on win32)
```

## Env (Vercel)
```
OPENROUTER_API_KEY=...
OPENROUTER_MODEL=openai/gpt-4o-mini
NEXT_PUBLIC_SITE_URL=https://venco.fit
NEXTAUTH_URL=...
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
DATABASE_URL=...
```

## Deploy
Vercel — `next build --webpack` works with WASM fallback locally; Vercel uses native SWC.

## Next phases
- Phase 1: NextAuth (Gmail+password), Prisma, onboarding wizard wiring formulas
- Phase 2: Fuse.js autocomplete, food DB full, exercise calibration
- Phase 3: Logger charts (recharts) + calendar
- Phase 4: Razorpay test → live, health DB, PDF

> Not medical advice. Health guidance cites WHO/Mayo.
