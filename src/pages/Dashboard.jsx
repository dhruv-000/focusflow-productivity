import { useMemo } from "react";
import StatCard from "../components/StatCard";
import ProgressRing from "../components/ProgressRing";
import RoutineTimeline from "../components/RoutineTimeline";
import { useTasks } from "../context/TaskContext";
import { useHabits } from "../context/HabitContext";
import { usePomodoro } from "../context/PomodoroContext";
import { usePlanner } from "../context/PlannerContext";
import { OWNER_NAME } from "../config/branding";
import { dateKeyFromDate, formatFriendlyDate } from "../utils/date";

const QUOTES = [
  "Discipline is choosing what matters most over what feels easiest now.",
  "A focused hour beats a distracted day.",
  "Consistency turns intention into identity.",
  "Tiny progress, repeated daily, creates big outcomes.",
  "Plan deeply, execute simply.",
];

function Dashboard() {
  const { tasks, completedCount, todayTasks } = useTasks();
  const { completionRate, habits } = useHabits();
  const { sessionsToday, sessionsThisWeek } = usePomodoro();
  const { plansByDate, getWeeklyHours } = usePlanner();

  const todayKey = dateKeyFromDate();
  const todayPlans = plansByDate[todayKey] ?? [];

  const dashboardSummary = useMemo(() => {
    const todaysCompleted = todayTasks.filter((task) => task.completed).length;
    const taskCompletionRate =
      todayTasks.length === 0 ? 0 : Math.round((todaysCompleted / todayTasks.length) * 100);
    const weeklyHours = Number(getWeeklyHours(new Date()).toFixed(1));

    const productivityScore = Math.round(
      taskCompletionRate * 0.35 + completionRate * 0.35 + Math.min(sessionsToday / 6, 1) * 30,
    );

    const priorityRank = { High: 0, Medium: 1, Low: 2 };
    const upcomingTasks = tasks
      .filter((task) => !task.completed)
      .sort((a, b) => {
        if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) {
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (a.priority !== b.priority) {
          return priorityRank[a.priority] - priorityRank[b.priority];
        }
        return a.title.localeCompare(b.title);
      })
      .slice(0, 5);

    return {
      todaysCompleted,
      taskCompletionRate,
      weeklyHours,
      productivityScore: Math.max(0, Math.min(100, productivityScore)),
      upcomingTasks,
    };
  }, [todayTasks, getWeeklyHours, completionRate, sessionsToday, tasks]);

  const quoteOfTheDay = QUOTES[new Date().getDate() % QUOTES.length];

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Completed Tasks"
          value={`${completedCount}/${tasks.length}`}
          subtitle={`${dashboardSummary.todaysCompleted} done today`}
        />
        <StatCard
          title="Habit Progress"
          value={`${completionRate}%`}
          subtitle={`${habits.length} active habits`}
          accent="text-brand-700"
        />
        <StatCard
          title="Pomodoro Sessions"
          value={sessionsToday}
          subtitle={`${sessionsThisWeek} this week`}
          accent="text-accent-700"
        />
        <StatCard
          title="Planned Study Hours"
          value={`${dashboardSummary.weeklyHours}h`}
          subtitle="Current week total"
          accent="text-brand-700"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[16rem_1fr]">
        <ProgressRing value={dashboardSummary.productivityScore} label="Daily Productivity Score" />

        <div className="card-surface p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
            {OWNER_NAME}&apos;s focus quote
          </p>
          <p className="mt-3 max-w-3xl font-display text-2xl font-bold leading-snug text-slate-900">
            "{quoteOfTheDay}"
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Keep momentum with one concrete action in each module: task, habit, focus sprint, and study
            block.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-surface p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900">Upcoming Tasks</h2>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
              {dashboardSummary.upcomingTasks.length} items
            </span>
          </div>

          {dashboardSummary.upcomingTasks.length === 0 ? (
            <p className="text-sm text-slate-500">No pending tasks. Add new tasks in the Task Manager.</p>
          ) : (
            <ul className="space-y-3">
              {dashboardSummary.upcomingTasks.map((task) => (
                <li key={task.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="font-semibold text-slate-800">{task.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {task.priority} priority - Due{" "}
                    {task.dueDate ? formatFriendlyDate(task.dueDate) : "No deadline"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-surface p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900">Today&apos;s Study Plan</h2>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
              {todayPlans.length} blocks
            </span>
          </div>

          {todayPlans.length === 0 ? (
            <p className="text-sm text-slate-500">
              No plans scheduled for today. Add a block in Study Planner.
            </p>
          ) : (
            <ul className="space-y-3">
              {todayPlans.map((plan) => (
                <li key={plan.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="font-semibold text-slate-800">{plan.subject}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {plan.hours}h - {formatFriendlyDate(plan.date)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <RoutineTimeline />
    </section>
  );
}

export default Dashboard;
