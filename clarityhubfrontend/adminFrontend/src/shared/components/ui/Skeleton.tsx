import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "animate-pulse rounded-2xl bg-[linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.12),rgba(255,255,255,0.06))] bg-[length:200%_100%]",
      className,
    )}
    {...props}
  />
);

export default Skeleton;
