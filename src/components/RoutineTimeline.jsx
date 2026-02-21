import clsx from "clsx";
import { DAILY_ROUTINE } from "../data/dailyRoutine";
import { OWNER_NAME } from "../config/branding";

const categoryStyles = {
  Wellness: "bg-brand-100 text-brand-700",
  Mind: "bg-accent-100 text-accent-700",
  Meal: "bg-accent-50 text-accent-700",
  Study: "bg-brand-100 text-brand-700",
  Routine: "bg-slate-200 text-slate-700",
  College: "bg-slate-100 text-slate-700",
  Fitness: "bg-accent-100 text-accent-700",
  Rest: "bg-brand-200 text-brand-700",
};

function RoutineTimeline() {
  return (
    <article className="card-surface p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold text-slate-900">{OWNER_NAME}&apos;s Daily Routine</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {DAILY_ROUTINE.length} slots
        </span>
      </div>

      <div className="space-y-2">
        {DAILY_ROUTINE.map((slot) => (
          <div
            key={slot.id}
            className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{slot.time}</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">{slot.activity}</p>
            </div>
            <span
              className={clsx(
                "w-fit rounded-full px-2.5 py-1 text-xs font-bold",
                categoryStyles[slot.category] ?? categoryStyles.Routine,
              )}
            >
              {slot.category}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default RoutineTimeline;
