import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useToast } from "../context/ToastContext";

const typeStyles = {
  info: "border-brand-200 bg-brand-50 text-brand-800",
  success: "border-accent-200 bg-accent-50 text-accent-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
};

function ToastStack() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(22rem,calc(100%-2rem))] flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 24, y: -4 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              "pointer-events-auto flex items-start justify-between gap-3 rounded-xl border px-4 py-3 shadow-soft",
              typeStyles[toast.type] ?? typeStyles.info,
            )}
          >
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-xs font-bold uppercase tracking-wide opacity-70 hover:opacity-100"
            >
              Close
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastStack;
