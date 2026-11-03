"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  CalendarPlus,
  CheckCircle2,
  HandHeart,
  HeartHandshake,
  Leaf,
  Mail,
  MapPin,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";
import type { CommunityEvent, PublicStats } from "@/lib/types";
import { EVENT_TYPES } from "@/lib/types";
import { eventStyle } from "@/lib/event-style";
import { dateParts } from "@/lib/format";
import { EventCard } from "@/components/event-card";
import { EventCardSkeleton } from "@/components/skeletons";
import { Reveal } from "@/components/reveal";
import { toast } from "sonner";

const steps = [
  {
    icon: Search,
    title: "Find a cause",
    text: "Browse cleanups, plantation drives, donations and more happening near you.",
  },
  {
    icon: CalendarCheck2,
    title: "Join in one click",
    text: "Reserve your spot, add it to your calendar, and invite a friend along.",
  },
  {
    icon: HandHeart,
    title: "Make it count",
    text: "Show up, meet good people, and track the impact you are creating.",
  },
];

export default function HomePage() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    Promise.all([
      api<{ events: CommunityEvent[] }>("/api/events"),
      api<{ stats: PublicStats }>("/api/stats"),
    ])
      .then(([eventData, statData]) => {
        setEvents(eventData.events);
        setStats(statData.stats);
      })
      .catch(() => toast.error("Could not load the community feed"))
      .finally(() => setLoading(false));
  }, []);

  const featured = useMemo(
    () =>
      events.reduce<CommunityEvent | null>(
        (best, event) =>
          !best || (event.joinedCount || 0) > (best.joinedCount || 0) ? event : best,
        null
      ),
    [events]
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    events.forEach((event) => counts.set(event.eventType, (counts.get(event.eventType) || 0) + 1));
    return counts;
  }, [events]);

  const gallery = events.filter((event) => event.thumbnail).slice(0, 5);

  const subscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("You're on the list! Community stories are on the way.");
    setEmail("");
  };

  const featuredDate = featured ? dateParts(featured.date) : null;

  return (
    <div>
      {/* HERO */}
      <section className="hero-mesh relative overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-lime-400/20 blur-3xl animate-float" />
          <div className="absolute -right-20 top-24 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-300/10 blur-3xl animate-pulse-glow" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-14 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-100 backdrop-blur">
              <Sparkles size={13} className="text-lime-300" />
              Community-powered volunteering
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Small actions.
              <br />
              <span className="text-gradient">Real change.</span> Together.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-100/85 sm:text-lg">
              Discover local cleanups, plantation drives, donations and learning events.
              Show up for your community — and leave with something bigger than a checklist.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-7 py-3.5 text-sm font-extrabold text-brand-950 shadow-xl shadow-lime-300/20 transition hover:-translate-y-0.5 hover:bg-lime-200"
              >
                Explore events <ArrowRight size={16} />
              </Link>
              <Link
                href="/create-event"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                <CalendarPlus size={16} /> Host an event
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-brand-100/70">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-lime-300" /> Community moderated
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-lime-300" /> Free to join
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users size={14} className="text-lime-300" /> {stats?.volunteers ?? 0} volunteers
              </span>
            </div>
          </div>

          <div className="relative animate-fade-up lg:justify-self-end">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-white/5 blur-2xl" />
            {loading ? (
              <div className="relative h-[430px] w-full max-w-md animate-pulse rounded-[2rem] bg-white/10" />
            ) : featured ? (
              <Link
                href={`/events/${featured._id}`}
                className="group relative block w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white p-3 text-neutral-900 shadow-2xl transition hover:-translate-y-1"
              >
                <div className="relative aspect-[16/11] overflow-hidden rounded-[1.5rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.thumbnail}
                    alt={featured.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-lime-300 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-brand-950">
                    Featured event
                  </span>
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                      {featuredDate?.weekday}, {featuredDate?.month} {featuredDate?.day}
                    </p>
                    <p className="mt-1 line-clamp-1 max-w-[260px] text-lg font-extrabold">
                      {featured.title}
                    </p>
                  </div>
                </div>
                <div className="px-3 pb-2 pt-4">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                    <MapPin size={13} className="text-brand-600" /> {featured.location}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-700">
                      {featured.joinedCount || 0}
                      {featured.capacity ? ` / ${featured.capacity}` : ""} volunteers
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-brand-700">
                      View event <ArrowUpRight size={13} />
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-600 to-lime-400"
                      style={{
                        width: featured.capacity
                          ? `${Math.min(100, Math.round(((featured.joinedCount || 0) / featured.capacity) * 100))}%`
                          : "35%",
                      }}
                    />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="relative w-full max-w-md rounded-[2rem] border border-white/20 bg-white/10 p-8 text-center backdrop-blur">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-300 text-brand-950">
                  <HeartHandshake size={26} />
                </span>
                <h2 className="mt-4 text-xl font-extrabold">Your event could be here</h2>
                <p className="mt-2 text-sm text-brand-100/75">
                  Be the first to bring people together for a cause you care about.
                </p>
                <Link
                  href="/create-event"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-brand-800"
                >
                  Create the first event <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-black/15">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-7 sm:grid-cols-4 sm:px-6">
            {[
              { value: stats?.events, label: "Upcoming events" },
              { value: stats?.volunteers, label: "Volunteers" },
              { value: stats?.communities, label: "Communities" },
              { value: stats?.joins, label: "Connections made" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-2xl font-black text-white sm:text-3xl">
                  {item.value ?? "—"}
                  {item.value !== undefined && item.value > 0 ? "+" : ""}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-brand-200/70">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-400">
                Find your cause
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                Where will you show up?
              </h2>
              <p className="mt-2 max-w-xl text-sm text-neutral-500 dark:text-neutral-400">
                Every cause needs a different kind of energy. Pick the one that fits yours.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:underline dark:text-brand-400"
            >
              Browse all <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {EVENT_TYPES.map((type:any , index: any) => {
            const style = eventStyle(type);
            const Icon = style.icon;
            return (
              <Reveal key={type} delay={index * 50}>
                <Link
                  href={`/events?type=${encodeURIComponent(type)}`}
                  className={`group flex h-full flex-col rounded-3xl border border-neutral-200 p-5 transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl dark:border-neutral-800 dark:hover:border-brand-700 ${style.soft}`}
                >
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white ${style.solid}`}>
                    <Icon size={20} />
                  </span>
                  <p className="mt-4 text-sm font-extrabold text-neutral-900 dark:text-white">{type}</p>
                  <p className="mt-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {categoryCounts.get(type) || 0} upcoming
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 opacity-0 transition group-hover:opacity-100 dark:text-brand-400">
                    Explore <ArrowRight size={12} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="features" className="border-y border-neutral-200/70 bg-white py-20 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-400">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              From scrolling to showing up.
            </h2>
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              No long applications. No awkward onboarding. Just find something good and go.
            </p>
          </Reveal>

          <div className="relative mt-12 grid gap-5 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-9 hidden h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent dark:via-brand-800 md:block" />
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 90}>
                <div className="relative h-full rounded-3xl border border-neutral-200 bg-white p-6 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                  <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-950 text-lime-300 shadow-xl shadow-brand-950/20">
                    <step.icon size={25} />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-lime-300 text-[10px] font-black text-brand-950">
                      {index + 1}
                    </span>
                  </span>
                  <h3 className="mt-5 text-lg font-extrabold text-neutral-900 dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-400">
                Happening soon
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                Come make a difference.
              </h2>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Upcoming events from organizers in your community.
              </p>
            </div>
            <Link
              href="/events"
              className="hidden items-center gap-1.5 text-sm font-bold text-brand-700 hover:underline dark:text-brand-400 sm:inline-flex"
            >
              View all <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>

        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <EventCardSkeleton key={index} />)
            : events.slice(0, 3).map((event, index) => (
                <Reveal key={event._id} delay={index * 80}>
                  <EventCard event={event} />
                </Reveal>
              ))}
        </div>

        {!loading && events.length === 0 && (
          <div className="mt-9 rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-14 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              <CalendarPlus size={24} />
            </span>
            <h3 className="mt-4 text-xl font-extrabold text-neutral-900 dark:text-white">
              The calendar is wide open
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500 dark:text-neutral-400">
              Be the first to create a cleanup, plantation drive, or donation event in your area.
            </p>
            <Link
              href="/create-event"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              <PlusCircle size={16} /> Create an event
            </Link>
          </div>
        )}
      </section>

      {/* GALLERY */}
      {gallery.length >= 3 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-400">
                  Moments that matter
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                  The community in motion.
                </h2>
              </div>
              <Link href="/events" className="text-sm font-bold text-brand-700 hover:underline dark:text-brand-400">
                Join in
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid auto-rows-[150px] grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((event, index) => (
              <Link
                key={event._id}
                href={`/events/${event._id}`}
                className={`group relative overflow-hidden rounded-2xl ${
                  index === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.thumbnail}
                  alt={event.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="line-clamp-1 text-xs font-bold text-white">{event.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/70">
                    <MapPin size={10} /> {event.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-950 px-6 py-12 text-white sm:px-12">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-200">
                  <Mail size={12} /> Stay in the loop
                </span>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                  Good news, once in a while.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-100/75">
                  Get new events, impact stories, and community wins. No noise, no spam.
                </p>
              </div>
              <form onSubmit={subscribe} className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-brand-200/50 outline-none backdrop-blur focus:border-lime-300"
                />
                <button
                  type="submit"
                  className="rounded-full bg-lime-300 px-6 py-3 text-sm font-extrabold text-brand-950 transition hover:bg-lime-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-lime-50 p-8 dark:border-brand-900 dark:from-brand-950/40 dark:via-neutral-900 dark:to-lime-950/20 sm:flex-row sm:items-center sm:p-10">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
              <Leaf size={24} />
            </span>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                Have a cause worth gathering for?
              </h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Create an event in minutes. We will help you fill the room.
              </p>
            </div>
          </div>
          <Link
            href="/create-event"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700"
          >
            <CalendarPlus size={16} /> Start hosting
          </Link>
        </div>
      </section>
    </div>
  );
}
