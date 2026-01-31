# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personalized landing page system for Irunica (K-Beauty ODM/OEM company) that dynamically generates customized web experiences for B2B leads. The system pulls lead data from Google Sheets and generates AI-powered content (text + images) using Google Gemini API.

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Architecture

### Routing
- `/` - Default home page (`src/app/page.tsx`)
- `/[vip]` - Dynamic personalized landing page for each lead (`src/app/[vip]/page.tsx`)

### Data Flow
1. VIP visits `yoursite.com/{company-or-email}`
2. Server validates VIP against Google Sheets "History" tab via `src/lib/google-sheets.ts`
3. AI service (`src/lib/ai-service.ts`) generates personalized text and product images using Gemini API
4. Results cached in Firestore (`vip_pages` collection) via `src/lib/firebase-admin.ts`
5. Visitor access logged to Firestore (`visitor_logs` collection)

### Key Libraries
- **Google Sheets API**: VIP whitelist validation and lead data (`google-spreadsheet`)
- **Firebase Admin**: Firestore caching, rate limiting, visitor logging
- **Google Gemini API**: Text generation (`gemini-2.5-flash`) and image generation (`gemini-2.5-flash-image`) via REST
- **Framer Motion**: Animations
- **Nodemailer**: Email sending for lead capture

### Component Structure
The VIP page renders in streaming order:
1. `CinematicIntro` - Immediate render, no data dependency
2. `AnalysisSection` - Text ready from AI
3. `RiskFreeScaler`, `ProtocolMatcher`, `ColorAtelier` - Static content modules
4. `VisualSection`, `InfluencerStore`, `LeadCaptureFlow` - Wait for image generation via Suspense

### API Routes
- `POST /api/send-proposal` - Two-step email flow: Step 1 sends assets to customer, Step 2 notifies admin of lead

## Environment Variables

Required in `.env.local` (see `env.sample`):
- `GOOGLE_SHEET_ID` - Google Sheets document ID
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to service account JSON for Firebase Admin
- `GOOGLE_CLOUD_PROJECT_ID` - GCP project ID
- `GOOGLE_GEMINI_API_KEY` - Gemini API key
- `EMAIL_USER` / `EMAIL_PASS` - Gmail credentials for nodemailer

The project also requires `service-account.json` in the root for Google Sheets auth.

## Deployment

Configured for Docker deployment with standalone output mode (`next.config.ts: output: "standalone"`). The Dockerfile uses multi-stage builds optimized for Next.js.

## Internationalization

Basic i18n via React Context (`src/context/LanguageContext.tsx`) supporting English and Korean.
