"use client";

import { Suspense, use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
  UserRound,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Attendee, CommunityEvent } from "@/lib/types";
import { dateParts, formatDate } from "@/lib/format";
import { eventStyle } from "@/lib/event-style";
import { AttendeeStack } from "@/components/attendee-stack";
import { CapacityMeter } from "@/components/capacity-meter";
import { CommentWall } from "@/components/comment-wall";
import { Countdown } from "@/components/countdown";
import { EventCard } from "@/components/event-card";
import { SaveButton } from "@/components/save-button";
import { ShareButtons } from "@/components/share-buttons";
import { DetailsSkeleton } from "@/components/skeletons";
import { toast } from "sonner";

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <EventDetailsContent params={params} />
    </Suspense>
  );
}

function EventDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [event, setEvent] = useState<CommunityEvent | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [related, setRelated] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [eventData, attendeeData, allEvents] = await Promise.all([
        api<{ event: CommunityEvent }>(`/api/events/${id}`),
        api<{ attendees: Attendee[] }>(`/api/events/${id}/attendees`),
        api<{ events: CommunityEvent[] }>("/api/events"),
      ]);
      setEvent(eventData.event);
      setAttendees(attendeeData.attendees);
      setRelated(
        allEvents.events
          .filter((item) => item._id !== id)
          .sort((a, b) => {
            const aScore = a.eventType === eventData.event.eventType ? 1 : 0;
            const bScore = b.eventType === eventData.event.eventType ? 1 : 0;
            return bScore - aScore;
          })
          .slice(0, 3)
      );
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Event not found");
      router.push("/events");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async (
    path: string,
    method: "POST" | "DELETE",
    successMessage: string
  ) => {
    if (!user) {
      toast.info("Please log in first");
      router.push(`/login?next=/events/${id}`);
      return;
    }
    setBusy(true);
    try {
      await api(path, { method });
      toast.success(successMessage);
      await load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  if (loading || authLoading) return <DetailsSkeleton />;
  if (!event) return null;

  const style = eventStyle(event.eventType);
  const Icon = style.icon;
  const date = dateParts(event.date);
  const ended = new Date(event.date) < new Date();
  const joined = Boolean(event.joined);
  const waitlisted = Boolean(event.waitlisted);
  const full = Boolean(event.isFull);

  let actionLabel = "Join event";
  let action: () => void = () =>
    runAction(`/api/events/${id}/join`, "POST", "You're in! See you there.");
  let actionStyle = "bg-brand-600 hover:bg-brand-700 text-white";

  if (ended) {
    actionLabel = "Event ended";
    action = () => {};
    actionStyle = "bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400";
  } else if (joined) {
    actionLabel = "Leave event";
    action = () =>
      runAction(`/api/events/${id}/join`, "DELETE", "You have left the event");
    actionStyle =
      "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 dark:bg-neutral-900 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/30";
  } else if (waitlisted && full) {
    actionLabel = "Leave waitlist";
    action = () =>
      runAction(`/api/events/${id}/waitlist`, "DELETE", "You have left the waitlist");
    actionStyle =
      "bg-amber-500 text-white hover:bg-amber-600";
  } else if (waitlisted) {
    actionLabel = "Claim your spot";
    action = () =>
      runAction(`/api/events/${id}/join`, "POST", "Spot claimed. You're in!");
    actionStyle = "bg-brand-600 hover:bg-brand-700 text-white";
  } else if (full) {
    actionLabel = "Join waitlist";
    action = () =>
      runAction(
        `/api/events/${id}/waitlist`,
        "POST",
        "You're on the waitlist. We'll promote you when a spot opens."
      );
    actionStyle = "bg-amber-500 text-white hover:bg-amber-600";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-500 transition hover:text-brand-700 dark:text-neutral-400 dark:hover:text-brand-400"
      >
        <ArrowLeft size={15} /> Back to events
      </Link>

      {/* HERO */}
      <div className="relative mt-5 overflow-hidden rounded-[2rem] border border-neutral-200 bg-neutral-900 shadow-2xl dark:border-neutral-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail}
          alt={event.title}
          className="h-[360px] w-full object-cover sm:h-[440px] lg:h-[480px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-neutral-950/10" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide ${style.badge}`}>
              <Icon size={12} /> {event.eventType}
            </span>
            {full && (
              <span className="rounded-full bg-rose-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                Full
              </span>
            )}
            {joined && (
              <span className="rounded-full bg-brand-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                You&apos;re going
              </span>
            )}
            {waitlisted && (
              <span className="rounded-full bg-amber-400 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-amber-950">
                On waitlist
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {event.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-white/80">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={15} className="text-lime-300" /> {formatDate(event.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={15} className="text-lime-300" /> {event.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users size={15} className="text-lime-300" /> {event.joinedCount || 0} going
                </span>
              </div>
            </div>
            <div className="w-full max-w-xs">
              <Countdown date={event.date} />
            </div>
          </div>
        </div>

        <div className="absolute right-4 top-4 flex items-center gap-2 sm:right-6 sm:top-6">
          <SaveButton eventId={id} saved={event.saved} size={19} />
        </div>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_370px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                <Sparkles size={17} />
              </span>
              <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white">
                About this event
              </h2>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">
              {event.description}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                { icon: HeartHandshake, title: "Bring your energy", text: "No experience needed — just show up ready to help." },
                { icon: Clock3, title: "Be on time", text: `We start at ${date.time}. Arrive a few minutes early.` },
                { icon: ShieldCheck, title: "Safe & supported", text: "The host will brief everyone before the work begins." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <item.icon size={18} className="text-brand-600 dark:text-brand-400" />
                  <p className="mt-2 text-xs font-extrabold text-neutral-900 dark:text-white">{item.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <CommentWall eventId={id} eventOwnerEmail={event.createdBy?.email || ""} />
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-5 lg:sticky lg:top-24">
          <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">Your spot</p>
                <p className="mt-1 text-2xl font-black text-neutral-900 dark:text-white">
                  {joined ? "You're in" : full ? "Waitlist" : "Join us"}
                </p>
              </div>
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${style.soft} ${style.badge}`}>
                <Icon size={21} />
              </span>
            </div>

            <div className="mt-4">
              <CapacityMeter joinedCount={event.joinedCount || 0} capacity={event.capacity} />
            </div>

            {event.waitlistCount ? (
              <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                {event.waitlistCount} {event.waitlistCount === 1 ? "person is" : "people are"} on the waitlist.
              </p>
            ) : null}

            <button
              type="button"
              onClick={action}
              disabled={busy || ended}
              className={`mt-5 w-full rounded-full py-3.5 text-sm font-extrabold shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${actionStyle}`}
            >
              {busy ? "Updating..." : actionLabel}
            </button>

            <div className="mt-4 grid gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <p className="flex items-center gap-2">
                <CalendarDays size={14} className="text-brand-600 dark:text-brand-400" />
                {formatDate(event.date)}
              </p>
              <p className="flex items-center gap-2">
                <Clock3 size={14} className="text-brand-600 dark:text-brand-400" />
                Starts at {date.time}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 font-semibold text-brand-700 hover:underline dark:text-brand-400"
              >
                <MapPin size={14} /> Open location in Maps
              </a>
            </div>

            {attendees.length > 0 && (
              <div className="mt-5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                  Who&apos;s going
                </p>
                <AttendeeStack attendees={attendees} />
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">Share the cause</p>
            <div className="mt-3">
              <ShareButtons event={event} />
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              Bring a friend — community events are better together.
            </p>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">Hosted by</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                <UserRound size={20} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-neutral-900 dark:text-white">
                  {event.createdBy?.name}
                </p>
                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {event.createdBy?.email}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-brand-700 dark:text-brand-400">
              <Tag size={12} /> {event.eventType} organizer
            </div>
          </section>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-400">
                Keep the momentum
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                More ways to help
              </h2>
            </div>
            <Link href="/events" className="text-sm font-bold text-brand-700 hover:underline dark:text-brand-400">
              View all
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <EventCard key={item._id} event={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
