import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ToastProvider } from "./context/ToastContext";
import { TaskProvider } from "./context/TaskContext";
import { HabitProvider } from "./context/HabitContext";
import { PomodoroProvider } from "./context/PomodoroContext";
import { PlannerProvider } from "./context/PlannerContext";
import { loadFromStorage } from "./utils/localStorage";

const initialTheme = loadFromStorage("focusflow-theme", "light");
const rootElement = document.documentElement;
const resolvedTheme = initialTheme === "dark" ? "dark" : "light";

rootElement.classList.toggle("dark", resolvedTheme === "dark");
rootElement.style.colorScheme = resolvedTheme;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <ToastProvider>
        <TaskProvider>
          <HabitProvider>
            <PomodoroProvider>
              <PlannerProvider>
                <App />
              </PlannerProvider>
            </PomodoroProvider>
          </HabitProvider>
        </TaskProvider>
      </ToastProvider>
    </HashRouter>
  </React.StrictMode>,
);
