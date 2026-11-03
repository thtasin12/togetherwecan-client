"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export function SaveButton({
  eventId,
  saved = false,
  onChange,
  className = "",
  size = 18,
}: {
  eventId: string;
  saved?: boolean;
  onChange?: (saved: boolean) => void;
  className?: string;
  size?: number;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(saved);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setIsSaved(saved);
  }, [saved]);

  const toggle = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      toast.info("Log in to save events for later");
      router.push(`/login?next=/events/${eventId}`);
      return;
    }
    if (busy) return;

    const next = !isSaved;
    setIsSaved(next);
    setBusy(true);
    try {
      await api(`/api/events/${eventId}/save`, {
        method: next ? "POST" : "DELETE",
      });
      onChange?.(next);
      toast.success(next ? "Event saved" : "Removed from saved events");
    } catch (err) {
      setIsSaved(!next);
      toast.error(err instanceof ApiError ? err.message : "Could not update saved events");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isSaved ? "Remove from saved events" : "Save event"}
      aria-pressed={isSaved}
      title={isSaved ? "Remove from saved events" : "Save event"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition active:scale-95 ${
        isSaved
          ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/70 dark:text-rose-400"
          : "border-white/40 bg-white/80 text-neutral-600 hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:bg-neutral-800"
      } ${busy ? "opacity-70" : ""} ${className}`}
    >
      <Heart size={size} className={isSaved ? "fill-current" : ""} />
    </button>
  );
}
