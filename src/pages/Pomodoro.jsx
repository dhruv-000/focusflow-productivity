import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import TimerDisplay from "../components/TimerDisplay";
import StatCard from "../components/StatCard";
import { usePomodoro } from "../context/PomodoroContext";
import { useToast } from "../context/ToastContext";

function Pomodoro() {
  const {
    mode,
    isRunning,
    secondsLeft,
    focusMinutes,
    breakMinutes,
    autoSwitch,
    sessionsToday,
    sessionsThisWeek,
    totalSessions,
    toggleRunning,
    resetTimer,
    skipMode,
    updateSettings,
    switchToMode,
  } = usePomodoro();
  const { pushToast } = useToast();

  const [focusInput, setFocusInput] = useState(focusMinutes);
  const [breakInput, setBreakInput] = useState(breakMinutes);
  const [autoSwitchInput, setAutoSwitchInput] = useState(autoSwitch);

  useEffect(() => {
    setFocusInput(focusMinutes);
    setBreakInput(breakMinutes);
    setAutoSwitchInput(autoSwitch);
  }, [focusMinutes, breakMinutes, autoSwitch]);

  const totalSeconds = useMemo(
    () => (mode === "focus" ? focusMinutes : breakMinutes) * 60,
    [mode, focusMinutes, breakMinutes],
  );

  const handleSaveSettings = (event) => {
    event.preventDefault();
    updateSettings({
      focus: focusInput,
      breakTime: breakInput,
      auto: autoSwitchInput,
    });
    pushToast("Pomodoro settings updated.", "success");
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Sessions Today" value={sessionsToday} subtitle="Completed focus rounds" />
        <StatCard
          title="Sessions This Week"
          value={sessionsThisWeek}
          subtitle="Rolling weekly momentum"
          accent="text-accent-700"
        />
        <StatCard
          title="Focus Length"
          value={`${focusMinutes}m`}
          subtitle="Current focus duration"
          accent="text-brand-700"
        />
        <StatCard
          title="All-Time Sessions"
          value={totalSessions}
          subtitle="Persisted in localStorage"
          accent="text-brand-700"
        />
      </div>

      <article
        className={clsx(
          "card-surface p-5 transition-colors",
          isRunning && mode === "focus" ? "border-brand-200 bg-brand-50/70" : "",
        )}
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => switchToMode("focus")}
            className={clsx(
              "rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wide",
              mode === "focus"
                ? "border-brand-200 bg-brand-100 text-brand-700"
                : "border-slate-200 bg-white text-slate-600",
            )}
          >
            Focus
          </button>
          <button
            type="button"
            onClick={() => switchToMode("break")}
            className={clsx(
              "rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wide",
              mode === "break"
                ? "border-accent-200 bg-accent-100 text-accent-700"
                : "border-slate-200 bg-white text-slate-600",
            )}
          >
            Break
          </button>
        </div>

        <TimerDisplay
          mode={mode}
          isRunning={isRunning}
          secondsLeft={secondsLeft}
          totalSeconds={totalSeconds}
          onToggle={toggleRunning}
          onReset={resetTimer}
          onSkip={skipMode}
        />
      </article>

      <article className="card-surface p-5">
        <h2 className="font-display text-lg font-bold text-slate-900">Timer Settings</h2>
        <form onSubmit={handleSaveSettings} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Focus (minutes)
            </span>
            <input
              type="number"
              min={5}
              max={90}
              value={focusInput}
              onChange={(event) => setFocusInput(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 transition focus:border-brand-300 focus:ring"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Break (minutes)
            </span>
            <input
              type="number"
              min={3}
              max={30}
              value={breakInput}
              onChange={(event) => setBreakInput(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 transition focus:border-brand-300 focus:ring"
            />
          </label>

          <label className="sm:col-span-2 lg:col-span-2 flex items-end">
            <span className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
              <span className="font-semibold text-slate-700">Auto switch sessions</span>
              <input
                type="checkbox"
                checked={autoSwitchInput}
                onChange={(event) => setAutoSwitchInput(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </span>
          </label>

          <div className="sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
            >
              Save Settings
            </button>
          </div>
        </form>
      </article>
    </section>
  );
}

export default Pomodoro;
