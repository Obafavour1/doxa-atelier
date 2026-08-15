import { motion } from "framer-motion";

type LoadingSpinnerProps = {
  label?: string;
  compact?: boolean;
};

const LoadingSpinner = ({
  label = "Preparing your experience",
  compact = false,
}: LoadingSpinnerProps) => {
  if (compact) {
    return (
      <div className="flex items-center justify-center py-10" role="status" aria-live="polite">
        <div className="surface-card flex items-center gap-3 rounded-full px-5 py-3">
          <motion.span
            animate={{ scale: [1, 1.12, 1], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="brand-gradient grid h-9 w-9 place-items-center rounded-full text-[10px] font-bold text-white"
          >
            DG
          </motion.span>
          <span className="text-xs font-semibold text-[var(--text-secondary)]">{label}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[120] grid min-h-screen place-items-center overflow-hidden bg-[rgba(255,248,242,0.78)] px-6 backdrop-blur-xl"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-[var(--periwinkle)]/45 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[var(--blush)]/75 blur-3xl" />

      <div className="relative flex flex-col items-center text-center">
        <div className="relative grid h-40 w-64 place-items-center">
          <motion.span
            aria-hidden="true"
            className="absolute h-28 w-28 rounded-full border border-[var(--primary)]/25"
            animate={{ scale: [0.8, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute h-28 w-28 rounded-full border border-[var(--indigo)]/20"
            animate={{ scale: [0.8, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
          />
          <motion.div
            animate={{ scale: [1, 1.045, 1], y: [0, -3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="relative overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[var(--shadow-lg)]"
          >
            <img
              src="/doxa-atelier-logo-wide.png"
              alt="DOXA Atelier"
              className="h-28 w-52 object-cover"
            />
          </motion.div>
        </div>

        <p className="doxa-label mt-5 text-[var(--primary)]">DOXA Atelier</p>
        <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{label}</p>
        <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]"
              animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1, repeat: Infinity, delay: dot * 0.16 }}
            />
          ))}
        </div>
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
