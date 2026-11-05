"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  HeartHandshake,
  ImageIcon,
  Lock,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", photoURL: "", password: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<typeof form> = {};
    if (form.name.trim().length < 3) next.name = "Name must be at least 3 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address";
    if (form.photoURL && !/^https?:\/\/.+\..+/.test(form.photoURL))
      next.photoURL = "Photo URL must start with http(s)://";
    const password = form.password;
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    else if (!/[A-Z]/.test(password)) next.password = "Password must contain an uppercase letter";
    else if (!/[a-z]/.test(password)) next.password = "Password must contain a lowercase letter";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created successfully! Welcome to TogetherWeCan.");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-2xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm text-neutral-800 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-brand-600 dark:focus:ring-brand-950";
  const err = (key: keyof typeof form) =>
    errors[key] ? <p className="mt-1.5 text-xs font-medium text-rose-500">{errors[key]}</p> : null;

  const passwordChecks = [
    { label: "At least 6 characters", ok: form.password.length >= 6 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(form.password) },
    { label: "One lowercase letter", ok: /[a-z]/.test(form.password) },
  ];

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden rounded-[2rem] bg-brand-950 p-10 text-white lg:block">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-lime-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-200">
            <Sparkles size={12} /> Join the community
          </span>
          <h1 className="mt-6 text-3xl font-black leading-tight">
            Your next good deed
            <br />
            starts with a{" "}
            <span className="text-lime-300">small step.</span>
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-100/75">
            Create a free account to join events, save causes, host your own gatherings, and track
            the impact you are making.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "One-click event registration",
              "Personal impact dashboard",
              "Save events and get waitlist alerts",
              "Host and manage your own events",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-brand-100/85">
                <CheckCircle2 size={16} className="text-lime-300" /> {item}
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-2 text-xs font-semibold text-brand-200/70">
            <HeartHandshake size={16} className="text-lime-300" /> Local actions. Real impact.
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.35)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
        <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Join free and start making a difference.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-neutral-700 dark:text-neutral-200">
              Full name
            </label>
            <div className="relative">
              <UserRound size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Enter your name"
                className={inputCls}
                value={form.name}
                onChange={(event) => set("name", event.target.value)}
              />
            </div>
            {err("name")}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-neutral-700 dark:text-neutral-200">
              Email address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                placeholder="you@example.com"
                className={inputCls}
                value={form.email}
                onChange={(event) => set("email", event.target.value)}
              />
            </div>
            {err("email")}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-neutral-700 dark:text-neutral-200">
              Photo URL <span className="font-medium text-neutral-400">(optional)</span>
            </label>
            <div className="relative">
              <ImageIcon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="https://example.com/photo.jpg"
                className={inputCls}
                value={form.photoURL}
                onChange={(event) => set("photoURL", event.target.value)}
              />
            </div>
            {err("photoURL")}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-neutral-700 dark:text-neutral-200">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showPw ? "text" : "password"}
                placeholder="Create a password"
                className={`${inputCls} pr-11`}
                value={form.password}
                onChange={(event) => set("password", event.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPw((value) => !value)}
                aria-label="Toggle password visibility"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {err("password")}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {passwordChecks.map((check) => (
                <span
                  key={check.label}
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                    check.ok
                      ? "text-brand-700 dark:text-brand-400"
                      : "text-neutral-400 dark:text-neutral-500"
                  }`}
                >
                  <CheckCircle2 size={11} /> {check.label}
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-brand-600 to-emerald-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create free account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-brand-700 hover:underline dark:text-brand-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
