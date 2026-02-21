import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { addDaysToKey, dateKeyFromDate } from "../utils/date";
import { loadFromStorage, saveToStorage } from "../utils/localStorage";

const STORAGE_KEY = "focusflow.tasks";

function createSeedTasks() {
  const today = dateKeyFromDate();
  const tomorrow = addDaysToKey(today, 1);
  const inThreeDays = addDaysToKey(today, 3);

  return [
    {
      id: "task-seed-1",
      title: "Plan tomorrow in Study Planner",
      completed: false,
      priority: "High",
      dueDate: today,
      createdAt: `${today}T08:00:00`,
    },
    {
      id: "task-seed-2",
      title: "Complete one 25-minute focus sprint",
      completed: false,
      priority: "Medium",
      dueDate: tomorrow,
      createdAt: `${today}T09:30:00`,
    },
    {
      id: "task-seed-3",
      title: "Review weekly habit streaks",
      completed: false,
      priority: "Low",
      dueDate: inThreeDays,
      createdAt: `${today}T10:45:00`,
    },
  ];
}

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => loadFromStorage(STORAGE_KEY, createSeedTasks()));

  useEffect(() => {
    saveToStorage(STORAGE_KEY, tasks);
  }, [tasks]);

  const addTask = useCallback(({ title, priority, dueDate }) => {
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      title: title.trim(),
      completed: false,
      priority,
      dueDate,
      createdAt: new Date().toISOString(),
    };

    setTasks((current) => [newTask, ...current]);
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    );
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  }, []);

  const reorderTasks = useCallback((sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex || sourceIndex < 0 || targetIndex < 0) {
      return;
    }

    setTasks((current) => {
      if (sourceIndex >= current.length || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  }, []);

  const todayKey = dateKeyFromDate();

  const value = useMemo(() => {
    const completedCount = tasks.filter((task) => task.completed).length;
    const todayTasks = tasks.filter((task) => task.dueDate === todayKey);

    return {
      tasks,
      addTask,
      updateTask,
      toggleTask,
      deleteTask,
      reorderTasks,
      completedCount,
      pendingCount: tasks.length - completedCount,
      todayTasks,
    };
  }, [tasks, addTask, updateTask, toggleTask, deleteTask, reorderTasks, todayKey]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used inside TaskProvider");
  }
  return context;
}
