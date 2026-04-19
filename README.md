# Moodflow Journal

Moodflow Journal is a React + TypeScript journaling app that helps users track mood, write entries, and get AI-assisted reflections powered by Gemini.

## Features

- Emotion-aware journaling interface
- Dashboard view for recent entries and mood patterns
- Local storage persistence
- Gemini-powered prompts and reflections
- Ready-to-deploy setup for Vercel/Netlify

## Tech Stack

- React
- TypeScript
- Vite
- Gemini API

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Local Development

1. Install dependencies:
   `npm install`
2. Create/update `.env.local` with your Gemini key:
   `GEMINI_API_KEY=your_api_key_here`
3. Start development server:
   `npm run dev`
4. Open the local URL shown in your terminal (usually `http://localhost:5173`).

## Build for Production

Run:

`npm run build`

Preview the production build locally:

`npm run preview`

## Deployment

This repository includes deployment config files:

- `vercel.json`
- `netlify.toml`

Deploy by connecting the repository to your preferred platform and setting the `GEMINI_API_KEY` environment variable in that platform's project settings.
