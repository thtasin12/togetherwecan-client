"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CalendarPlus,
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import type { CommunityEvent } from "@/lib/types";
import { EVENT_TYPES, type EventType } from "@/lib/types";
import { eventStyle } from "@/lib/event-style";
import { EventCard } from "@/components/event-card";
import { EventGridSkeleton } from "@/components/skeletons";
import { Reveal } from "@/components/reveal";
import { toast } from "sonner";

type When = "all" | "week" | "month";
type Sort = "soonest" | "popular" | "newest";

const whenLabels: Record<When, string> = {
  all: "Any time",
  week: "This week",
  month: "This month",
};

const sortLabels: Record<Sort, string> = {
  soonest: "Soonest first",
  popular: "Most popular",
  newest: "Newest added",
};

function EventsInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "All");
  const [location, setLocation] = useState(searchParams.get("loc") || "All Locations");
  const [when, setWhen] = useState<When>((searchParams.get("when") as When) || "all");
  const [sort, setSort] = useState<Sort>((searchParams.get("sort") as Sort) || "soonest");
  const [availableOnly, setAvailableOnly] = useState(searchParams.get("available") === "1");

  useEffect(() => {
    api<{ events: CommunityEvent[] }>("/api/events")
      .then((data) => setEvents(data.events))
      .catch(() => toast.error("Failed to load events"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setType(searchParams.get("type") || "All");
    setLocation(searchParams.get("loc") || "All Locations");
    setWhen((searchParams.get("when") as When) || "all");
    setSort((searchParams.get("sort") as Sort) || "soonest");
    setAvailableOnly(searchParams.get("available") === "1");
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (type !== "All") params.set("type", type);
      if (location !== "All Locations") params.set("loc", location);
      if (when !== "all") params.set("when", when);
      if (sort !== "soonest") params.set("sort", sort);
      if (availableOnly) params.set("available", "1");
      const next = params.toString();
      if (next !== searchParams.toString()) {
        router.replace(`${pathname}${next ? `?${next}` : ""}`, { scroll: false });
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, type, location, when, sort, availableOnly, pathname, router, searchParams]);

  const locations = useMemo(
    () => ["All Locations", ...Array.from(new Set(events.map((event) => event.location))).sort()],
    [events]
  );

  const filtered = useMemo(() => {
    const now = Date.now();
    const q = query.trim().toLowerCase();
    let list = events.filter((event) => {
      const matchType = type === "All" || event.eventType === type;
      const matchLocation = location === "All Locations" || event.location === location;
      const matchQuery =
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.location.toLowerCase().includes(q) ||
        event.eventType.toLowerCase().includes(q);
      const eventTime = new Date(event.date).getTime();
      const matchWhen =
        when === "all" ||
        (when === "week" && eventTime <= now + 7 * 24 * 60 * 60 * 1000) ||
        (when === "month" && eventTime <= now + 30 * 24 * 60 * 60 * 1000);
      const matchAvailable = !availableOnly || !event.isFull;
      return matchType && matchLocation && matchQuery && matchWhen && matchAvailable;
    });

    list = [...list].sort((a, b) => {
      if (sort === "popular") return (b.joinedCount || 0) - (a.joinedCount || 0);
      if (sort === "newest") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    return list;
  }, [events, query, type, location, when, sort, availableOnly]);

  const activeFilters = [
    type !== "All" ? { key: "type", label: type, clear: () => setType("All") } : null,
    location !== "All Locations"
      ? { key: "loc", label: location, clear: () => setLocation("All Locations") }
      : null,
    when !== "all" ? { key: "when", label: whenLabels[when], clear: () => setWhen("all") } : null,
    sort !== "soonest"
      ? { key: "sort", label: sortLabels[sort], clear: () => setSort("soonest") }
      : null,
    availableOnly
      ? { key: "available", label: "Available only", clear: () => setAvailableOnly(false) }
      : null,
  ].filter(Boolean) as Array<{ key: string; label: string; clear: () => void }>;

  const clearAll = () => {
    setQuery("");
    setType("All");
    setLocation("All Locations");
    setWhen("all");
    setSort("soonest");
    setAvailableOnly(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-400">
            <Sparkles size={13} /> Discover
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Upcoming events
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-500 dark:text-neutral-400">
            Find a cause, a time, and a place that works for you. Every event is a chance to make
            your corner of the world a little better.
          </p>
        </div>
        <div className="relative w-full lg:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search events, causes, places..."
            className="w-full rounded-full border border-neutral-200 bg-white py-3 pl-11 pr-10 text-sm shadow-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-brand-600 dark:focus:ring-brand-950"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="sticky top-[72px] z-30 mt-7 rounded-3xl border border-neutral-200/80 bg-white/85 p-3 shadow-lg shadow-neutral-900/5 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/85">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {["All", ...EVENT_TYPES].map((item) => {
            const style = item === "All" ? null : eventStyle(item as EventType);
            const Icon = style?.icon;
            const active = type === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setType(item)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  active
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
              >
                {Icon && <Icon size={12} />}
                {item}
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex flex-col gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <SlidersHorizontal size={13} /> Filters
          </div>
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          >
            {locations.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={when}
            onChange={(event) => setWhen(event.target.value as When)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          >
            {Object.entries(whenLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(event) => setAvailableOnly(event.target.checked)}
              className="h-3.5 w-3.5 accent-brand-600"
            />
            Available only
          </label>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-700 dark:text-neutral-200">
          <Filter size={14} className="text-brand-600 dark:text-brand-400" />
          {filtered.length} {filtered.length === 1 ? "event" : "events"}
        </span>
        {activeFilters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={filter.clear}
            className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-bold text-brand-800 transition hover:bg-brand-200 dark:bg-brand-950 dark:text-brand-300"
          >
            {filter.label} <X size={11} />
          </button>
        ))}
        {activeFilters.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] font-bold text-neutral-500 underline-offset-2 hover:underline dark:text-neutral-400"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mt-5">
        {loading ? (
          <EventGridSkeleton count={6} />
        ) : filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event, index) => (
              <Reveal key={event._id} delay={(index % 6) * 50}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              <Search size={24} />
            </span>
            <h2 className="mt-4 text-xl font-extrabold text-neutral-900 dark:text-white">
              No events match those filters
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500 dark:text-neutral-400">
              Try a different cause or location, or create the event you want to see in the world.
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Clear filters
              </button>
              <Link
                href="/create-event"
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
              >
                <CalendarPlus size={16} /> Create event
              </Link>
            </div>
          </div>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl bg-brand-50 px-6 py-6 dark:bg-brand-950/30 sm:flex-row">
          <div>
            <p className="text-sm font-extrabold text-brand-900 dark:text-brand-200">
              Can&apos;t find the right fit?
            </p>
            <p className="mt-1 text-xs text-brand-700/70 dark:text-brand-300/70">
              Start your own event and invite the community.
            </p>
          </div>
          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            Host an event <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </div>
  );
}

function EventsFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="h-10 w-64 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-8">
        <EventGridSkeleton count={6} />
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsFallback />}>
      <EventsInner />
    </Suspense>
  );
}
