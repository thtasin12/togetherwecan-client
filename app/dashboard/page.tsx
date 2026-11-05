"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarCheck2,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  Heart,
  HeartHandshake,
  Leaf,
  Lock,
  MapPin,
  MessageCircle,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type {
  Badge,
  CommunityEvent,
  Promotion,
  UserStats,
} from "@/lib/types";
import { Protected } from "@/components/protected";
import { DashboardSkeleton } from "@/components/skeletons";
import { Reveal } from "@/components/reveal";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

const badgeIcons: Record<string, typeof Award> = {
  "first-step": Sparkles,
  regular: CalendarCheck2,
  changemaker: Trophy,
  host: HeartHandshake,
  builder: Users,
  "crowd-puller": Award,
  curator: Heart,
  voice: MessageCircle,
};

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: typeof Award;
  label: string;
  value: number;
  hint: string;
  tone: string;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tone}`}>
          <Icon size={19} />
        </span>
        <span className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">{value}</span>
      </div>
      <p className="mt-4 text-sm font-extrabold text-neutral-900 dark:text-white">{label}</p>
      <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">{hint}</p>
    </div>
  );
}

function MiniEventRow({ event }: { event: CommunityEvent }) {
  return (
    <Link
      href={`/events/${event._id}`}
      className="group flex items-center gap-3 rounded-2xl border border-transparent p-2 transition hover:border-neutral-200 hover:bg-neutral-50 dark:hover:border-neutral-800 dark:hover:bg-neutral-950"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={event.thumbnail}
        alt={event.title}
        className="h-14 w-16 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-extrabold text-neutral-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-400">
          {event.title}
        </p>
        <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-neutral-500 dark:text-neutral-400">
          <MapPin size={11} /> {event.location}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-brand-700 dark:text-brand-400">
          <Clock3 size={11} /> {formatDate(event.date)}
        </p>
      </div>
      <ArrowRight size={15} className="shrink-0 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
    </Link>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const Icon = badgeIcons[badge.id] || Award;
  return (
    <div
      className={`relative rounded-2xl border p-3.5 transition ${
        badge.earned
          ? "border-brand-200 bg-brand-50 dark:border-brand-900 dark:bg-brand-950/30"
          : "border-neutral-200 bg-neutral-50 opacity-70 dark:border-neutral-800 dark:bg-neutral-950"
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          badge.earned
            ? "bg-brand-600 text-white"
            : "bg-neutral-200 text-neutral-400 dark:bg-neutral-800"
        }`}
      >
        {badge.earned ? <Icon size={17} /> : <Lock size={15} />}
      </span>
      <p className="mt-2.5 text-xs font-extrabold text-neutral-900 dark:text-white">{badge.label}</p>
      <p className="mt-0.5 text-[10px] leading-relaxed text-neutral-500 dark:text-neutral-400">
        {badge.description}
      </p>
      {badge.earned && (
        <CheckCircle2 size={14} className="absolute right-2.5 top-2.5 text-brand-600 dark:text-brand-400" />
      )}
    </div>
  );
}

function DashboardInner() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [joined, setJoined] = useState<CommunityEvent[]>([]);
  const [hosted, setHosted] = useState<CommunityEvent[]>([]);
  const [saved, setSaved] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<{ stats: UserStats; promotions: Promotion[] }>("/api/users/stats"),
      api<{ events: CommunityEvent[] }>("/api/joins/my"),
      api<{ events: CommunityEvent[] }>("/api/events/mine"),
      api<{ events: CommunityEvent[] }>("/api/saves/my"),
    ])
      .then(([statData, joinedData, hostedData, savedData]) => {
        setStats(statData.stats);
        setPromotions(statData.promotions || []);
        setJoined(joinedData.events);
        setHosted(hostedData.events);
        setSaved(savedData.events);
      })
      .catch(() => toast.error("Could not load your dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const earned = stats?.badges.filter((badge) => badge.earned).length || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-400">
            <Sparkles size={13} /> Your impact
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Welcome back, {user?.name?.split(" ")[0] || "friend"}.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-500 dark:text-neutral-400">
            Here is what you have been part of, and what is coming up next.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/events"
            className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Browse events
          </Link>
          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            <CalendarPlus size={15} /> Host
          </Link>
        </div>
      </div>

      {promotions.length > 0 && (
        <div className="mt-6 space-y-2">
          {promotions.map((promotion) => (
            <Link
              key={`${promotion.event._id}-${promotion.promotedAt}`}
              href={`/events/${promotion.event._id}`}
              className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 transition hover:bg-amber-100 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-amber-950">
                <Trophy size={17} />
              </span>
              <span className="flex-1">
                <strong className="font-extrabold">A spot opened up!</strong> You were moved from
                the waitlist into <strong>{promotion.event.title}</strong>.
              </span>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CalendarCheck2}
          label="Events joined"
          value={stats?.joined || 0}
          hint="Causes you showed up for"
          tone="bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
        />
        <StatCard
          icon={HeartHandshake}
          label="Events hosted"
          value={stats?.hosted || 0}
          hint="Gatherings you created"
          tone="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        />
        <StatCard
          icon={Users}
          label="Volunteers reached"
          value={stats?.volunteersReached || 0}
          hint="People in your hosted events"
          tone="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
        />
        <StatCard
          icon={Heart}
          label="Saved events"
          value={stats?.saved || 0}
          hint="Ideas for your next free day"
          tone="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
        />
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Reveal>
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white">Coming up</h2>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    Events you are joining next.
                  </p>
                </div>
                <Link href="/joined-events" className="text-xs font-bold text-brand-700 hover:underline dark:text-brand-400">
                  View all
                </Link>
              </div>
              <div className="mt-4 space-y-1">
                {joined.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-neutral-200 px-4 py-8 text-center dark:border-neutral-800">
                    <CalendarCheck2 size={22} className="mx-auto text-neutral-300 dark:text-neutral-600" />
                    <p className="mt-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                      Nothing on the calendar yet.
                    </p>
                    <Link href="/events" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-400">
                      Find your first event <ArrowRight size={12} />
                    </Link>
                  </div>
                ) : (
                  joined.slice(0, 4).map((event) => <MiniEventRow key={event._id} event={event} />)
                )}
              </div>
            </section>
          </Reveal>

          <Reveal delay={80}>
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white">Your events</h2>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    Events you are hosting.
                  </p>
                </div>
                <Link href="/manage-events" className="text-xs font-bold text-brand-700 hover:underline dark:text-brand-400">
                  Manage
                </Link>
              </div>
              <div className="mt-4 space-y-1">
                {hosted.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-neutral-200 px-4 py-8 text-center dark:border-neutral-800">
                    <Leaf size={22} className="mx-auto text-neutral-300 dark:text-neutral-600" />
                    <p className="mt-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                      You have not hosted an event yet.
                    </p>
                    <Link href="/create-event" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-400">
                      Start your first event <ArrowRight size={12} />
                    </Link>
                  </div>
                ) : (
                  hosted.slice(0, 4).map((event) => <MiniEventRow key={event._id} event={event} />)
                )}
              </div>
            </section>
          </Reveal>
        </div>

        <div className="space-y-6">
          <Reveal delay={40}>
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  <Award size={17} />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white">Badges</h2>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {earned} of {stats?.badges.length || 0} earned
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {stats?.badges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delay={100}>
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-neutral-900 dark:text-white">Saved for later</h2>
                <Link href="/saved-events" className="text-[11px] font-bold text-brand-700 hover:underline dark:text-brand-400">
                  View all
                </Link>
              </div>
              <div className="mt-3 space-y-1">
                {saved.length === 0 ? (
                  <p className="rounded-2xl bg-neutral-50 px-4 py-5 text-center text-xs text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
                    Tap the heart on any event to keep it here.
                  </p>
                ) : (
                  saved.slice(0, 3).map((event) => <MiniEventRow key={event._id} event={event} />)
                )}
              </div>
            </section>
          </Reveal>

          {stats && (stats.comments > 0 || stats.waitlisted > 0) && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900">
                <MessageCircle size={18} className="mx-auto text-brand-600 dark:text-brand-400" />
                <p className="mt-2 text-xl font-black text-neutral-900 dark:text-white">{stats.comments}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Messages</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900">
                <Clock3 size={18} className="mx-auto text-amber-500" />
                <p className="mt-2 text-xl font-black text-neutral-900 dark:text-white">{stats.waitlisted}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Waitlisted</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Protected>
      <DashboardInner />
    </Protected>
  );
}
