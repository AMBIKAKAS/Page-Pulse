import { motion } from "framer-motion";

export default function MetricCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="group relative overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/70 p-8 backdrop-blur-xl shadow-lg"
    >
      {/* Background Glow */}

      <div
        className={`absolute -right-20 -top-20 h-52 w-52 rounded-full bg-gradient-to-br ${color} opacity-10 blur-3xl transition-all duration-500 group-hover:opacity-40`}
      />

      {/* Icon */}

      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}
      >
        {icon}
      </div>

      {/* Heading */}

      <p className="mt-7 text-xs font-semibold uppercase tracking-[5px] text-slate-400">
        {title}
      </p>

      {/* Divider */}

      <div className="my-5 h-px bg-slate-700"></div>

      {/* Value */}

      <div className="max-h-44 overflow-y-auto break-words pr-1 text-3xl font-bold leading-relaxed text-white scrollbar-thin scrollbar-thumb-slate-700">

        {value || "-"}

      </div>

      {/* Bottom Accent */}

      <div
        className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${color}`}
      />
    </motion.div>
  );
}
