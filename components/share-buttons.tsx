"use client";

import { CalendarPlus, Download, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { downloadICS, eventShareUrl, toGoogleCalendarUrl } from "@/lib/format";
import type { CommunityEvent } from "@/lib/types";

const buttonClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-brand-700 dark:hover:text-brand-400";

export function ShareButtons({ event }: { event: CommunityEvent }) {
  const copyLink = async () => {
    const url = eventShareUrl(event._id);
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Event link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const share = async () => {
    const url = eventShareUrl(event._id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Join ${event.title} on TogetherWeCan`,
          url,
        });
        return;
      } catch {
        return;
      }
    }
    await copyLink();
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={share} className={buttonClass} title="Share event" aria-label="Share event">
        <Share2 size={17} />
      </button>
      <button type="button" onClick={copyLink} className={buttonClass} title="Copy link" aria-label="Copy event link">
        <Link2 size={17} />
      </button>
      <a
        href={toGoogleCalendarUrl(event)}
        target="_blank"
        rel="noreferrer"
        className={buttonClass}
        title="Add to Google Calendar"
        aria-label="Add to Google Calendar"
      >
        <CalendarPlus size={17} />
      </a>
      <button
        type="button"
        onClick={() => downloadICS(event)}
        className={buttonClass}
        title="Download calendar file"
        aria-label="Download calendar file"
      >
        <Download size={17} />
      </button>
    </div>
  );
}
