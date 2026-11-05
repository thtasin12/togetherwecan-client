"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Users } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { EVENT_TYPES, type CommunityEvent, type EventType } from "@/lib/types";
import { toast } from "sonner";

type FormState = {
  title: string;
  description: string;
  eventType: EventType;
  thumbnail: string;
  location: string;
  date: string;
  capacity: string;
};

export function EventForm({ initial }: { initial?: CommunityEvent }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split("T")[0];

  const [form, setForm] = useState<FormState>({
    title: initial?.title || "",
    description: initial?.description || "",
    eventType: (initial?.eventType as EventType) || "Cleanup",
    thumbnail: initial?.thumbnail || "",
    location: initial?.location || "",
    date: initial?.date ? initial.date.slice(0, 10) : "",
    capacity: initial?.capacity ? String(initial.capacity) : "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (form.title.trim().length < 5) next.title = "Title must be at least 5 characters";
    if (form.description.trim().length < 20)
      next.description = "Description must be at least 20 characters";
    if (!form.thumbnail.trim()) next.thumbnail = "Thumbnail image URL is required";
    else if (!/^https?:\/\/.+\..+/.test(form.thumbnail.trim()))
      next.thumbnail = "Please enter a valid image URL (https://...)";
    if (form.location.trim().length < 3) next.location = "Location is required";
    if (!form.date) next.date = "Event date is required";
    else if (new Date(form.date) <= new Date()) next.date = "Event date must be in the future";
    if (form.capacity.trim()) {
      const capacity = Number(form.capacity);
      if (!Number.isInteger(capacity) || capacity < 1)
        next.capacity = "Capacity must be a whole number of 1 or more";
      else if (capacity > 10000) next.capacity = "Capacity must be 10,000 or less";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        capacity: form.capacity.trim() ? Number(form.capacity) : null,
      };
      if (isEdit) {
        await api(`/api/events/${initial!._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Event updated successfully!");
        router.push("/manage-events");
      } else {
        await api("/api/events", { method: "POST", body: JSON.stringify(payload) });
        toast.success("Event created successfully!");
        router.push("/events");
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-brand-600 dark:focus:ring-brand-950";
  const err = (key: keyof FormState) =>
    errors[key] ? <p className="mt-1.5 text-xs font-medium text-rose-500">{errors[key]}</p> : null;
  const label = "mb-2 block text-sm font-bold text-neutral-700 dark:text-neutral-200";

  return (
    <form
      onSubmit={submit}
      className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_70px_-40px_rgba(15,23,42,0.35)] dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="border-b border-neutral-100 bg-gradient-to-r from-brand-50 via-white to-emerald-50 px-6 py-5 dark:border-neutral-800 dark:from-brand-950/40 dark:via-neutral-900 dark:to-emerald-950/30 sm:px-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-400">
          {isEdit ? "Update your event" : "Host a community event"}
        </p>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          A clear title, a welcoming description, and a realistic capacity go a long way.
        </p>
      </div>

      <div className="space-y-5 p-6 sm:p-8">
        <div>
          <div className="flex items-center justify-between">
            <label className={label}>Event title</label>
            <span className="text-[11px] font-medium text-neutral-400">{form.title.length}/120</span>
          </div>
          <input
            className={inputCls}
            maxLength={120}
            placeholder="e.g. Winter Clothes Distribution"
            value={form.title}
            onChange={(event) => set("title", event.target.value)}
          />
          {err("title")}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className={label}>Description</label>
            <span className="text-[11px] font-medium text-neutral-400">{form.description.length}/2000</span>
          </div>
          <textarea
            rows={5}
            maxLength={2000}
            className={`${inputCls} resize-y`}
            placeholder="Describe the event, what volunteers will do, who it helps..."
            value={form.description}
            onChange={(event) => set("description", event.target.value)}
          />
          {err("description")}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label}>Event type</label>
            <select
              className={inputCls}
              value={form.eventType}
              onChange={(event) => set("eventType", event.target.value)}
            >
              {EVENT_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Event date</label>
            <input
              type="date"
              min={minDate}
              className={inputCls}
              value={form.date}
              onChange={(event) => set("date", event.target.value)}
            />
            {err("date")}
          </div>
          <div>
            <label className={label}>Capacity (optional)</label>
            <div className="relative">
              <Users size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="number"
                min={1}
                max={10000}
                inputMode="numeric"
                placeholder="Unlimited"
                className={`${inputCls} pl-10`}
                value={form.capacity}
                onChange={(event) => set("capacity", event.target.value)}
              />
            </div>
            {err("capacity")}
          </div>
        </div>

        <div>
          <label className={label}>Location</label>
          <input
            className={inputCls}
            placeholder="e.g. Mirpur 10, Dhaka"
            value={form.location}
            onChange={(event) => set("location", event.target.value)}
          />
          {err("location")}
        </div>

        <div>
          <label className={label}>Thumbnail image URL</label>
          <input
            className={inputCls}
            placeholder="https://example.com/event-photo.jpg"
            value={form.thumbnail}
            onChange={(event) => set("thumbnail", event.target.value)}
          />
          {err("thumbnail")}
        </div>

        {form.thumbnail && /^https?:\/\/.+/.test(form.thumbnail) && (
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.thumbnail}
              alt="Thumbnail preview"
              className="h-52 w-full object-cover"
            />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
              <ImageIcon size={11} /> Preview
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gradient-to-r from-brand-600 to-emerald-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : isEdit ? "Update event" : "Create event"}
        </button>
      </div>
    </form>
  );
}
