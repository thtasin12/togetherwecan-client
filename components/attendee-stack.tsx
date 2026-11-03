import { Users } from "lucide-react";
import { initials } from "@/lib/format";
import type { Attendee } from "@/lib/types";

export function AttendeeStack({
  attendees,
  max = 5,
  showLabel = true,
}: {
  attendees: Attendee[];
  max?: number;
  showLabel?: boolean;
}) {
  if (!attendees.length) return null;
  const visible = attendees.slice(0, max);
  const extra = attendees.length - visible.length;

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2.5">
        {visible.map((attendee) => (
          <span
            key={attendee.email}
            title={attendee.name}
            className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-brand-100 text-[11px] font-extrabold text-brand-700 dark:border-neutral-900 dark:bg-brand-950 dark:text-brand-300"
          >
            {attendee.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={attendee.photoURL}
                alt={attendee.name}
                className="h-full w-full object-cover"
              />
            ) : (
              initials(attendee.name)
            )}
          </span>
        ))}
        {extra > 0 && (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-neutral-900 text-[10px] font-bold text-white dark:border-neutral-900 dark:bg-white dark:text-neutral-900">
            +{extra}
          </span>
        )}
      </div>
      {showLabel && (
        <span className="flex items-center gap-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <Users size={13} /> {attendees.length} going
        </span>
      )}
    </div>
  );
}
