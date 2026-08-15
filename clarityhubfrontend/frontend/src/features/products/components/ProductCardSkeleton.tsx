type ProductCardSkeletonProps = {
  compact?: boolean;
};

const shimmerClass = "animate-pulse bg-gradient-to-r from-[var(--petal)] via-white to-[var(--petal)] motion-reduce:animate-none";

const ProductCardSkeleton = ({ compact = false }: ProductCardSkeletonProps) => (
  <article
    className="surface-card flex w-full flex-col overflow-hidden rounded-xl bg-white"
    aria-hidden="true"
  >
    <div className={`relative ${compact ? "h-56" : "h-60"} overflow-hidden bg-[var(--petal)]`}>
      <div className={`absolute inset-0 ${shimmerClass}`} />
      <div className="absolute left-3 top-3 h-6 w-20 animate-pulse rounded-full bg-white/90 motion-reduce:animate-none" />
    </div>

    <div className={`flex flex-1 flex-col ${compact ? "space-y-3" : "gap-4"} p-4`}>
      <div className="space-y-2">
        <div className={`h-5 w-3/4 rounded-md ${shimmerClass}`} />
        <div className={`h-3.5 w-full rounded-md ${shimmerClass}`} />
        <div className={`h-3.5 w-2/3 rounded-md ${shimmerClass}`} />
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <div className={`h-6 w-24 rounded-md ${shimmerClass}`} />
        <div className={`h-10 w-20 rounded-full ${shimmerClass}`} />
      </div>
    </div>
  </article>
);

export default ProductCardSkeleton;
