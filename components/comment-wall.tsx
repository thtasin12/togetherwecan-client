"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { initials, relativeTime } from "@/lib/format";
import type { EventComment } from "@/lib/types";

export function CommentWall({
  eventId,
  eventOwnerEmail,
}: {
  eventId: string;
  eventOwnerEmail: string;
}) {
  const { user } = useAuth();
  const [comments, setComments] = useState<EventComment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    api<{ comments: EventComment[] }>(`/api/events/${eventId}/comments`)
      .then((data) => setComments(data.comments))
      .catch(() => toast.error("Could not load the discussion"))
      .finally(() => setLoading(false));
  }, [eventId]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    try {
      const data = await api<{ comment: EventComment }>(
        `/api/events/${eventId}/comments`,
        { method: "POST", body: JSON.stringify({ body }) }
      );
      setComments((current) => [data.comment, ...current]);
      setBody("");
      toast.success("Message posted");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not post your message");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (commentId: string) => {
    if (deleting) return;
    setDeleting(commentId);
    try {
      await api(`/api/comments/${commentId}`, { method: "DELETE" });
      setComments((current) => current.filter((comment) => comment._id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete the comment");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          <MessageCircle size={18} />
        </span>
        <div>
          <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white">Community wall</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Ask a question or share your excitement.
          </p>
        </div>
        <span className="ml-auto rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
          {comments.length}
        </span>
      </div>

      {user ? (
        <form onSubmit={submit} className="mt-5">
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Write something encouraging..."
            className="w-full resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-brand-600 dark:focus:ring-brand-950"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] font-medium text-neutral-400">{body.length}/500</span>
            <button
              type="submit"
              disabled={!body.trim() || submitting}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={14} /> {submitting ? "Posting..." : "Post message"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-4 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-400">
          <Link href={`/login?next=/events/${eventId}`} className="font-bold text-brand-700 hover:underline dark:text-brand-400">
            Log in
          </Link>{" "}
          to join the conversation.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div key={item} className="flex gap-3">
                <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-3 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-neutral-400 dark:text-neutral-500">
            No messages yet. Be the first to say hello.
          </p>
        ) : (
          comments.map((comment) => {
            const canDelete =
              user?.email === comment.userEmail || user?.email === eventOwnerEmail;
            return (
              <article key={comment._id} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-[11px] font-extrabold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {comment.authorPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={comment.authorPhoto}
                      alt={comment.authorName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials(comment.authorName)
                  )}
                </span>
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm bg-neutral-50 px-4 py-3 dark:bg-neutral-950">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-bold text-neutral-900 dark:text-white">
                      {comment.authorName}
                    </p>
                    <span className="text-[10px] text-neutral-400">{relativeTime(comment.createdAt)}</span>
                    {comment.userEmail === eventOwnerEmail && (
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        Host
                      </span>
                    )}
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => remove(comment._id)}
                        disabled={deleting === comment._id}
                        aria-label="Delete comment"
                        className="ml-auto text-neutral-400 transition hover:text-rose-500"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {comment.body}
                  </p>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
