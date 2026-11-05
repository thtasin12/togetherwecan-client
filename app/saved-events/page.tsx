"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Search } from "lucide-react";
import { api } from "@/lib/api";
import type { CommunityEvent } from "@/lib/types";
import { EventCard } from "@/components/event-card";
import { EventGridSkeleton } from "@/components/skeletons";
import { Protected } from "@/components/protected";
import { Reveal } from "@/components/reveal";
import { toast } from "sonner";

function SavedInner() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ events: CommunityEvent[] }>("/api/saves/my")
      .then((data) => setEvents(data.events))
      .catch(() => toast.error("Could not load your saved events"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-400">
            <Heart size={13} /> Saved for later
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Your shortlist
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-500 dark:text-neutral-400">
            Events you want to keep an eye on. When you are ready, your next good deed is one click away.
          </p>
        </div>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          Find more events <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mt-9">
        {loading ? (
          <EventGridSkeleton count={3} />
        ) : events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <Reveal key={event._id} delay={index * 60}>
                <EventCard
                  event={event}
                  onSavedChange={(saved) => {
                    if (!saved) {
                      setEvents((current) => current.filter((item) => item._id !== event._id));
                    }
                  }}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <Search size={24} />
            </span>
            <h2 className="mt-4 text-xl font-extrabold text-neutral-900 dark:text-white">
              Nothing saved yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500 dark:text-neutral-400">
              Tap the heart on an event to build your shortlist. It is the easiest way to remember
              the causes that caught your eye.
            </p>
            <Link
              href="/events"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Browse events <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SavedEventsPage() {
  return (
    <Protected>
      <SavedInner />
    </Protected>
  );
}
