import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { APP_NAME, NAV_BADGE_TEXT, OWNER_NAME } from "../config/branding";
import BrandLogo from "./BrandLogo";

const routeLabels = {
  "/": "Dashboard",
  "/tasks": "Task Manager",
  "/habits": "Habit Tracker",
  "/pomodoro": "Pomodoro Timer",
  "/planner": "Study Planner",
};

function SunIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <circle cx="12" cy="12" r="4.2" />
      <path strokeLinecap="round" d="M12 2.5v2.4M12 19.1v2.4M4.93 4.93l1.7 1.7M17.37 17.37l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.93 19.07l1.7-1.7M17.37 6.63l1.7-1.7" />
    </svg>
  );
}

function MoonIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.2 14.9A8.8 8.8 0 0 1 9.1 3.8a9.2 9.2 0 1 0 11.1 11.1Z"
      />
    </svg>
  );
}

function Navbar({ onMenuClick, theme, onToggleTheme }) {
  const location = useLocation();
  const pageTitle = routeLabels[location.pathname] ?? APP_NAME;
  const nextTheme = theme === "dark" ? "light" : "dark";
  const ThemeIcon = nextTheme === "dark" ? MoonIcon : SunIcon;

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  return (
    <header className="sticky top-0 z-20 border-b border-brand-100/70 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-brand-200 hover:text-brand-700 lg:hidden"
          >
            Menu
          </button>
          <div>
            <div className="mb-1 hidden items-center gap-2 sm:flex">
              <BrandLogo size={20} />
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">{APP_NAME}</p>
            </div>
            <h1 className="font-display text-xl font-extrabold tracking-tight text-slate-900">
              {pageTitle}
            </h1>
            <p className="text-sm text-slate-500">
              {todayLabel} - {OWNER_NAME}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${nextTheme} mode`}
            title={`Switch to ${nextTheme} mode`}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-700"
          >
            <ThemeIcon />
            <span className="sr-only">{`Switch to ${nextTheme} mode`}</span>
          </button>
          <div className="hidden rounded-full border border-brand-100 bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700 sm:block">
            {NAV_BADGE_TEXT}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
