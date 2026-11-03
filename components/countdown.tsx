"use client";

import { useEffect, useState } from "react";

function parts(ms: number) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60_000));
  return {
    days: Math.floor(totalMinutes / (60 * 24)),
    hours: Math.floor((totalMinutes % (60 * 24)) / 60),
    minutes: totalMinutes % 60,
  };
}

export function Countdown({ date, compact = false }: { date: string; compact?: boolean }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(new Date(date).getTime() - Date.now());
    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => window.clearInterval(timer);
  }, [date]);

  if (remaining === null) {
    return (
      <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
        Starts soon
      </span>
    );
  }

  if (remaining <= 0) {
    return (
      <span className="inline-flex rounded-full bg-neutral-900 px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-neutral-900">
        Happening now
      </span>
    );
  }

  const value = parts(remaining);

  if (compact) {
    return (
      <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">
        {value.days > 0 ? `${value.days}d ${value.hours}h` : `${value.hours}h ${value.minutes}m`} left
      </span>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: "Days", value: value.days },
        { label: "Hours", value: value.hours },
        { label: "Mins", value: value.minutes },
      ].map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-center backdrop-blur"
        >
          <p className="text-xl font-extrabold tabular-nums text-white">{String(item.value).padStart(2, "0")}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
