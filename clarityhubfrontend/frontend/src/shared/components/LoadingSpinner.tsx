type LoadingSpinnerProps = {
  label?: string;
  compact?: boolean;
};

const LoadingSpinner = ({
  label = "Loading experience",
  compact = false,
}: LoadingSpinnerProps) => {
  return (
    <div
      className={compact ? "flex items-center justify-center py-10" : "flex min-h-screen items-center justify-center"}
      role="status"
      aria-live="polite"
    >
      <div className="surface-card flex items-center gap-4 rounded-[28px] px-6 py-5">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border border-brand-200/20" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand-400 border-r-brand-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="text-sm text-[var(--text-secondary)]">Preparing your DOXA experience</p>
        </div>
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
