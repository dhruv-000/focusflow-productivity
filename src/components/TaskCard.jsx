import clsx from "clsx";
import { dateKeyFromDate, formatFriendlyDate } from "../utils/date";

const priorityClasses = {
  High: "bg-rose-100 text-rose-700 border-rose-200",
  Medium: "bg-accent-100 text-accent-700 border-accent-200",
  Low: "bg-brand-100 text-brand-700 border-brand-200",
};

function TaskCard({
  task,
  draggable,
  onDragStart,
  onDropOnTask,
  onToggle,
  onEdit,
  onDelete,
}) {
  const today = dateKeyFromDate();
  const isOverdue = !task.completed && Boolean(task.dueDate) && task.dueDate < today;

  return (
    <article
      draggable={draggable}
      onDragStart={() => onDragStart(task.id)}
      onDragOver={(event) => {
        if (!draggable) {
          return;
        }
        event.preventDefault();
      }}
      onDrop={(event) => {
        if (!draggable) {
          return;
        }
        event.preventDefault();
        onDropOnTask(task.id);
      }}
      className={clsx(
        "card-surface border p-4 transition",
        draggable ? "cursor-grab active:cursor-grabbing" : "",
        task.completed ? "opacity-80" : "",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <label className="flex flex-1 cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <div>
            <p
              className={clsx(
                "font-semibold text-slate-800",
                task.completed ? "line-through decoration-2 text-slate-500" : "",
              )}
            >
              {task.title}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span
                className={clsx(
                  "rounded-full border px-2 py-1 font-semibold",
                  priorityClasses[task.priority] ?? priorityClasses.Medium,
                )}
              >
                {task.priority}
              </span>
              <span
                className={clsx(
                  "rounded-full border px-2 py-1 font-medium",
                  isOverdue
                    ? "border-rose-200 bg-rose-100 text-rose-700"
                    : "border-slate-200 bg-slate-100 text-slate-600",
                )}
              >
                Due {task.dueDate ? formatFriendlyDate(task.dueDate) : "No date"}
              </span>
            </div>
          </div>
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-brand-200 hover:text-brand-700"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
