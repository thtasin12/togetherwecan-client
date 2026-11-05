"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, LayoutDashboard, Save, UserRound } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { Protected } from "@/components/protected";
import { initials } from "@/lib/format";
import { toast } from "sonner";

function ProfileInner() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [busy, setBusy] = useState(false);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }
    if (photoURL && !/^https?:\/\/.+\..+/.test(photoURL)) {
      toast.error("Photo URL must start with http(s)://");
      return;
    }
    setBusy(true);
    try {
      await updateProfile({ name: name.trim(), photoURL: photoURL.trim() });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-brand-600 dark:focus:ring-brand-950";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-400">
            <UserRound size={13} /> Your account
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Profile
          </h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Manage how you appear to other volunteers and organizers.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <LayoutDashboard size={15} /> Dashboard
        </Link>
      </div>

      <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="relative h-28 bg-gradient-to-r from-brand-800 via-brand-600 to-emerald-500 rounded-t-[2rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_45%)] rounded-t-[2rem]" />
        </div>
        <div className="px-6 pb-8 sm:px-8">
          <div className="-mt-10 flex items-end justify-between">
            <span className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-brand-100 text-xl font-black text-brand-700 shadow-lg dark:border-neutral-900 dark:bg-brand-950 dark:text-brand-300">
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                initials(user?.name || "U")
              )}
            </span>
            <span className="mb-2 rounded-full bg-brand-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              Community member
            </span>
          </div>

          <h2 className="mt-3 text-xl font-extrabold text-neutral-900 dark:text-white">{user?.name}</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{user?.email}</p>

          <form onSubmit={save} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-neutral-700 dark:text-neutral-200">
                Full name
              </label>
              <input className={inputCls} value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-neutral-700 dark:text-neutral-200">
                Photo URL
              </label>
              <input
                className={inputCls}
                placeholder="https://example.com/photo.jpg"
                value={photoURL}
                onChange={(event) => setPhotoURL(event.target.value)}
              />
              <p className="mt-1.5 text-[11px] text-neutral-400">
                Paste a square image URL for the best result.
              </p>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-emerald-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={15} /> {busy ? "Saving..." : "Save changes"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3 dark:bg-neutral-950">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Want to see your impact at a glance?
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-400"
            >
              Open dashboard <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Protected>
      <ProfileInner />
    </Protected>
  );
}
