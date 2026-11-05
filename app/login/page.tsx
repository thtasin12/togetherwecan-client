"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";

function LoginInner() {
  const { login, googleLogin } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push(next);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-11 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-brand-900";

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2">
      <div className="hidden items-center justify-center rounded-3xl bg-gradient-to-br from-brand-800 to-brand-600 p-10 text-white lg:flex">
        <div className="text-center">
          <p className="text-3xl font-extrabold leading-snug">
            "A better community starts with you."
          </p>
          <p className="mt-4 text-sm text-brand-100">
            Log in to continue making an impact with people in your area.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Welcome Back!</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Log in to continue making an impact.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
              Email address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className={inputCls}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined })); }}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showPw ? "text" : "password"}
                placeholder="Enter your password"
                className={`${inputCls} pr-11`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((x) => ({ ...x, password: undefined })); }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label="Toggle password visibility"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-neutral-400">
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" /> or
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <div className="flex justify-center [&>div]:w-full">
          <GoogleLogin
            onSuccess={async (cred) => {
              try {
                await googleLogin(cred.credential || "");
                toast.success("Welcome back!");
                router.push(next);
              } catch (err) {
                toast.error(err instanceof ApiError ? err.message : "Google login failed");
              }
            }}
            onError={() => toast.error("Google login failed. Try again.")}
            theme="outline"
            size="large"
            width="100%"
          />
        </div>

        <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
