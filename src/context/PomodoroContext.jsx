import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dateKeyFromDate, getWeekKeys } from "../utils/date";
import { loadFromStorage, saveToStorage } from "../utils/localStorage";

const STORAGE_KEY = "focusflow.pomodoro";
const DEFAULT_SETTINGS = {
  focusMinutes: 25,
  breakMinutes: 5,
  autoSwitch: true,
  sessionLog: {},
};

const PomodoroContext = createContext(null);

function playAlertTone() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.08;

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.25);

    window.setTimeout(() => {
      context.close();
    }, 500);
  } catch (error) {
    console.warn("Unable to play timer alert", error);
  }
}

export function PomodoroProvider({ children }) {
  const persisted = useMemo(() => loadFromStorage(STORAGE_KEY, DEFAULT_SETTINGS), []);

  const [focusMinutes, setFocusMinutes] = useState(
    Number.isFinite(persisted.focusMinutes) ? persisted.focusMinutes : 25,
  );
  const [breakMinutes, setBreakMinutes] = useState(
    Number.isFinite(persisted.breakMinutes) ? persisted.breakMinutes : 5,
  );
  const [autoSwitch, setAutoSwitch] = useState(
    typeof persisted.autoSwitch === "boolean" ? persisted.autoSwitch : true,
  );
  const [sessionLog, setSessionLog] = useState(
    typeof persisted.sessionLog === "object" && persisted.sessionLog ? persisted.sessionLog : {},
  );

  const [mode, setMode] = useState("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);

  useEffect(() => {
    saveToStorage(STORAGE_KEY, {
      focusMinutes,
      breakMinutes,
      autoSwitch,
      sessionLog,
    });
  }, [focusMinutes, breakMinutes, autoSwitch, sessionLog]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setSecondsLeft((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRunning]);

  const incrementSession = useCallback(() => {
    const today = dateKeyFromDate();
    setSessionLog((current) => ({
      ...current,
      [today]: (current[today] ?? 0) + 1,
    }));
  }, []);

  useEffect(() => {
    if (!isRunning || secondsLeft > 0) {
      return;
    }

    playAlertTone();

    if (mode === "focus") {
      incrementSession();
    }

    const nextMode = mode === "focus" ? "break" : "focus";
    const nextDuration = (nextMode === "focus" ? focusMinutes : breakMinutes) * 60;

    if (autoSwitch) {
      setMode(nextMode);
      setSecondsLeft(nextDuration);
      return;
    }

    setIsRunning(false);
  }, [secondsLeft, isRunning, mode, incrementSession, autoSwitch, focusMinutes, breakMinutes]);

  const toggleRunning = useCallback(() => {
    setIsRunning((current) => {
      if (!current && secondsLeft === 0) {
        setSecondsLeft((mode === "focus" ? focusMinutes : breakMinutes) * 60);
      }
      return !current;
    });
  }, [secondsLeft, mode, focusMinutes, breakMinutes]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft((mode === "focus" ? focusMinutes : breakMinutes) * 60);
  }, [mode, focusMinutes, breakMinutes]);

  const skipMode = useCallback(() => {
    const nextMode = mode === "focus" ? "break" : "focus";
    setIsRunning(false);
    setMode(nextMode);
    setSecondsLeft((nextMode === "focus" ? focusMinutes : breakMinutes) * 60);
  }, [mode, focusMinutes, breakMinutes]);

  const updateSettings = useCallback(
    ({ focus, breakTime, auto }) => {
      const safeFocus = Math.min(90, Math.max(5, Number(focus) || 25));
      const safeBreak = Math.min(30, Math.max(3, Number(breakTime) || 5));

      setFocusMinutes(safeFocus);
      setBreakMinutes(safeBreak);
      setAutoSwitch(Boolean(auto));
      setIsRunning(false);
      setSecondsLeft((mode === "focus" ? safeFocus : safeBreak) * 60);
    },
    [mode],
  );

  const switchToMode = useCallback(
    (nextMode) => {
      const safeMode = nextMode === "break" ? "break" : "focus";
      setMode(safeMode);
      setIsRunning(false);
      setSecondsLeft((safeMode === "focus" ? focusMinutes : breakMinutes) * 60);
    },
    [focusMinutes, breakMinutes],
  );

  const value = useMemo(() => {
    const today = dateKeyFromDate();
    const thisWeekKeys = getWeekKeys();
    const sessionsToday = sessionLog[today] ?? 0;
    const sessionsThisWeek = thisWeekKeys.reduce(
      (total, key) => total + (sessionLog[key] ?? 0),
      0,
    );
    const totalSessions = Object.values(sessionLog).reduce((sum, valueItem) => sum + valueItem, 0);

    return {
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
    };
  }, [
    mode,
    isRunning,
    secondsLeft,
    focusMinutes,
    breakMinutes,
    autoSwitch,
    sessionLog,
    toggleRunning,
    resetTimer,
    skipMode,
    updateSettings,
    switchToMode,
  ]);

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro must be used inside PomodoroProvider");
  }
  return context;
}
