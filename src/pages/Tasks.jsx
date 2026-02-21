import { useMemo, useState } from "react";
import clsx from "clsx";
import TaskCard from "../components/TaskCard";
import { useTasks } from "../context/TaskContext";
import { useToast } from "../context/ToastContext";
import { dateKeyFromDate } from "../utils/date";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Pending" },
  { id: "dueToday", label: "Due Today" },
  { id: "overdue", label: "Overdue" },
];

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

function Tasks() {
  const { tasks, addTask, updateTask, toggleTask, deleteTask, reorderTasks } = useTasks();
  const { pushToast } = useToast();

  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(dateKeyFromDate());
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [draggingTaskId, setDraggingTaskId] = useState(null);

  const todayKey = dateKeyFromDate();
  const canReorder = statusFilter === "all" && !searchQuery.trim();

  const visibleTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
        if (!matchesSearch) {
          return false;
        }

        if (statusFilter === "completed") {
          return task.completed;
        }
        if (statusFilter === "pending") {
          return !task.completed;
        }
        if (statusFilter === "dueToday") {
          return task.dueDate === todayKey;
        }
        if (statusFilter === "overdue") {
          return !task.completed && task.dueDate && task.dueDate < todayKey;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return Number(a.completed) - Number(b.completed);
        }
        if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) {
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (a.priority !== b.priority) {
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        }
        return a.title.localeCompare(b.title);
      });
  }, [tasks, searchQuery, statusFilter, todayKey]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!taskTitle.trim()) {
      pushToast("Task title is required.", "error");
      return;
    }

    const payload = {
      title: taskTitle,
      priority,
      dueDate,
    };

    if (editingTaskId) {
      updateTask(editingTaskId, payload);
      pushToast("Task updated.", "success");
    } else {
      addTask(payload);
      pushToast("Task added.", "success");
    }

    setTaskTitle("");
    setPriority("Medium");
    setDueDate(todayKey);
    setEditingTaskId(null);
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setPriority(task.priority);
    setDueDate(task.dueDate || todayKey);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setTaskTitle("");
    setPriority("Medium");
    setDueDate(todayKey);
  };

  const handleDropOnTask = (targetTaskId) => {
    if (!canReorder || !draggingTaskId || draggingTaskId === targetTaskId) {
      return;
    }

    const sourceIndex = tasks.findIndex((task) => task.id === draggingTaskId);
    const targetIndex = tasks.findIndex((task) => task.id === targetTaskId);

    if (sourceIndex >= 0 && targetIndex >= 0) {
      reorderTasks(sourceIndex, targetIndex);
      pushToast("Task order updated.", "info");
    }

    setDraggingTaskId(null);
  };

  return (
    <section className="space-y-6">
      <article className="card-surface p-5">
        <h2 className="font-display text-xl font-extrabold text-slate-900">
          {editingTaskId ? "Edit Task" : "Add Task"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="sm:col-span-2 lg:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Task Title
            </span>
            <input
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="Study React Router"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 transition focus:border-brand-300 focus:ring"
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Priority
            </span>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 transition focus:border-brand-300 focus:ring"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Due Date
            </span>
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 transition focus:border-brand-300 focus:ring"
            />
          </label>

          <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
            >
              {editingTaskId ? "Save Changes" : "Add Task"}
            </button>
            {editingTaskId ? (
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-200 hover:text-brand-700"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </article>

      <article className="card-surface p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="w-full lg:max-w-sm">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Search Tasks
            </span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by title..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 transition focus:border-brand-300 focus:ring"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setStatusFilter(filter.id)}
                className={clsx(
                  "rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wide transition",
                  statusFilter === filter.id
                    ? "border-brand-200 bg-brand-50 text-brand-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-brand-100 hover:text-brand-700",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {canReorder ? (
          <p className="mt-3 text-xs font-medium text-slate-500">
            Drag and drop is active while filter is All and search is empty.
          </p>
        ) : (
          <p className="mt-3 text-xs font-medium text-slate-500">
            Drag and drop is temporarily disabled for filtered/search results.
          </p>
        )}

        <div className="mt-4 space-y-3">
          {visibleTasks.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No tasks found. Try a different filter or add a new task.
            </p>
          ) : (
            visibleTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                draggable={canReorder}
                onDragStart={setDraggingTaskId}
                onDropOnTask={handleDropOnTask}
                onToggle={(taskId) => {
                  toggleTask(taskId);
                  pushToast("Task status updated.", "info");
                }}
                onEdit={handleEditTask}
                onDelete={(taskId) => {
                  deleteTask(taskId);
                  pushToast("Task removed.", "info");
                }}
              />
            ))
          )}
        </div>
      </article>
    </section>
  );
}

export default Tasks;
