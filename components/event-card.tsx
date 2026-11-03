import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";
import { CapacityMeter } from "@/components/capacity-meter";
import { Countdown } from "@/components/countdown";
import { SaveButton } from "@/components/save-button";
import { dateParts, formatDate } from "@/lib/format";
import { eventStyle } from "@/lib/event-style";
import type { CommunityEvent } from "@/lib/types";

export { formatDate };

export function EventCard({
  event,
  onSavedChange,
}: {
  event: CommunityEvent;
  onSavedChange?: (saved: boolean) => void;
}) {
  const style = eventStyle(event.eventType);
  const Icon = style.icon;
  const date = dateParts(event.date);
  const joinedCount = event.joinedCount ?? 0;

  return (
    <article className="event-card group relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-[0_10px_40px_-24px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-[0_24px_60px_-28px_rgba(22,163,74,0.45)] dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-brand-700">
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail}
          alt={event.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/5 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${style.badge}`}>
            <Icon size={12} /> {event.eventType}
          </span>
          {event.isFull && (
            <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-lg">
              Full
            </span>
          )}
          {event.joined && (
            <span className="rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-lg">
              Going
            </span>
          )}
        </div>

        <SaveButton
          eventId={event._id}
          saved={event.saved}
          onChange={onSavedChange}
          className="absolute right-4 top-4 border-white/50 bg-white/90"
        />

        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <div className="rounded-2xl bg-white/95 px-3 py-2 text-center text-neutral-900 shadow-xl backdrop-blur">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600">{date.month}</p>
            <p className="text-2xl font-black leading-none">{date.day}</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase text-neutral-400">{date.weekday}</p>
          </div>
          <div className="text-white">
            <p className="text-xs font-semibold text-white/80">{date.time}</p>
            <Countdown date={event.date} compact />
          </div>
        </div>
      </div>

      <div className="event-body flex flex-1 flex-col p-5">
        <Link href={`/events/${event._id}`} className="outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900">
          <h3 className="line-clamp-2 text-lg font-extrabold leading-snug tracking-tight text-neutral-900 transition group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-400">
            {event.title}
          </h3>
        </Link>

        <div className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
          <p className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0 text-brand-600 dark:text-brand-400" />
            <span className="truncate">{event.location}</span>
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays size={14} className="shrink-0 text-brand-600 dark:text-brand-400" />
            {formatDate(event.date)}
          </p>
        </div>

        <div className="mt-4">
          <CapacityMeter joinedCount={joinedCount} capacity={event.capacity} />
          {Boolean(event.waitlistCount) && (
            <p className="mt-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              {event.waitlistCount} on the waitlist
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            <Users size={14} className="text-brand-600 dark:text-brand-400" />
            {joinedCount} {joinedCount === 1 ? "volunteer" : "volunteers"}
          </span>
          <Link
            href={`/events/${event._id}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 transition group-hover:gap-2 dark:text-brand-400"
          >
            View details <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
