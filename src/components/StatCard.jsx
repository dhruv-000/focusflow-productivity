import { motion } from "framer-motion";

function StatCard({ title, value, subtitle, accent = "text-brand-600" }) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      className="card-surface p-5"
      transition={{ duration: 0.15 }}
    >
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className={`mt-2 font-display text-3xl font-extrabold tracking-tight ${accent}`}>{value}</p>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </motion.article>
  );
}

export default StatCard;
