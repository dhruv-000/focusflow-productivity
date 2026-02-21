function formatTimer(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const minutesPart = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const secondsPart = String(safeSeconds % 60).padStart(2, "0");
  return `${minutesPart}:${secondsPart}`;
}

function TimerDisplay({
  mode,
  isRunning,
  secondsLeft,
  totalSeconds,
  onToggle,
  onReset,
  onSkip,
}) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const strokeOffset = circumference * (1 - Math.max(0, Math.min(progressRatio, 1)));

  return (
    <article className="card-surface p-6 sm:p-8">
      <div className="mx-auto flex max-w-sm flex-col items-center text-center">
        <div className="relative h-56 w-56">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 220 220">
            <circle
              cx="110"
              cy="110"
              r={radius}
              className="fill-none stroke-slate-200"
              strokeWidth="14"
            />
            <circle
              cx="110"
              cy="110"
              r={radius}
              className={mode === "focus" ? "fill-none stroke-brand-500" : "fill-none stroke-accent-500"}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              style={{ transition: "stroke-dashoffset 0.45s linear" }}
            />
          </svg>

          <div className="absolute inset-0 grid place-items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                {mode === "focus" ? "Focus Session" : "Break Session"}
              </p>
              <p className="mt-2 font-display text-5xl font-extrabold tracking-tight text-slate-900">
                {formatTimer(secondsLeft)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-soft hover:bg-brand-700"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-200 hover:text-brand-700"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-200 hover:text-brand-700"
          >
            Skip
          </button>
        </div>
      </div>
    </article>
  );
}

export default TimerDisplay;
