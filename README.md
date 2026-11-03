# Habit Tracker

A personal habit tracker built with React (Vite), React Router v6, lucide-react and plain CSS. Data lives in `localStorage`.

## Setup
```
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
npm run preview
```

## Features
Add, edit, delete (with confirmation) and complete habits; per-habit and overall streaks; Day / Week / Month views; progress charts; contact form with validation; responsive layout with a mobile drawer.

## Notes
- Overall streak = consecutive days with at least one habit completed.
- A habit counts as done when today's count reaches its daily target (completing sets it to the target).
- The contact form simulates sending (no backend). Replace the placeholder phone and email in `src/pages/Contact.jsx`.
- Accounts (`/signup`, `/login`) are stored in this browser's localStorage, with salted SHA-256 password hashes. Each account has its own habits. This is a demo-level setup, not real security: it needs a backend before you store real passwords.
- Habits saved before accounts existed are adopted by the first account created.
