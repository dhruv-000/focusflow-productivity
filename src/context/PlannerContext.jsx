import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { addDaysToKey, dateKeyFromDate, getWeekKeys } from "../utils/date";
import { loadFromStorage, saveToStorage } from "../utils/localStorage";

const STORAGE_KEY = "focusflow.plans";

function createSeedPlans() {
  const today = dateKeyFromDate();

  return [
    {
      id: "plan-seed-1",
      date: today,
      subject: "React Revision",
      hours: 1.5,
      createdAt: `${today}T07:30:00`,
    },
    {
      id: "plan-seed-2",
      date: addDaysToKey(today, 1),
      subject: "DSA Practice",
      hours: 2,
      createdAt: `${today}T08:15:00`,
    },
    {
      id: "plan-seed-3",
      date: addDaysToKey(today, 2),
      subject: "System Design Notes",
      hours: 1,
      createdAt: `${today}T08:45:00`,
    },
  ];
}

const PlannerContext = createContext(null);

export function PlannerProvider({ children }) {
  const [plans, setPlans] = useState(() => loadFromStorage(STORAGE_KEY, createSeedPlans()));

  useEffect(() => {
    saveToStorage(STORAGE_KEY, plans);
  }, [plans]);

  const addPlan = useCallback(({ date, subject, hours }) => {
    const safeHours = Number(hours);
    if (!subject.trim() || !date || Number.isNaN(safeHours) || safeHours <= 0) {
      return false;
    }

    const plan = {
      id: `plan-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      date,
      subject: subject.trim(),
      hours: Number(safeHours.toFixed(2)),
      createdAt: new Date().toISOString(),
    };

    setPlans((current) => [plan, ...current]);
    return true;
  }, []);

  const addPlansBatch = useCallback(({ date, entries }) => {
    if (!date || !Array.isArray(entries) || entries.length === 0) {
      return 0;
    }

    let added = 0;

    setPlans((current) => {
      const next = [...current];
      const existingSubjectsForDay = new Set(
        current
          .filter((plan) => plan.date === date)
          .map((plan) => plan.subject.trim().toLowerCase()),
      );

      entries.forEach((entry) => {
        const rawSubject = typeof entry.subject === "string" ? entry.subject : "";
        const safeSubject = rawSubject.trim();
        const safeHours = Number(entry.hours);

        if (!safeSubject || Number.isNaN(safeHours) || safeHours <= 0) {
          return;
        }

        const subjectKey = safeSubject.toLowerCase();
        if (existingSubjectsForDay.has(subjectKey)) {
          return;
        }

        existingSubjectsForDay.add(subjectKey);
        added += 1;

        next.unshift({
          id: `plan-${Date.now()}-${Math.random().toString(16).slice(2, 8)}-${added}`,
          date,
          subject: safeSubject,
          hours: Number(safeHours.toFixed(2)),
          createdAt: new Date().toISOString(),
        });
      });

      return next;
    });

    return added;
  }, []);

  const updatePlan = useCallback((id, updates) => {
    setPlans((current) =>
      current.map((plan) => (plan.id === id ? { ...plan, ...updates } : plan)),
    );
  }, []);

  const deletePlan = useCallback((id) => {
    setPlans((current) => current.filter((plan) => plan.id !== id));
  }, []);

  const plansByDate = useMemo(() => {
    return plans.reduce((collection, plan) => {
      if (!collection[plan.date]) {
        collection[plan.date] = [];
      }
      collection[plan.date].push(plan);
      return collection;
    }, {});
  }, [plans]);

  const getWeeklyHours = useCallback(
    (anchorDate = new Date()) => {
      const weekKeySet = new Set(getWeekKeys(anchorDate));
      return plans.reduce(
        (total, plan) => (weekKeySet.has(plan.date) ? total + Number(plan.hours) : total),
        0,
      );
    },
    [plans],
  );

  const value = useMemo(
    () => ({
      plans,
      plansByDate,
      addPlan,
      addPlansBatch,
      updatePlan,
      deletePlan,
      getWeeklyHours,
    }),
    [plans, plansByDate, addPlan, addPlansBatch, updatePlan, deletePlan, getWeeklyHours],
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error("usePlanner must be used inside PlannerProvider");
  }
  return context;
}
