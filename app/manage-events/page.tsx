"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { CommunityEvent } from "@/lib/types";
import { Protected } from "@/components/protected";
import { EventForm } from "@/components/event-form";
import { EventCard } from "@/components/event-card";
import { EventCardSkeleton } from "@/components/skeletons";
import { toast } from "sonner";

function ManageInner() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CommunityEvent | null>(null);
  const [deleting, setDeleting] = useState<CommunityEvent | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    api<{ events: CommunityEvent[] }>("/api/events/mine")
      .then((d) => setEvents(d.events))
      .catch(() => toast.error("Could not load your events"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await api(`/api/events/${deleting._id}`, { method: "DELETE" });
      toast.success("Event deleted successfully");
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Update Event</h1>
          <button
            onClick={() => setEditing(null)}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-4 py-1.5 text-sm text-neutral-700 dark:border-neutral-800 dark:text-neutral-200"
          >
            <X size={14} /> Cancel
          </button>
        </div>
        <EventForm initial={editing} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
        Manage Events
      </h1>
      <p className="mt-2 text-neutral-500 dark:text-neutral-400">
        Update or delete events you have created.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
          : events.map((e) => (
              <div key={e._id} className="flex flex-col">
                <EventCard event={e} />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setEditing(e)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-brand-300 dark:hover:bg-brand-950/40"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleting(e)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
      </div>

      {!loading && events.length === 0 && (
        <p className="mt-16 text-center text-neutral-500 dark:text-neutral-400">
          You haven&apos;t created any events yet.
        </p>
      )}

      {/* custom delete confirm modal */}
      {deleting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Delete Event?</h3>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-neutral-700 dark:text-neutral-200">"{deleting.title}"</span>?
              This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleting(null)}
                className="flex-1 rounded-full border border-neutral-200 py-2 text-sm font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={busy}
                className="flex-1 rounded-full bg-red-600 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {busy ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManageEventsPage() {
  return (
    <Protected>
      <ManageInner />
    </Protected>
  );
}
