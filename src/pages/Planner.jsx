import { useMemo, useState } from "react";
import clsx from "clsx";
import StatCard from "../components/StatCard";
import { usePlanner } from "../context/PlannerContext";
import { useToast } from "../context/ToastContext";
import { STUDY_TEMPLATE_BLOCKS } from "../data/dailyRoutine";
import {
  dateFromKey,
  dateKeyFromDate,
  formatDayShort,
  formatFriendlyDate,
  getMonthMatrix,
  getWeekKeys,
} from "../utils/date";

function Planner() {
  const { plans, plansByDate, addPlan, addPlansBatch, deletePlan, getWeeklyHours } = usePlanner();
  const { pushToast } = useToast();

  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(dateKeyFromDate());
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState(1);

  const todayKey = dateKeyFromDate();

  const calendarDays = useMemo(
    () => getMonthMatrix(monthCursor.getFullYear(), monthCursor.getMonth()),
    [monthCursor],
  );

  const selectedDayPlans = plansByDate[selectedDate] ?? [];
  const selectedWeekHours = Number(getWeeklyHours(dateFromKey(selectedDate)).toFixed(1));

  const monthlyHours = useMemo(() => {
    return Number(
      plans
        .filter((plan) => {
          const planDate = dateFromKey(plan.date);
          return (
            planDate.getFullYear() === monthCursor.getFullYear() &&
            planDate.getMonth() === monthCursor.getMonth()
          );
        })
        .reduce((sum, plan) => sum + Number(plan.hours), 0)
        .toFixed(1),
    );
  }, [plans, monthCursor]);

  const weeklySubjectBreakdown = useMemo(() => {
    const weekSet = new Set(getWeekKeys(dateFromKey(selectedDate)));

    return Object.entries(
      plans.reduce((summary, plan) => {
        if (!weekSet.has(plan.date)) {
          return summary;
        }

        summary[plan.subject] = (summary[plan.subject] ?? 0) + Number(plan.hours);
        return summary;
      }, {}),
    ).sort((a, b) => b[1] - a[1]);
  }, [plans, selectedDate]);

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(monthCursor);

  const handleAddPlan = (event) => {
    event.preventDefault();

    const isAdded = addPlan({
      date: selectedDate,
      subject,
      hours,
    });

    if (!isAdded) {
      pushToast("Enter a subject and hours greater than 0.", "error");
      return;
    }

    pushToast("Study block added.", "success");
    setSubject("");
    setHours(1);
  };

  const handleImportRoutineBlocks = () => {
    const addedCount = addPlansBatch({
      date: selectedDate,
      entries: STUDY_TEMPLATE_BLOCKS,
    });

    if (addedCount === 0) {
      pushToast("Study routine already exists for this day.", "info");
      return;
    }

    pushToast(`Imported ${addedCount} routine study block(s).`, "success");
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Selected Week" value={`${selectedWeekHours}h`} subtitle="Study hours planned" />
        <StatCard
          title="Current Month"
          value={`${monthlyHours}h`}
          subtitle="Total scheduled hours"
          accent="text-accent-700"
        />
        <StatCard
          title="Selected Day"
          value={`${selectedDayPlans.length} blocks`}
          subtitle={formatFriendlyDate(selectedDate)}
          accent="text-brand-700"
        />
        <StatCard
          title="All Study Entries"
          value={plans.length}
          subtitle="Persisted planner entries"
          accent="text-accent-700"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <article className="card-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setMonthCursor(
                  (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-600 hover:border-brand-200 hover:text-brand-700"
            >
              Prev
            </button>
            <h2 className="font-display text-lg font-bold text-slate-900">{monthLabel}</h2>
            <button
              type="button"
              onClick={() =>
                setMonthCursor(
                  (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-600 hover:border-brand-200 hover:text-brand-700"
            >
              Next
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
            {getWeekKeys().map((dateKey) => (
              <span key={`day-${dateKey}`}>{formatDayShort(dateKey)}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date) => {
              const dateKey = dateKeyFromDate(date);
              const dayPlans = plansByDate[dateKey] ?? [];
              const dayHours = dayPlans.reduce((sum, plan) => sum + Number(plan.hours), 0);
              const isCurrentMonth = date.getMonth() === monthCursor.getMonth();
              const isSelected = dateKey === selectedDate;
              const isToday = dateKey === todayKey;

              return (
                <button
                  type="button"
                  key={dateKey}
                  onClick={() => setSelectedDate(dateKey)}
                  className={clsx(
                    "h-24 rounded-xl border p-2 text-left transition",
                    isSelected
                      ? "border-brand-300 bg-brand-50"
                      : "border-slate-200 bg-white hover:border-brand-200 hover:bg-brand-50/40",
                    !isCurrentMonth ? "opacity-45" : "",
                  )}
                >
                  <p
                    className={clsx(
                      "text-xs font-bold",
                      isToday ? "text-brand-700" : "text-slate-600",
                    )}
                  >
                    {date.getDate()}
                  </p>
                  {dayPlans.length > 0 ? (
                    <div className="mt-2 space-y-1">
                      <p className="text-[11px] font-semibold text-slate-700">{dayPlans.length} block(s)</p>
                      <p className="text-[11px] text-slate-500">{dayHours.toFixed(1)}h</p>
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </article>

        <div className="space-y-4">
          <article className="card-surface p-5">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Add Plan for {formatFriendlyDate(selectedDate)}
            </h2>
            <button
              type="button"
              onClick={handleImportRoutineBlocks}
              className="mt-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand-700 hover:bg-brand-100"
            >
              Import My Routine Study Blocks
            </button>
            <form onSubmit={handleAddPlan} className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Subject
                </span>
                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Data Structures"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 transition focus:border-brand-300 focus:ring"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Hours
                </span>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 transition focus:border-brand-300 focus:ring"
                />
              </label>
              <button
                type="submit"
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
              >
                Add Study Block
              </button>
            </form>
          </article>

          <article className="card-surface p-5">
            <h2 className="font-display text-lg font-bold text-slate-900">Selected Day Blocks</h2>
            <div className="mt-3 space-y-3">
              {selectedDayPlans.length === 0 ? (
                <p className="text-sm text-slate-500">No plans for this day yet.</p>
              ) : (
                selectedDayPlans.map((plan) => (
                  <div key={plan.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="font-semibold text-slate-800">{plan.subject}</p>
                    <p className="mt-1 text-xs text-slate-500">{plan.hours}h scheduled</p>
                    <button
                      type="button"
                      onClick={() => {
                        deletePlan(plan.id);
                        pushToast("Study block removed.", "info");
                      }}
                      className="mt-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-rose-200 hover:text-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="card-surface p-5">
            <h2 className="font-display text-lg font-bold text-slate-900">Week Subject Breakdown</h2>
            <div className="mt-3 space-y-2">
              {weeklySubjectBreakdown.length === 0 ? (
                <p className="text-sm text-slate-500">No study hours logged in the selected week.</p>
              ) : (
                weeklySubjectBreakdown.map(([subjectName, totalHours]) => (
                  <div
                    key={`subject-${subjectName}`}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2"
                  >
                    <p className="text-sm font-semibold text-slate-700">{subjectName}</p>
                    <p className="text-xs font-bold text-brand-700">{totalHours.toFixed(1)}h</p>
                  </div>
                ))
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Planner;
