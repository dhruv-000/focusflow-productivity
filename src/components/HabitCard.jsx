import clsx from "clsx";

function HabitCard({ habit, weekSnapshot, onToggleToday, onDelete }) {
  const completedThisWeek = weekSnapshot.filter(Boolean).length;

  return (
    <article className="card-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900">{habit.name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {habit.streak} day streak - {completedThisWeek}/7 this week
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleToday(habit.id)}
            className={clsx(
              "rounded-lg border px-3 py-2 text-xs font-bold uppercase tracking-wide transition",
              habit.completedToday
                ? "border-brand-200 bg-brand-100 text-brand-700"
                : "border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100",
            )}
          >
            {habit.completedToday ? "Done Today" : "Mark Today"}
          </button>
          <button
            type="button"
            onClick={() => onDelete(habit.id)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:border-rose-200 hover:text-rose-700"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {weekSnapshot.map((completed, index) => (
          <div
            key={`${habit.id}-week-${index}`}
            className={clsx(
              "h-3 rounded-full",
              completed ? "bg-brand-500" : "bg-slate-200",
            )}
          />
        ))}
      </div>
    </article>
  );
}

export default HabitCard;
