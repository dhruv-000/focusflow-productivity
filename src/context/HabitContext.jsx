import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { addDaysToKey, dateKeyFromDate, formatDayShort, getTrailingDateKeys } from "../utils/date";
import { loadFromStorage, saveToStorage } from "../utils/localStorage";

const STORAGE_KEY = "focusflow.habits";

function calculateStreak(completedDates) {
  if (!completedDates.length) {
    return 0;
  }

  const completedSet = new Set(completedDates);
  const today = dateKeyFromDate();
  const yesterday = addDaysToKey(today, -1);

  let cursor = null;
  if (completedSet.has(today)) {
    cursor = today;
  } else if (completedSet.has(yesterday)) {
    cursor = yesterday;
  }

  if (!cursor) {
    return 0;
  }

  let streak = 0;
  while (completedSet.has(cursor)) {
    streak += 1;
    cursor = addDaysToKey(cursor, -1);
  }

  return streak;
}

function createSeedHabits() {
  const today = dateKeyFromDate();
  const yesterday = addDaysToKey(today, -1);
  const twoDaysAgo = addDaysToKey(today, -2);
  const threeDaysAgo = addDaysToKey(today, -3);

  return [
    {
      id: "habit-seed-1",
      name: "Deep Work (60m)",
      completedDates: [threeDaysAgo, twoDaysAgo, yesterday, today],
      createdAt: `${today}T08:30:00`,
    },
    {
      id: "habit-seed-2",
      name: "Meditation",
      completedDates: [twoDaysAgo, yesterday],
      createdAt: `${today}T09:10:00`,
    },
    {
      id: "habit-seed-3",
      name: "Read 15 pages",
      completedDates: [threeDaysAgo, yesterday, today],
      createdAt: `${today}T09:45:00`,
    },
  ];
}

const HabitContext = createContext(null);

export function HabitProvider({ children }) {
  const [habits, setHabits] = useState(() => loadFromStorage(STORAGE_KEY, createSeedHabits()));

  useEffect(() => {
    saveToStorage(STORAGE_KEY, habits);
  }, [habits]);

  const addHabit = useCallback((name) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return false;
    }

    const newHabit = {
      id: `habit-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      name: trimmedName,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    setHabits((current) => [newHabit, ...current]);
    return true;
  }, []);

  const deleteHabit = useCallback((id) => {
    setHabits((current) => current.filter((habit) => habit.id !== id));
  }, []);

  const toggleHabitToday = useCallback((id) => {
    const today = dateKeyFromDate();

    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== id) {
          return habit;
        }

        const completedSet = new Set(habit.completedDates);
        if (completedSet.has(today)) {
          completedSet.delete(today);
        } else {
          completedSet.add(today);
        }

        return {
          ...habit,
          completedDates: Array.from(completedSet).sort(),
        };
      }),
    );
  }, []);

  const todayKey = dateKeyFromDate();

  const hydratedHabits = useMemo(
    () =>
      habits.map((habit) => ({
        ...habit,
        streak: calculateStreak(habit.completedDates),
        completedToday: habit.completedDates.includes(todayKey),
      })),
    [habits, todayKey],
  );

  const weeklyActivity = useMemo(() => {
    const weekKeys = getTrailingDateKeys(7);

    return weekKeys.map((dateKey) => ({
      dateKey,
      label: formatDayShort(dateKey),
      completedCount: habits.filter((habit) => habit.completedDates.includes(dateKey)).length,
      totalHabits: habits.length,
    }));
  }, [habits]);

  const value = useMemo(() => {
    const completedTodayCount = hydratedHabits.filter((habit) => habit.completedToday).length;
    const completionRate =
      hydratedHabits.length === 0
        ? 0
        : Math.round((completedTodayCount / hydratedHabits.length) * 100);

    return {
      habits: hydratedHabits,
      addHabit,
      deleteHabit,
      toggleHabitToday,
      completedTodayCount,
      completionRate,
      weeklyActivity,
    };
  }, [hydratedHabits, addHabit, deleteHabit, toggleHabitToday, weeklyActivity]);

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be used inside HabitProvider");
  }
  return context;
}
