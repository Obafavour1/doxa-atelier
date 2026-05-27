import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export const Table = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className="overflow-hidden rounded-[28px] border border-white/8">
    <div className="overflow-x-auto">
      <table className={cn("min-w-full divide-y divide-white/8 text-left", className)}>{children}</table>
    </div>
  </div>
);

export default Table;
