function ProgressRing({ value, label }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const normalized = Math.max(0, Math.min(value, 100));
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="card-surface flex flex-col items-center gap-3 p-6 text-center">
      <div className="relative h-28 w-28">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="fill-none stroke-slate-200"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="fill-none stroke-brand-500 transition-all duration-500"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-display text-2xl font-extrabold text-slate-900">{normalized}%</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-600">{label}</p>
    </div>
  );
}

export default ProgressRing;
