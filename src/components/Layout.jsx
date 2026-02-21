import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ToastStack from "./ToastStack";
import { loadFromStorage, saveToStorage } from "../utils/localStorage";

const THEME_STORAGE_KEY = "focusflow-theme";
const DEFAULT_THEME = "light";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const storedTheme = loadFromStorage(THEME_STORAGE_KEY, DEFAULT_THEME);
    return storedTheme === "dark" ? "dark" : "light";
  });
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    saveToStorage(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden font-body text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand-200/60 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 animate-float rounded-full bg-accent-200/60 blur-3xl" />
        <div className="absolute bottom-0 right-40 h-52 w-52 rounded-full bg-brand-100/80 blur-3xl" />
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen ? (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/25 lg:hidden"
          aria-label="Close sidebar"
        />
      ) : null}

      <div className="relative min-h-screen lg:pl-72">
        <Navbar
          onMenuClick={() => setSidebarOpen((open) => !open)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main className="px-4 pb-8 pt-6 sm:px-6 lg:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <ToastStack />
    </div>
  );
}

export default Layout;
