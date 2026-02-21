import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { APP_NAME, APP_SUBTITLE, OWNER_INITIALS, OWNER_NAME } from "../config/branding";
import BrandLogo from "./BrandLogo";

const navItems = [
  { to: "/", label: "Dashboard", short: "Overview" },
  { to: "/tasks", label: "Tasks", short: "Task Manager" },
  { to: "/habits", label: "Habits", short: "Habit Tracker" },
  { to: "/pomodoro", label: "Pomodoro", short: "Focus Timer" },
  { to: "/planner", label: "Planner", short: "Study Planner" },
];

function Sidebar({ open, onClose }) {
  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-40 w-72 border-r border-brand-100/80 bg-white/95 p-5 shadow-soft backdrop-blur transition-transform duration-300 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-accent-500 p-4 text-white">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandLogo size={34} />
            <p className="font-display text-xl font-extrabold tracking-tight">{APP_NAME}</p>
          </div>
          <span className="rounded-full bg-white/25 px-2 py-1 text-[11px] font-bold">{OWNER_INITIALS}</span>
        </div>
        <p className="text-sm text-white/95">{APP_SUBTITLE}</p>
        <p className="mt-2 text-xs font-semibold tracking-wide text-white/85">Created by {OWNER_NAME}</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              clsx(
                "block rounded-xl border px-4 py-3 transition",
                isActive
                  ? "border-brand-200 bg-brand-50 text-brand-700"
                  : "border-slate-200/80 bg-white text-slate-700 hover:border-brand-100 hover:bg-brand-50/50",
              )
            }
          >
            <p className="font-semibold">{item.label}</p>
            <p className="text-xs text-slate-500">{item.short}</p>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
