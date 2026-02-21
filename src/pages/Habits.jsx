import { useMemo, useState } from "react";
import HabitCard from "../components/HabitCard";
import StatCard from "../components/StatCard";
import { useHabits } from "../context/HabitContext";
import { useToast } from "../context/ToastContext";
import { formatDayShort, getTrailingDateKeys } from "../utils/date";

function Habits() {
  const { habits, addHabit, deleteHabit, toggleHabitToday, completionRate, weeklyActivity } = useHabits();
  const { pushToast } = useToast();

  const [habitName, setHabitName] = useState("");

  const trailingWeek = useMemo(() => getTrailingDateKeys(7), []);

  const handleAddHabit = (event) => {
    event.preventDefault();

    const isAdded = addHabit(habitName);
    if (!isAdded) {
      pushToast("Habit name is required.", "error");
      return;
    }

    pushToast("Habit added.", "success");
    setHabitName("");
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Habit Completion Today"
          value={`${completionRate}%`}
          subtitle={`${habits.filter((habit) => habit.completedToday).length} of ${habits.length} completed`}
          accent="text-brand-700"
        />
        <StatCard
          title="Active Habits"
          value={habits.length}
          subtitle="Track only habits you can sustain"
        />
        <StatCard
          title="Best Streak"
          value={`${Math.max(0, ...habits.map((habit) => habit.streak))} days`}
          subtitle="Current longest active streak"
          accent="text-accent-700"
        />
      </div>

      <article className="card-surface p-5">
        <h2 className="font-display text-xl font-extrabold text-slate-900">Add Habit</h2>
        <form onSubmit={handleAddHabit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={habitName}
            onChange={(event) => setHabitName(event.target.value)}
            placeholder="Example: Practice coding 45 min"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 transition focus:border-brand-300 focus:ring"
          />
          <button
            type="submit"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
          >
            Add Habit
          </button>
        </form>
      </article>

      <article className="card-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">Weekly Completion Trend</h2>
          <span className="text-xs font-semibold text-slate-500">Last 7 days</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weeklyActivity.map((day) => {
            const ratio = day.totalHabits === 0 ? 0 : day.completedCount / day.totalHabits;
            return (
              <div key={day.dateKey} className="flex flex-col items-center gap-2">
                <div className="flex h-28 w-full items-end rounded-xl bg-slate-100 p-1">
                  <div
                    className="w-full rounded-lg bg-brand-500 transition-all"
                    style={{ height: `${Math.max(8, Math.round(ratio * 100))}%` }}
                  />
                </div>
                <p className="text-xs font-semibold text-slate-500">{day.label}</p>
              </div>
            );
          })}
        </div>
      </article>

      <div className="space-y-3">
        {habits.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No habits yet. Add one to start building your streak.
          </p>
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              weekSnapshot={trailingWeek.map((dateKey) => habit.completedDates.includes(dateKey))}
              onToggleToday={(habitId) => {
                toggleHabitToday(habitId);
                pushToast("Habit updated for today.", "info");
              }}
              onDelete={(habitId) => {
                deleteHabit(habitId);
                pushToast("Habit removed.", "info");
              }}
            />
          ))
        )}
      </div>

      <article className="card-surface p-5">
        <h2 className="font-display text-lg font-bold text-slate-900">Week Snapshot</h2>
        <p className="mt-1 text-sm text-slate-500">
          {trailingWeek.map((dateKey) => formatDayShort(dateKey)).join(" / ")}
        </p>
      </article>
    </section>
  );
}

export default Habits;
