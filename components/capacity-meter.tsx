import { Users } from "lucide-react";

export function CapacityMeter({
  joinedCount = 0,
  capacity,
  className = "",
}: {
  joinedCount?: number;
  capacity?: number | null;
  className?: string;
}) {
  if (!capacity) {
    return (
      <div className={`flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 ${className}`}>
        <Users size={13} className="text-brand-600 dark:text-brand-400" />
        {joinedCount} {joinedCount === 1 ? "volunteer" : "volunteers"} joined
      </div>
    );
  }

  const spotsLeft = Math.max(capacity - joinedCount, 0);
  const percentage = Math.min(100, Math.round((joinedCount / capacity) * 100));
  const isFull = spotsLeft === 0;
  const almostFull = spotsLeft <= Math.max(1, Math.ceil(capacity * 0.2));

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <span className="text-neutral-500 dark:text-neutral-400">
          {joinedCount}/{capacity} volunteers
        </span>
        <span
          className={
            isFull
              ? "text-rose-600 dark:text-rose-400"
              : almostFull
                ? "text-amber-600 dark:text-amber-400"
                : "text-brand-700 dark:text-brand-400"
          }
        >
          {isFull ? "Full" : `${spotsLeft} spots left`}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isFull ? "bg-rose-500" : almostFull ? "bg-amber-500" : "bg-brand-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
