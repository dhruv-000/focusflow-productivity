# FocusFlow

FocusFlow is a frontend-only productivity web app built with React + Vite.

It combines:
- Task Manager (add/edit/delete/complete, search, filters, priority, due dates, drag reorder)
- Habit Tracker (daily completion, streaks, weekly trend)
- Pomodoro Timer (focus/break cycles, custom settings, auto-switch, session tracking, alert tone)
- Study Planner (monthly calendar, daily plans, weekly subject breakdown, total study hours)
- `localStorage` persistence for all modules

## Tech Stack

- React + Vite
- Tailwind CSS
- React Router
- Context API
- Framer Motion
- gh-pages (deployment)

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

This app uses `HashRouter` and Vite `base: "./"` so it works on project pages without additional routing setup.

1. Create a GitHub repository (example: `focusflow`).
2. Push this project to that repository.
3. Run:

```bash
npm run deploy
```

4. In GitHub repository settings, ensure Pages source points to the `gh-pages` branch.
5. Open: `https://<your-username>.github.io/<repo-name>/`

## Data Persistence Keys

- `focusflow.tasks`
- `focusflow.habits`
- `focusflow.pomodoro`
- `focusflow.plans`
